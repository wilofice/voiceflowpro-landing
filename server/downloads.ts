import type { Request } from "express";

export type SupportedOS = "windows" | "macos" | "linux";

export interface DownloadEntry {
  url: string | null;
  size: string | null;
  sha256: string | null;
  version: string | null;
  releaseNotesUrl: string | null;
  available: boolean;
}

const OS_KEYS: SupportedOS[] = ["windows", "macos", "linux"];

function resolveEnvVar(name: string): string | null {
  return process.env[name] ?? null;
}

function buildDownloadEntry(os: SupportedOS): DownloadEntry {
  const upper = os.toUpperCase();

  const url = resolveEnvVar(`DOWNLOAD_${upper}_URL`);
  const size = resolveEnvVar(`DOWNLOAD_${upper}_SIZE`);
  const sha256 = resolveEnvVar(`DOWNLOAD_${upper}_SHA256`);
  const version =
    resolveEnvVar(`DOWNLOAD_${upper}_VERSION`) ?? resolveEnvVar("APP_VERSION");
  const releaseNotesUrl = resolveEnvVar("DOWNLOAD_RELEASE_NOTES_URL");

  const available = Boolean(url && size && sha256 && version);

  return {
    url,
    size,
    sha256,
    version,
    releaseNotesUrl,
    available,
  };
}

export function getDownloadManifest(): Record<SupportedOS, DownloadEntry> {
  return {
    windows: buildDownloadEntry("windows"),
    macos: buildDownloadEntry("macos"),
    linux: buildDownloadEntry("linux"),
  };
}

export function getDownloadEntry(os: string) {
  if (!OS_KEYS.includes(os as SupportedOS)) {
    return null;
  }

  const typedOs = os as SupportedOS;
  const entry = buildDownloadEntry(typedOs);
  return entry.available ? { os: typedOs, entry } : null;
}

export function captureDownloadMetadata(req: Request, os: SupportedOS) {
  return {
    ip: req.ip,
    userAgent: req.get("user-agent"),
    os,
    timestamp: new Date().toISOString(),
  };
}
