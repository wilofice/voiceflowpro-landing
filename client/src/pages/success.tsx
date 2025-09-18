import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Success() {
  const [location] = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'processing' | 'failed'>('processing');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get('payment_intent');
    const redirectStatus = urlParams.get('redirect_status');

    // Simulate payment verification (you might want to call your backend to verify)
    setTimeout(() => {
      if (redirectStatus === 'succeeded') {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('failed');
      }
      setIsVerifying(false);
    }, 2000);
  }, []);

  const handleDownload = () => {
    window.location.href = '/download';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                <CardTitle>Verifying Payment</CardTitle>
                <CardDescription>
                  Please wait while we confirm your payment...
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle className="text-red-500">Payment Failed</CardTitle>
                <CardDescription>
                  There was an issue processing your payment. Please try again or contact support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={handleGoHome} className="w-full">
                    Return to Home
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/pricing'} className="w-full">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-500">Payment Successful!</CardTitle>
              <CardDescription>
                Thank you for your purchase. Your subscription to VoiceFlowPro has been activated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    You now have access to:
                  </p>
                  <ul className="text-sm space-y-1 text-left">
                    <li>• Unlimited transcription minutes</li>
                    <li>• Advanced AI-powered accuracy</li>
                    <li>• Real-time transcription</li>
                    <li>• Priority customer support</li>
                  </ul>
                </div>
                
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download VoiceFlowPro
                </Button>
                
                <Button variant="outline" onClick={handleGoHome} className="w-full">
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
