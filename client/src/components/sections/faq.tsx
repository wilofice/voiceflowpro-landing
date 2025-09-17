import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const faqs = [
    {
      question: "Is my audio data sent to any servers?",
      answer: "No, VoiceFlowPro processes everything locally on your device. Your audio files never leave your computer, ensuring complete privacy and GDPR compliance."
    },
    {
      question: "How accurate is the transcription?",
      answer: "VoiceFlowPro achieves 95%+ accuracy on clear speech using state-of-the-art AI models. Accuracy depends on audio quality, speaker clarity, and background noise levels."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period, and we offer a 14-day money-back guarantee."
    },
    {
      question: "What audio formats are supported?",
      answer: "VoiceFlowPro supports MP3, WAV, M4A, FLAC, OGG, and most common audio formats. It can also extract audio from MP4, MOV, and AVI video files."
    },
    {
      question: "How fast is the transcription process?",
      answer: "Processing speed depends on your hardware, but typically processes 1 hour of audio in under 5 minutes. GPU acceleration significantly improves speed on supported systems."
    },
    {
      question: "Do you offer educational discounts?",
      answer: "Yes, we offer 50% discounts for students, educators, and academic institutions. Contact our sales team with your academic credentials for verification."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section id="faq" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" data-testid="faq-title">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground" data-testid="faq-subtitle">Everything you need to know about VoiceFlowPro</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-card border-border"
              data-testid="faq-search"
            />
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-card border border-border rounded-lg" data-testid={`faq-item-${index}`}>
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  onClick={() => toggleFaq(index)}
                  data-testid={`faq-question-${index}`}
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      openItems.has(index) ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openItems.has(index) && (
                  <div className="px-6 pb-4 text-muted-foreground" data-testid={`faq-answer-${index}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground" data-testid="faq-no-results">
              No FAQ items match your search.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
