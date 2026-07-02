#!/usr/bin/env node
/*
 * Seed the shared `socialLinks` entry and link it from Navigation.
 *
 * Belated Section-0 addition: Section 1 (Navigation) was built before the
 * shared components existed, so it had no social-links data. This script:
 *   1. creates + publishes the `socialLinks` content type
 *   2. creates + publishes one entry "social-links-global" (the brand accounts)
 *   3. adds a `socialLinks` Link field to the existing `navigation` content type
 *   4. links "social-links-global" onto every existing navigation entry
 *
 * The Footer (Section 11) will link this same entry — edit once, reflected in
 * both the nav mobile menu and the footer.
 *
 * Env (from .env.local): CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN,
 * CONTENTFUL_ENVIRONMENT (optional, default "master"). Re-runnable.
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const envFile = join(scriptDir, "..", ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const ENV = process.env.CONTENTFUL_ENVIRONMENT || "master";
const CMA = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE || !CMA) {
  console.error(
    "✗ CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN must be set in .env.local."
  );
  process.exit(1);
}

const BASE = `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}`;

const api = async (path, opts = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${CMA}`,
      "Content-Type": "application/vnd.contentful.management.v1+json",
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`${opts.method || "GET"} ${path} → ${res.status}\n${text}`);
    err.status = res.status;
    throw err;
  }
  return text ? JSON.parse(text) : null;
};

const publishType = (id, version) =>
  api(`/content_types/${id}/published`, {
    method: "PUT",
    headers: { "X-Contentful-Version": String(version) },
  });

// ---- 1. socialLinks content type -----------------------------------------

const SOCIAL_LINKS_TYPE = {
  name: "Social Links",
  description:
    "Shared set of brand social URLs. Linked from Navigation and Footer.",
  displayField: "internalName",
  fields: [
    { id: "internalName", name: "Internal Name", type: "Symbol", required: true },
    { id: "facebookUrl", name: "Facebook URL", type: "Symbol" },
    { id: "twitterUrl", name: "X / Twitter URL", type: "Symbol" },
    { id: "linkedinUrl", name: "LinkedIn URL", type: "Symbol" },
    { id: "instagramUrl", name: "Instagram URL", type: "Symbol" },
    { id: "youtubeUrl", name: "YouTube URL", type: "Symbol" },
  ],
};

const upsertContentType = async (id, spec) => {
  let version;
  try {
    const existing = await api(`/content_types/${id}`);
    version = existing.sys.version;
    console.log(`• content type "${id}" exists (v${version}) → updating`);
  } catch (e) {
    if (e.status !== 404) throw e;
    console.log(`• content type "${id}" → creating`);
  }
  const result = await api(`/content_types/${id}`, {
    method: "PUT",
    headers: version ? { "X-Contentful-Version": String(version) } : {},
    body: JSON.stringify(spec),
  });
  await publishType(id, result.sys.version);
  console.log(`  ✓ published "${id}"`);
};

await upsertContentType("socialLinks", SOCIAL_LINKS_TYPE);

// ---- locale ----------------------------------------------------------------

const locales = await api("/locales");
const defaultLocale =
  locales.items.find((l) => l.default)?.code || locales.items[0]?.code || "en-US";
const L = (v) => ({ [defaultLocale]: v });

// ---- 2. social-links-global entry -----------------------------------------

const upsertEntry = async (contentType, id, fields) => {
  let version;
  try {
    const existing = await api(`/entries/${id}`);
    version = existing.sys.version;
    console.log(`• entry "${id}" exists (v${version}) → updating`);
  } catch (e) {
    if (e.status !== 404) throw e;
    console.log(`• entry "${id}" → creating`);
  }
  const result = await api(`/entries/${id}`, {
    method: "PUT",
    headers: {
      "X-Contentful-Content-Type": contentType,
      ...(version ? { "X-Contentful-Version": String(version) } : {}),
    },
    body: JSON.stringify({ fields }),
  });
  await api(`/entries/${id}/published`, {
    method: "PUT",
    headers: { "X-Contentful-Version": String(result.sys.version) },
  });
  console.log(`  ✓ published "${id}"`);
};

await upsertEntry("socialLinks", "social-links-global", {
  internalName: L("Global Social Links"),
  facebookUrl: L("http://www.facebook.com/CarersWorldwide"),
  twitterUrl: L("http://www.twitter.com/CarersWorldwide"),
  linkedinUrl: L("https://www.linkedin.com/company/carers-worldwide"),
  instagramUrl: L("https://www.instagram.com/carersworldwide/?"),
  youtubeUrl: L("https://www.youtube.com/channel/UCU7TM4tTnY03y2UnHmdevjw/videos"),
});

// ---- 3. add `socialLinks` link field to the navigation content type --------

const nav = await api(`/content_types/navigation`);
if (nav.fields.some((f) => f.id === "socialLinks")) {
  console.log('• navigation.socialLinks field already present → skipping');
} else {
  nav.fields.push({
    id: "socialLinks",
    name: "Social Links",
    type: "Link",
    linkType: "Entry",
    validations: [{ linkContentType: ["socialLinks"] }],
  });
  const updated = await api(`/content_types/navigation`, {
    method: "PUT",
    headers: { "X-Contentful-Version": String(nav.sys.version) },
    body: JSON.stringify({
      name: nav.name,
      description: nav.description,
      displayField: nav.displayField,
      fields: nav.fields,
    }),
  });
  await publishType("navigation", updated.sys.version);
  console.log("  ✓ added + published navigation.socialLinks field");
}

// ---- 4. link the entry onto existing navigation entries --------------------

const navEntries = await api(`/entries?content_type=navigation&limit=100`);
const link = L({ sys: { type: "Link", linkType: "Entry", id: "social-links-global" } });

for (const entry of navEntries.items ?? []) {
  const id = entry.sys.id;
  const already = entry.fields?.socialLinks?.[defaultLocale]?.sys?.id;
  if (already === "social-links-global") {
    console.log(`• navigation entry "${id}" already linked → skipping`);
    continue;
  }
  const fields = { ...entry.fields, socialLinks: link };
  const result = await api(`/entries/${id}`, {
    method: "PUT",
    headers: {
      "X-Contentful-Content-Type": "navigation",
      "X-Contentful-Version": String(entry.sys.version),
    },
    body: JSON.stringify({ fields }),
  });
  await api(`/entries/${id}/published`, {
    method: "PUT",
    headers: { "X-Contentful-Version": String(result.sys.version) },
  });
  console.log(`  ✓ linked social-links-global onto navigation entry "${id}"`);
}

console.log(
  "\nDone. socialLinks content type + global entry seeded and linked to Navigation."
);
