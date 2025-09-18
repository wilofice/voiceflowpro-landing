import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertNewsletterSignupSchema, insertContactMessageSchema, authSignupSchema, authLoginSchema } from "@shared/schema";
import { z } from "zod";
import { captureDownloadMetadata, getDownloadEntry, getDownloadManifest } from "./downloads";
import { log } from "./vite";
import { hashPassword, verifyPassword } from "./auth";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

const stripePriceConfig = {
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
  PRO_ANNUAL: process.env.STRIPE_PRICE_PRO_ANNUAL ?? "",
  TEAM_MONTHLY: process.env.STRIPE_PRICE_TEAM_MONTHLY ?? "",
  TEAM_ANNUAL: process.env.STRIPE_PRICE_TEAM_ANNUAL ?? "",
} as const;

const missingPriceKeys = Object.entries(stripePriceConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingPriceKeys.length) {
  throw new Error(
    `Missing Stripe price configuration: ${missingPriceKeys
      .map((key) => `STRIPE_PRICE_${key}`)
      .join(", ")}`,
  );
}

const priceCatalog = {
  pro: {
    monthly: stripePriceConfig.PRO_MONTHLY,
    annual: stripePriceConfig.PRO_ANNUAL,
  },
  team: {
    monthly: stripePriceConfig.TEAM_MONTHLY,
    annual: stripePriceConfig.TEAM_ANNUAL,
  },
} as const;

const createSubscriptionSchema = z.object({
  plan: z.enum(["pro", "team"]),
  billing: z.enum(["monthly", "annual"]),
  email: z.string().email(),
  name: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Newsletter signup endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSignupSchema.parse(req.body);
      const signup = await storage.createNewsletterSignup(validatedData);
      res.json({ success: true, signup });
    } catch (error: any) {
      res.status(400).json({ message: "Error creating newsletter signup: " + error.message });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json({ success: true, message });
    } catch (error: any) {
      res.status(400).json({ message: "Error creating contact message: " + error.message });
    }
  });

  // Stripe payment intent for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Create subscription for Pro/Team plans
  app.post('/api/create-subscription', async (req, res) => {
    try {
      const { plan, billing, email, name } = createSubscriptionSchema.parse(req.body);

      console.log('priceCatalog:', priceCatalog);
      console.log('plan:', plan);
      console.log('billing:', billing);
      const priceId = priceCatalog[plan][billing];

      const customer = await stripe.customers.create({
        email: email,
        name: name,
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
          payment_method_types: ['card'],
        },
        expand: ['latest_invoice.payment_intent'],
      });

      const latestInvoiceRef = subscription.latest_invoice as
        | Stripe.Invoice
        | Stripe.Response<Stripe.Invoice>
        | string
        | null;

      let invoice: Stripe.Invoice | null = null;
      let invoiceId: string | undefined;

      if (latestInvoiceRef && typeof latestInvoiceRef === 'object') {
        invoice = latestInvoiceRef as Stripe.Invoice;
        invoiceId = invoice.id;
      } else if (typeof latestInvoiceRef === 'string') {
        invoiceId = latestInvoiceRef;
      }

      if (!invoice && invoiceId) {
        invoice = (await stripe.invoices.retrieve(invoiceId, {
          expand: ['payment_intent'],
        })) as unknown as Stripe.Invoice;
      }

      // For incomplete subscriptions, we need to create a setup intent or payment intent
      let clientSecret: string | null = null;

      if (invoice) {
        // Check if invoice already has a payment intent
        const paymentIntent = (invoice as any).payment_intent;
        if (paymentIntent && typeof paymentIntent !== 'string') {
          clientSecret = paymentIntent.client_secret;
        } else if (!paymentIntent && invoice.status === 'open') {
          // Create a payment intent for the open invoice
          const paymentIntentObj = await stripe.paymentIntents.create({
            amount: invoice.amount_due,
            currency: invoice.currency,
            customer: customer.id,
            metadata: {
              subscription_id: subscription.id,
              invoice_id: invoice.id || '',
            },
          });
          clientSecret = paymentIntentObj.client_secret;
        }
      }

      if (!clientSecret) {
        // Fallback: create a setup intent for future payments
        const setupIntent = await stripe.setupIntents.create({
          customer: customer.id,
          payment_method_types: ['card'],
          metadata: {
            subscription_id: subscription.id,
          },
        });
        clientSecret = setupIntent.client_secret;
      }

      if (!clientSecret) {
        log(`Unable to determine client secret for subscription ${subscription.id}`, 'stripe');
        throw new Error('Stripe did not return a client secret for the subscription.');
      }

      res.send({
        subscriptionId: subscription.id,
        clientSecret,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.issues.map((issue) => issue.message).join(", ") });
      }

      return res.status(400).send({ error: { message: error.message } });
    }
  });

  app.get("/api/downloads/manifest", (_req, res) => {
    res.json({ downloads: getDownloadManifest() });
  });

  app.get("/api/downloads/:os", (req, res) => {
    const { os } = req.params;
    const download = getDownloadEntry(os);

    if (!download) {
      return res.status(404).json({ message: "Download bundle not available for the selected platform." });
    }

    const { os: normalizedOs, entry } = download;
    const metadata = captureDownloadMetadata(req, normalizedOs);
    log(`download requested :: ${JSON.stringify(metadata)}`);

    return res.redirect(entry.url as string);
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const payload = authSignupSchema.parse(req.body);

      const [existingUsername, existingEmail] = await Promise.all([
        storage.getUserByUsername(payload.username),
        storage.getUserByEmail(payload.email),
      ]);

      if (existingUsername) {
        return res.status(409).json({ message: "Username is already taken." });
      }

      if (existingEmail) {
        return res.status(409).json({ message: "An account with that email already exists." });
      }

      const passwordHash = await hashPassword(payload.password);
      const user = await storage.createUser({
        username: payload.username,
        password: passwordHash,
        email: payload.email,
      });

      req.session.userId = user.id;
      res.status(201).json({ id: user.id, username: user.username, email: user.email });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.issues.map((issue) => issue.message).join(", ") });
      }

      res.status(500).json({ message: "Unable to create account." });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const payload = authLoginSchema.parse(req.body);
      const user = await storage.getUserByUsername(payload.username);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const isValidPassword = await verifyPassword(payload.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.issues.map((issue) => issue.message).join(", ") });
      }

      res.status(500).json({ message: "Unable to sign in right now." });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out." });
      }

      res.clearCookie("connect.sid");
      res.status(204).end();
    });
  });

  app.get("/api/auth/session", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => undefined);
      return res.status(401).json({ message: "Session expired" });
    }

    res.json({ id: user.id, username: user.username, email: user.email });
  });

  const httpServer = createServer(app);
  return httpServer;
}
