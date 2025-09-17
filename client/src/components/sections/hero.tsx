import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Link } from "wouter";

export default function Hero() {
  const [detectedOS, setDetectedOS] = useState("Windows");

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Mac OS X') !== -1) {
      setDetectedOS('macOS');
    } else if (userAgent.indexOf('Linux') !== -1) {
      setDetectedOS('Linux');
    }
  }, []);

  return (
    <section className="pt-24 pb-16 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Professional <span className="text-primary">Audio Transcription</span><br />
            That Never Leaves Your Device
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            VoiceFlowPro delivers enterprise-quality transcription using AI that runs entirely offline. Perfect for journalists, podcasters, and professionals who value privacy and performance.
          </p>
          
          {/* OS-Aware Download CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/download">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 font-medium" data-testid="primary-download-button">
                <Download className="w-5 h-5 mr-2" />
                Download for <span data-testid="detected-os">{detectedOS}</span>
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-border hover:bg-card text-foreground px-8 py-4 font-medium" data-testid="trial-button">
              Start Free Trial
            </Button>
          </div>

          <div className="text-sm text-muted-foreground mb-12" data-testid="hero-features">
            <span>✓ 30-minute free trial</span>
            <span className="mx-4">✓ No credit card required</span>
            <span>✓ Works offline</span>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto animate-slide-up">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800" 
              alt="VoiceFlowPro Desktop Application Interface" 
              className="rounded-xl shadow-2xl w-full"
              data-testid="hero-screenshot"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
