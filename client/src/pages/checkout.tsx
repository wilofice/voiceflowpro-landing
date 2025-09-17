import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { stripePromise, STRIPE_PRICES } from "@/lib/stripe";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CheckoutForm = ({ plan, billing }: { plan: string; billing: string }) => {
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
      period: billing === 'annual' ? 'year' : 'month'
    },
    team: {
      name: "Team Plan",
      price: billing === 'annual' ? 490 : 49,
      period: billing === 'annual' ? 'year' : 'month'
    }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails];

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
  const [clientSecret, setClientSecret] = useState("");
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "" });
  const [plan, setPlan] = useState("pro");
  const [billing, setBilling] = useState("monthly");

  useEffect(() => {
    // Get plan and billing info from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const urlPlan = urlParams.get('plan') || 'pro';
    const urlBilling = urlParams.get('billing') || 'monthly';
    setPlan(urlPlan);
    setBilling(urlBilling);

    // Create subscription when we have customer info
    if (customerInfo.name && customerInfo.email) {
      const priceId = STRIPE_PRICES[`${urlPlan.toUpperCase()}_${urlBilling.toUpperCase()}` as keyof typeof STRIPE_PRICES];
      
      apiRequest("POST", "/api/create-subscription", {
        priceId,
        email: customerInfo.email,
        name: customerInfo.name
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error('Error creating subscription:', error);
        });
    }
  }, [customerInfo]);

  if (!customerInfo.name || !customerInfo.email) {
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
                    onClick={() => {
                      if (customerInfo.name && customerInfo.email) {
                        // This will trigger the useEffect to create subscription
                      }
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={!customerInfo.name || !customerInfo.email}
                    data-testid="customer-info-continue"
                  >
                    Continue to Payment
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

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" data-testid="checkout-loading" />
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
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm plan={plan} billing={billing} />
          </Elements>
        </div>
      </main>
      <Footer />
    </div>
  );
}
