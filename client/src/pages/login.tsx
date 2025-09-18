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

export default function LoginPage() {
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = useMemo(() => {
    if (typeof window === "undefined") {
      return "/download";
    }

    const params = new URLSearchParams(window.location.search);
    return params.get("redirect") || "/download";
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await apiRequest("POST", "/api/auth/login", {
        username: formState.username.trim(),
        password: formState.password,
      });

      const user = await response.json();
      setUser(user);

      toast({
        title: "Welcome back",
        description: "You are now signed in."
      });

      setLocation(redirectTarget);
    } catch (error: any) {
      toast({
        title: "Unable to sign in",
        description: error?.message ?? "Check your credentials and try again.",
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
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Access your projects and subscription settings.</CardDescription>
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
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
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
