import { Link } from "wouter";
import { Mic, Twitter, Linkedin, Github } from "lucide-react";

const externalLinks = {
  twitter: "https://x.com/voiceflowpro",
  linkedin: "https://www.linkedin.com/company/voiceflowpro",
  github: "https://github.com/voiceflowpro",
  releaseNotes: "https://voiceflowpro.com/release-notes",
  roadmap: "https://voiceflowpro.com/roadmap",
  documentation: "https://docs.voiceflowpro.com",
  community: "https://community.voiceflowpro.com",
  status: "https://status.voiceflowpro.com",
  privacy: "https://voiceflowpro.com/legal/privacy",
  terms: "https://voiceflowpro.com/legal/terms",
  cookies: "https://voiceflowpro.com/legal/cookies",
  dpa: "mailto:legal@voiceflowpro.com?subject=Data%20Processing%20Agreement",
  security: "mailto:security@voiceflowpro.com",
};

export default function Footer() {
  return (
    <footer className="py-16 px-4 bg-card border-t border-border">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Mic className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">VoiceFlowPro</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Professional desktop transcription software that puts privacy first.
            </p>
            <div className="flex space-x-4">
              <a
                href={externalLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
                data-testid="social-twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={externalLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
                data-testid="social-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={externalLinks.github}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
                data-testid="social-github"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#features" className="text-muted-foreground hover:text-primary" data-testid="footer-features">Features</a></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary" data-testid="footer-pricing">Pricing</Link></li>
              <li><Link href="/download" className="text-muted-foreground hover:text-primary" data-testid="footer-download">Download</Link></li>
              <li>
                <a
                  href={externalLinks.releaseNotes}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  data-testid="footer-release-notes"
                >
                  Release Notes
                </a>
              </li>
              <li>
                <a
                  href={externalLinks.roadmap}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  data-testid="footer-roadmap"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#faq" className="text-muted-foreground hover:text-primary" data-testid="footer-faq">FAQ</a></li>
              <li><a href="/#contact" className="text-muted-foreground hover:text-primary" data-testid="footer-contact">Contact</a></li>
              <li>
                <a
                  href={externalLinks.documentation}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  data-testid="footer-docs"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href={externalLinks.community}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  data-testid="footer-community"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href={externalLinks.status}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  data-testid="footer-status"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={externalLinks.privacy}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  data-testid="footer-privacy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href={externalLinks.terms}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  data-testid="footer-terms"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href={externalLinks.cookies}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  data-testid="footer-cookies"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href={externalLinks.dpa}
                  className="text-muted-foreground hover:text-primary"
                  data-testid="footer-dpa"
                >
                  Data Processing
                </a>
              </li>
              <li>
                <a
                  href={externalLinks.security}
                  className="text-muted-foreground hover:text-primary"
                  data-testid="footer-security"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground" data-testid="copyright">© 2024 VoiceFlowPro. All rights reserved.</p>
            <div className="text-sm text-muted-foreground mt-4 md:mt-0">
              <span>Made with ❤️ for content creators</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
