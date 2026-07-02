import type { SectionDefinition } from "./config";
import { navigationDefinition } from "./definitions/navigation";
import { heroSliderDefinition } from "./definitions/heroSlider";
import { missionStatementDefinition } from "./definitions/missionStatement";
import { countryCardsDefinition } from "./definitions/countryCards";
import { exploreSliderDefinition } from "./definitions/exploreSlider";
import { donationCtaDefinition } from "./definitions/donationCta";
import { spendingAndVideoDefinition } from "./definitions/spendingAndVideo";
import { newsletterSignupDefinition } from "./definitions/newsletterSignup";
import { latestNewsDefinition } from "./definitions/latestNews";
import { impactStatsDefinition } from "./definitions/impactStats";
import { footerDefinition } from "./definitions/footer";

/**
 * Central section registry. Empty by default.
 *
 * To add a section, create:
 *   - components/sections/YourSection/index.tsx
 *   - lib/sections/definitions/yourSection.tsx (hydrate + render)
 * …then import and append the definition here.
 *
 * See `components/ARCHITECTURE.md` for the full walkthrough and the
 * switch-case mental model used inside variant routers.
 */
export const sectionRegistry: SectionDefinition[] = [
  navigationDefinition,
  heroSliderDefinition,
  missionStatementDefinition,
  countryCardsDefinition,
  exploreSliderDefinition,
  donationCtaDefinition,
  spendingAndVideoDefinition,
  newsletterSignupDefinition,
  latestNewsDefinition,
  impactStatsDefinition,
  footerDefinition,
];
