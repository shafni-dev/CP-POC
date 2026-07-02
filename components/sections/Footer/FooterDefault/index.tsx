/* eslint-disable jsx-a11y/alt-text -- <Image> is our own component; it always renders an alt from the CMS entry */
import type { FooterSection } from "@/lib/sections/types";
import { Image } from "@/components/common/Image";
import { RichText } from "@/components/common/RichText";
import { SocialLinks } from "@/components/common/SocialLinks";

type FooterDefaultProps = { section: FooterSection };

/** Small feather-style contact icons (phone / email / map-pin), 20×20. */
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/**
 * Footer — white `uk-section-default` band, `uk-container-xlarge`. Mirrors
 * homepage.html's `<footer>` bottom section:
 *  - top row (3 cols): logo + social icon row · contact list · charity numbers
 *  - bottom row (2 cols): legal links + copyright + credit · partner logos + badge
 * Reuses the shared Image, SocialLinks and RichText components and the shared
 * `image` / `socialLinks` / `stat` / `navigationItem` / `card` entry types.
 */
export function FooterDefault({ section }: FooterDefaultProps) {
  const {
    logo,
    socialLinks,
    phone,
    phoneHref,
    email,
    emailHref,
    address,
    charityInfo,
    legalLinks,
    copyright,
    credit,
    partnerLogos,
    badge,
  } = section;

  return (
    <footer className="bg-white py-[50px] text-[var(--text-default)] font-[family-name:var(--font-poppins)]">
      <div className="mx-auto w-full max-w-[1680px] px-[15px]">
        {/* Top row */}
        <div className="grid grid-cols-1 gap-x-[30px] gap-y-[40px] sm:grid-cols-2 md:grid-cols-3">
          {/* Col 1 — logo + socials */}
          <div>
            {logo && (
              <Image
                image={logo}
                className="h-auto w-[270px] max-w-full"
                sizes="270px"
              />
            )}
            <SocialLinks
              links={socialLinks}
              size={30}
              gap={20}
              className="mt-[35px]"
              linkClassName="text-[var(--brand-primary)] hover:text-[var(--brand-accent)]"
            />
          </div>

          {/* Col 2 — contact list */}
          <ul className="flex flex-col gap-[25px] text-[17px] leading-[1.6]">
            <li className="flex items-start gap-[12px]">
              <span className="mt-[3px] shrink-0 text-[var(--text-default)]">
                <PhoneIcon />
              </span>
              <span>
                {phoneHref ? (
                  <a href={phoneHref} className="hover:text-[var(--brand-primary)]">
                    {phone}
                  </a>
                ) : (
                  phone
                )}
              </span>
            </li>
            <li className="flex items-start gap-[12px]">
              <span className="mt-[3px] shrink-0 text-[var(--text-default)]">
                <MailIcon />
              </span>
              <span>
                {emailHref ? (
                  <a href={emailHref} className="hover:text-[var(--brand-primary)]">
                    {email}
                  </a>
                ) : (
                  email
                )}
              </span>
            </li>
            <li className="flex items-start gap-[12px]">
              <span className="mt-[3px] shrink-0 text-[var(--text-default)]">
                <PinIcon />
              </span>
              <RichText
                content={address}
                className="[&_p]:mb-0 [&_p]:leading-[1.6]"
              />
            </li>
          </ul>

          {/* Col 3 — charity numbers */}
          <div className="flex flex-col gap-[25px] text-[17px] leading-[1.6] text-center md:text-left">
            {charityInfo.map((item) => (
              <div key={item.id}>
                <p className="font-bold text-[var(--brand-primary)]">
                  {item.label}
                </p>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-[50px] grid grid-cols-1 gap-y-[40px] lg:grid-cols-3">
          {/* Left — legal links + copyright + credit */}
          <div className="text-center lg:text-left">
            <ul className="flex flex-wrap items-center justify-center gap-x-[16px] gap-y-[6px] text-[15px] lg:justify-start">
              {legalLinks.map((link, i) => (
                <li key={link.id} className="flex items-center gap-x-[16px]">
                  <a
                    href={link.href ?? "#"}
                    className="hover:text-[var(--brand-primary)]"
                  >
                    {link.label}
                  </a>
                  {i < legalLinks.length - 1 && (
                    <span className="text-[var(--brand-accent)]" aria-hidden="true">
                      |
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {copyright && (
              <p className="mt-[20px] text-[13px] text-[var(--text-meta)]">
                {copyright}
              </p>
            )}
            <RichText
              content={credit}
              className="mt-[20px] text-[13px] text-[var(--text-meta)] [&_p]:mb-0 [&_a]:underline [&_a:hover]:text-[var(--brand-primary)]"
            />
          </div>

          {/* Right — partner logos + badge */}
          <div className="grid grid-cols-1 items-center gap-[30px] sm:grid-cols-3 lg:col-span-2">
            <div className="grid grid-cols-2 items-center gap-[20px] sm:col-span-2">
              {partnerLogos.map((logoCard) =>
                logoCard.image ? (
                  <a
                    key={logoCard.id}
                    href={logoCard.titleHref ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-center"
                  >
                    <Image
                      image={logoCard.image}
                      className="h-auto w-[200px] max-w-full"
                      sizes="200px"
                    />
                  </a>
                ) : null
              )}
            </div>
            {badge?.image && (
              <a
                href={badge.titleHref ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="flex justify-center sm:justify-start"
              >
                <Image
                  image={badge.image}
                  className="h-[120px] w-auto max-w-full"
                  sizes="200px"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
