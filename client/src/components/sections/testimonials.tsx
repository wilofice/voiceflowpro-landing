import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Alex Rodriguez",
      role: "Investigative Journalist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      quote: "VoiceFlowPro has transformed how I handle sensitive interviews. The offline processing means I can guarantee source protection while getting accurate transcripts in minutes instead of hours."
    },
    {
      name: "Riley Chen",
      role: "Podcast Producer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b2e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      quote: "The batch processing feature is a game-changer. I can queue up a week's worth of episodes overnight and have all the transcripts ready for editing by morning. Saves us 20+ hours weekly."
    }
  ];

  const stats = [
    { label: "Active Users", value: "10,000+" },
    { label: "Hours Transcribed", value: "50M+" },
    { label: "Accuracy Rate", value: "95%+" },
    { label: "User Rating", value: "4.8/5" }
  ];

  return (
    <section className="py-24 px-4 bg-card">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" data-testid="testimonials-title">Trusted by Professionals</h2>
          <p className="text-xl text-muted-foreground" data-testid="testimonials-subtitle">Join thousands of journalists, podcasters, and content creators</p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background p-8 rounded-lg border border-border" data-testid={`testimonial-${index}`}>
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={`${testimonial.name}, ${testimonial.role}`} 
                    className="w-12 h-12 rounded-full mr-4"
                    data-testid={`testimonial-avatar-${index}`}
                  />
                  <div>
                    <div className="font-semibold" data-testid={`testimonial-name-${index}`}>{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground" data-testid={`testimonial-role-${index}`}>{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4" data-testid={`testimonial-quote-${index}`}>"{testimonial.quote}"</p>
                <div className="flex text-yellow-500" data-testid={`testimonial-rating-${index}`}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} data-testid={`stat-${index}`}>
                <div className="text-3xl font-bold text-primary" data-testid={`stat-value-${index}`}>{stat.value}</div>
                <div className="text-muted-foreground" data-testid={`stat-label-${index}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
