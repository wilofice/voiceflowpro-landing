import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [, setLocation] = useLocation();

  const plans = [
    {
      name: "Starter",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for trying out VoiceFlowPro",
      features: [
        { name: "Up to 30 minutes/month", included: true },
        { name: "Basic transcription", included: true },
        { name: "Standard export formats", included: true },
        { name: "Batch processing", included: false },
        { name: "Speaker identification", included: false },
      ],
      cta: "Get Started",
      ctaVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: { monthly: 29, annual: 290 },
      description: "For professional content creators",
      features: [
        { name: "Unlimited transcription", included: true },
        { name: "Batch processing", included: true },
        { name: "Speaker identification", included: true },
        { name: "Professional exports", included: true },
        { name: "Priority support", included: true },
      ],
      cta: "Start Pro Trial",
      ctaVariant: "default" as const,
      popular: true,
    },
    {
      name: "Team",
      price: { monthly: 49, annual: 490 },
      description: "For collaborative workflows",
      features: [
        { name: "Everything in Pro", included: true },
        { name: "Team collaboration", included: true },
        { name: "Shared libraries", included: true },
        { name: "Admin dashboard", included: true },
        { name: "API access", included: true },
      ],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
      popular: false,
    },
  ];

  const comparisonFeatures = [
    { name: "Monthly transcription limit", starter: "30 minutes", pro: "Unlimited", team: "Unlimited" },
    { name: "Batch processing", starter: false, pro: true, team: true },
    { name: "Speaker identification", starter: false, pro: true, team: true },
    { name: "Team collaboration", starter: false, pro: false, team: true },
    { name: "API access", starter: false, pro: false, team: true },
  ];

  const handlePlanSelection = (planName: string) => {
    const planSlug = planName.toLowerCase();

    if (planSlug === "starter") {
      setLocation(`/signup?plan=${planSlug}`);
      return;
    }

    if (planSlug === "pro" || planSlug === "team") {
      setLocation(`/checkout?plan=${planSlug}&billing=${isAnnual ? "annual" : "monthly"}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24">
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4" data-testid="pricing-title">Simple, Transparent Pricing</h1>
              <p className="text-xl text-muted-foreground mb-8" data-testid="pricing-subtitle">
                Choose the plan that fits your workflow. All plans include offline processing and privacy protection.
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <span className={`text-sm ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isAnnual ? 'bg-primary' : 'bg-muted'
                  }`}
                  data-testid="billing-toggle"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isAnnual ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Annual <span className="text-primary font-semibold">Save 20%</span>
                </span>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`bg-card p-8 rounded-lg border relative ${
                    plan.popular ? 'border-primary border-2' : 'border-border'
                  }`}
                  data-testid={`pricing-card-${plan.name.toLowerCase()}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2" data-testid={`plan-name-${index}`}>{plan.name}</h3>
                    <div className="text-4xl font-bold mb-2" data-testid={`plan-price-${index}`}>
                      {plan.price[isAnnual ? 'annual' : 'monthly'] === 0 ? (
                        'Free'
                      ) : (
                        <>
                          ${plan.price[isAnnual ? 'annual' : 'monthly']}
                          <span className="text-lg text-muted-foreground">
                            {isAnnual ? '/year' : '/month'}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-muted-foreground" data-testid={`plan-description-${index}`}>{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3" data-testid={`plan-feature-${index}-${featureIndex}`}>
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={plan.ctaVariant}
                    className="w-full py-3 font-medium"
                    onClick={() => handlePlanSelection(plan.name)}
                    data-testid={`plan-cta-${index}`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>

            {/* Feature Comparison Matrix */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8" data-testid="comparison-title">Feature Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-lg border border-border" data-testid="comparison-table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4">Feature</th>
                      <th className="text-center p-4">Starter</th>
                      <th className="text-center p-4">Pro</th>
                      <th className="text-center p-4">Team</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className="border-b border-border" data-testid={`comparison-row-${index}`}>
                        <td className="p-4 font-medium" data-testid={`comparison-feature-${index}`}>{feature.name}</td>
                        <td className="text-center p-4" data-testid={`comparison-starter-${index}`}>
                          {typeof feature.starter === 'boolean' ? (
                            feature.starter ? (
                              <Check className="w-4 h-4 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            feature.starter
                          )}
                        </td>
                        <td className="text-center p-4" data-testid={`comparison-pro-${index}`}>
                          {typeof feature.pro === 'boolean' ? (
                            feature.pro ? (
                              <Check className="w-4 h-4 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            feature.pro
                          )}
                        </td>
                        <td className="text-center p-4" data-testid={`comparison-team-${index}`}>
                          {typeof feature.team === 'boolean' ? (
                            feature.team ? (
                              <Check className="w-4 h-4 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            feature.team
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
