import { ShieldCheck, Zap, Layers } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: ShieldCheck,
      title: "100% Offline",
      description: "Your audio never leaves your device. GDPR and HIPAA compliant by design with complete privacy control."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process 1 hour of audio in under 5 minutes with GPU acceleration and 95%+ accuracy on clear speech."
    },
    {
      icon: Layers,
      title: "Batch Processing",
      description: "Queue multiple files, process overnight, and wake up to completed transcriptions ready for export."
    }
  ];

  const workflow = [
    {
      step: "1",
      title: "Capture",
      description: "Import audio from any source - interviews, meetings, podcasts, or live recordings."
    },
    {
      step: "2",
      title: "Transcribe",
      description: "AI processes your audio locally with industry-leading accuracy and speaker identification."
    },
    {
      step: "3",
      title: "Edit",
      description: "Refine transcripts with keyboard shortcuts and intelligent editing tools."
    },
    {
      step: "4",
      title: "Publish",
      description: "Export to your favorite tools - Final Cut Pro, Premiere, Word, or custom formats."
    }
  ];

  return (
    <section id="features" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" data-testid="features-title">Built for Professional Workflows</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="features-subtitle">
            Everything you need to transcribe, edit, and publish audio content with confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-card p-8 rounded-lg border border-border" data-testid={`feature-card-${index}`}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3" data-testid={`feature-title-${index}`}>{feature.title}</h3>
              <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Workflow Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold mb-6" data-testid="workflow-title">Your Complete Transcription Workflow</h3>
            <div className="space-y-6">
              {workflow.map((item, index) => (
                <div key={index} className="flex items-start space-x-4" data-testid={`workflow-step-${index}`}>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" data-testid={`workflow-step-title-${index}`}>{item.title}</h4>
                    <p className="text-muted-foreground" data-testid={`workflow-step-description-${index}`}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="VoiceFlowPro Workflow Interface" 
              className="rounded-lg shadow-lg w-full"
              data-testid="workflow-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
