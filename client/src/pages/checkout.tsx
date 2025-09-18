import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { stripePromise, STRIPE_PRICES, StripePriceKey } from "@/lib/stripe";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CheckoutForm = ({ plan, billing }: { plan: "pro" | "team"; billing: "monthly" | "annual" }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to VoiceFlowPro!",
      });
    }
    setIsLoading(false);
  };

  const planDetails = {
    pro: {
      name: "Pro Plan",
      price: billing === 'annual' ? 290 : 29,
      period: billing === 'annual' ? 'year' : 'month',
    },
    team: {
      name: "Team Plan",
      price: billing === 'annual' ? 490 : 49,
      period: billing === 'annual' ? 'year' : 'month',
    },
  } as const;

  const currentPlan = planDetails[plan];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card p-8 rounded-lg border border-border mb-8">
        <h2 className="text-2xl font-bold mb-4" data-testid="checkout-plan-title">
          Subscribe to {currentPlan?.name}
        </h2>
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg">{currentPlan?.name}</span>
          <span className="text-2xl font-bold" data-testid="checkout-price">
            ${currentPlan?.price}/{currentPlan?.period}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg border border-border">
        <h3 className="text-xl font-semibold mb-6">Payment Information</h3>
        <PaymentElement />
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium"
          data-testid="checkout-submit-button"
        >
          {isLoading ? "Processing..." : `Subscribe to ${currentPlan?.name}`}
        </Button>
      </form>
    </div>
  );
};

export default function Checkout() {
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "" });
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, navigate] = useLocation();

  const urlState = useMemo(() => {
    if (typeof window === 'undefined') {
      return { plan: 'pro' as const, billing: 'monthly' as const, sanitized: false };
    }

    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan')?.toLowerCase() ?? 'pro';
    const billingParam = params.get('billing')?.toLowerCase() ?? 'monthly';

    type PlanOption = 'pro' | 'team';
    type BillingOption = 'monthly' | 'annual';

    const plan: PlanOption = planParam === 'team' ? 'team' : 'pro';
    const billing: BillingOption = billingParam === 'annual' ? 'annual' : 'monthly';

    return {
      plan,
      billing,
      sanitized: plan !== planParam || billing !== billingParam,
    };
  }, []);

  const { plan, billing, sanitized } = urlState;

  const loginRedirect = useMemo(() => {
    if (typeof window === 'undefined') {
      return '/checkout';
    }

    return `${window.location.pathname}${window.location.search}`;
  }, []);

  useEffect(() => {
    if (sanitized) {
      toast({
        title: "Using default checkout settings",
        description: "We adjusted your selection to a supported plan and billing cycle.",
      });
    }
  }, [sanitized, toast]);

  useEffect(() => {
    setClientSecret(null);
  }, [plan, billing]);

  useEffect(() => {
    setCustomerInfo((current) => ({
      name: current.name || user?.username || "",
      email: current.email || user?.email || "",
    }));
  }, [user]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-xl mx-auto">
              <CardHeader>
                <CardTitle>Sign in to continue</CardTitle>
                <CardDescription>
                  Create an account or sign in to finish setting up your subscription.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <Button onClick={() => navigate(`/login?redirect=${encodeURIComponent(loginRedirect)}`)}>
                  Sign in
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/signup?plan=${plan}&billing=${billing}`)}
                >
                  Create account
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleContinue = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      return;
    }

    const priceKey = `${plan.toUpperCase()}_${billing.toUpperCase()}` as StripePriceKey;
    const priceId = STRIPE_PRICES[priceKey];

    if (!priceId) {
      toast({
        title: "Unable to start checkout",
        description: "Pricing configuration is missing. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreatingSubscription(true);
      const response = await apiRequest("POST", "/api/create-subscription", {
        plan,
        billing,
        email: customerInfo.email,
        name: customerInfo.name,
      });

      const data = await response.json();
      if (!data?.clientSecret) {
        throw new Error("Missing client secret");
      }

      setClientSecret(data.clientSecret);
    } catch (error: any) {
      toast({
        title: "Subscription error",
        description: error?.message ?? "Failed to create Stripe subscription.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  if (!customerInfo.name || !customerInfo.email || !clientSecret) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-card p-8 rounded-lg border border-border">
                <h2 className="text-2xl font-bold mb-6" data-testid="customer-info-title">Customer Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="bg-background border-border"
                      data-testid="customer-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="bg-background border-border"
                      data-testid="customer-email-input"
                    />
                  </div>
                  <Button
                    onClick={handleContinue}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={!customerInfo.name || !customerInfo.email || isCreatingSubscription}
                    data-testid="customer-info-continue"
                  >
                    {isCreatingSubscription ? "Preparing checkout..." : "Continue to Payment"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Elements stripe={stripePromise} options={{ clientSecret: clientSecret as string }}>
            <CheckoutForm plan={plan} billing={billing} />
          </Elements>
        </div>
      </main>
      <Footer />
    </div>
  );
}
