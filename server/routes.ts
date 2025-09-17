import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertNewsletterSignupSchema, insertContactMessageSchema } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
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
      const { priceId, email, name } = req.body;

      const customer = await stripe.customers.create({
        email: email,
        name: name,
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: priceId,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      res.send({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      return res.status(400).send({ error: { message: error.message } });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
