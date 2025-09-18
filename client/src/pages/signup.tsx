import { FormEvent, useMemo, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

const MIN_PASSWORD_LENGTH = 8;

export default function SignupPage() {
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = useMemo(() => {
    if (typeof window === "undefined") {
      return { plan: "starter", billing: "monthly" } as const;
    }

    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan")?.toLowerCase() ?? "starter";
    const billing = params.get("billing")?.toLowerCase() ?? "monthly";

    return {
      plan: plan === "pro" || plan === "team" || plan === "starter" ? plan : "starter",
      billing: billing === "annual" ? "annual" : "monthly",
    } as const;
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.password !== formState.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please confirm your password before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (formState.password.length < MIN_PASSWORD_LENGTH) {
      toast({
        title: "Password too short",
        description: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiRequest("POST", "/api/auth/signup", {
        username: formState.username.trim(),
        email: formState.email.trim(),
        password: formState.password,
      });

      const user = await response.json();
      setUser(user);

      toast({
        title: "Welcome to VoiceFlowPro",
        description: "Your account is ready."
      });

      if (redirectTarget.plan === "starter") {
        setLocation("/download");
        return;
      }

      setLocation(`/checkout?plan=${redirectTarget.plan}&billing=${redirectTarget.billing}`);
    } catch (error: any) {
      toast({
        title: "Unable to create account",
        description: error?.message ?? "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>Create your account</CardTitle>
              <CardDescription>Sign up to unlock your VoiceFlowPro workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formState.username}
                    onChange={(event) =>
                      setFormState((state) => ({ ...state, username: event.target.value }))
                    }
                    required
                    minLength={3}
                    maxLength={32}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(event) =>
                      setFormState((state) => ({ ...state, email: event.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formState.password}
                    onChange={(event) =>
                      setFormState((state) => ({ ...state, password: event.target.value }))
                    }
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formState.confirmPassword}
                    onChange={(event) =>
                      setFormState((state) => ({ ...state, confirmPassword: event.target.value }))
                    }
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
