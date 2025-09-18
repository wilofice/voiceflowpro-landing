import { useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Download, Monitor, Laptop, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SupportedOS = "windows" | "macos" | "linux";

interface DownloadEntry {
  url: string | null;
  size: string | null;
  sha256: string | null;
  version: string | null;
  releaseNotesUrl: string | null;
  available: boolean;
}

export default function DownloadPage() {
  const [activeOS, setActiveOS] = useState<SupportedOS>("windows");
  const [manifest, setManifest] = useState<Record<SupportedOS, DownloadEntry> | null>(null);
  const [isLoadingManifest, setIsLoadingManifest] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Mac OS X') !== -1) {
      setActiveOS('macos');
    } else if (userAgent.indexOf('Linux') !== -1) {
      setActiveOS('linux');
    }
  }, []);

  useEffect(() => {
    async function fetchManifest() {
      try {
        const response = await fetch("/api/downloads/manifest", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to load download manifest (${response.status})`);
        }

        const data = (await response.json()) as { downloads: Record<SupportedOS, DownloadEntry> };
        setManifest(data.downloads);
      } catch (error: any) {
        toast({
          title: "Unable to load download information",
          description: error?.message ?? "Please try again shortly.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingManifest(false);
      }
    }

    fetchManifest();
  }, [toast]);

  const osData = {
    windows: {
      name: "Windows",
      icon: Monitor,
      compatibility: "Compatible with Windows 10/11 (64-bit)",
      fallbackSize: "142 MB",
      fallbackSha256: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    },
    macos: {
      name: "macOS",
      icon: Laptop,
      compatibility: "Compatible with macOS 11+ (Intel & Apple Silicon)",
      fallbackSize: "124 MB",
      fallbackSha256: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1",
    },
    linux: {
      name: "Linux",
      icon: Terminal,
      compatibility: "AppImage for Ubuntu 20.04+ and other distributions",
      fallbackSize: "156 MB",
      fallbackSha256: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2",
    },
  } as const;

  const activeManifest = useMemo(() => manifest?.[activeOS] ?? null, [manifest, activeOS]);
  const isDownloadReady = Boolean(activeManifest?.available && activeManifest.url);
  const downloadSize = activeManifest?.size ?? osData[activeOS].fallbackSize;
  const downloadSha = activeManifest?.sha256 ?? osData[activeOS].fallbackSha256;
  const releaseNotesUrl = activeManifest?.releaseNotesUrl ?? null;

  const requirements = [
    {
      title: "Minimum Requirements",
      specs: [
        "4GB RAM",
        "2GB free disk space",
        "Intel/AMD 64-bit processor",
        "Audio input device"
      ]
    },
    {
      title: "Recommended",
      specs: [
        "8GB+ RAM",
        "5GB free disk space",
        "Dedicated GPU (optional)",
        "High-quality microphone"
      ]
    },
    {
      title: "Beta Channel",
      specs: ["Get early access to new features"],
      action: "Join Beta Program"
    }
  ];

  const handleDownload = (os: SupportedOS) => {
    if (!manifest) {
      toast({
        title: "Preparing download",
        description: "We&apos;re still fetching the latest build manifest. Try again in a moment.",
      });
      return;
    }

    const entry = manifest[os];

    if (!entry?.available || !entry.url) {
      toast({
        title: "Build not ready",
        description: "The latest installer is still publishing. Please check back soon.",
      });
      return;
    }

    window.location.href = `/api/downloads/${os}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24">
        <section className="py-24 px-4 bg-card">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4" data-testid="download-title">Download VoiceFlowPro</h1>
              <p className="text-xl text-muted-foreground" data-testid="download-subtitle">Available for Windows, macOS, and Linux</p>
            </div>

            {/* OS Tabs */}
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="bg-background rounded-lg p-1 border border-border">
                  {(Object.entries(osData) as Array<[SupportedOS, typeof osData[SupportedOS]]>).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setActiveOS(key)}
                      className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center space-x-2 ${
                        activeOS === key
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-muted-foreground'
                      }`}
                      data-testid={`os-tab-${key}`}
                    >
                      <data.icon className="w-5 h-5" />
                      <span>{data.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Download Content */}
              <div className="bg-background p-8 rounded-lg border border-border text-center" data-testid="download-content">
                <h3 className="text-2xl font-bold mb-4" data-testid="download-os-title">
                  VoiceFlowPro for {osData[activeOS].name}
                </h3>
                <p className="text-muted-foreground mb-6" data-testid="download-compatibility">
                  {osData[activeOS].compatibility}
                </p>
                
                <Button
                  size="lg"
                  onClick={() => handleDownload(activeOS)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 font-medium mb-6"
                  disabled={!isDownloadReady}
                  data-testid="download-button"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isDownloadReady ? (
                    <>Download for {osData[activeOS].name} ({downloadSize})</>
                  ) : (
                    "Build publishing..."
                  )}
                </Button>
                
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-mono" data-testid="download-sha256">
                    SHA256: {downloadSha}
                  </p>
                  <p>
                    <a
                      href={releaseNotesUrl ?? "#"}
                      className={`text-primary hover:underline ${releaseNotesUrl ? "" : "pointer-events-none opacity-70"}`}
                      data-testid="release-notes-link"
                    >
                      Release notes
                    </a>
                    {" | "}
                    <a href="#" className="text-primary hover:underline" data-testid="system-requirements-link">System requirements</a>
                  </p>
                </div>
              </div>

              {/* System Requirements */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {requirements.map((req, index) => (
                  <div key={index} className="bg-background p-6 rounded-lg border border-border" data-testid={`requirement-card-${index}`}>
                    <h4 className="font-semibold mb-3" data-testid={`requirement-title-${index}`}>{req.title}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {req.specs.map((spec, specIndex) => (
                        <li key={specIndex} data-testid={`requirement-spec-${index}-${specIndex}`}>
                          • {spec}
                        </li>
                      ))}
                    </ul>
                    {req.action && (
                      <button className="text-primary hover:underline text-sm mt-3" data-testid={`requirement-action-${index}`}>
                        {req.action}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
