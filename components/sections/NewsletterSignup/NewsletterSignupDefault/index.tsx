"use client";

import { useCallback, useEffect, useState } from "react";
import type { NewsletterSignupSection } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";
import { RichText } from "@/components/common/RichText";
import { BrevoForm } from "./BrevoForm";

type NewsletterSignupDefaultProps = { section: NewsletterSignupSection };

/**
 * Newsletter Signup — primary (purple) `uk-section-small` band, large
 * container. Heading + intro copy + a ghost "Subscribe" CTA (shared Cta) that
 * opens a modal holding the Brevo embedded form. Replaces the source's UIKit
 * `uk-toggle` / `uk-modal` with a React modal (state + Escape/backdrop close).
 * Mirrors homepage.html's #commit-to-carers footer section.
 */
export function NewsletterSignupDefault({
  section,
}: NewsletterSignupDefaultProps) {
  const {
    sectionId,
    heading,
    body,
    modalBody,
    brevoFormAction,
    brevoRecaptchaSiteKey,
    cta,
  } = section;

  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <section
      id={sectionId ?? undefined}
      className="bg-[var(--brand-primary)] py-[40px] text-white"
    >
      <div className="mx-auto w-full max-w-[1480px] px-[40px]">
        <h3 className="text-[34px] font-bold leading-[1.2] text-white font-[family-name:var(--font-poppins)]">
          {heading}
        </h3>

        <RichText
          content={body}
          className="mt-4 text-[16.5px] leading-[1.6] [&_p]:mb-0 font-[family-name:var(--font-poppins)]"
        />

        <div className="mt-6">
          <Cta cta={cta} onClick={() => setOpen(true)} />
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[1010] flex items-start justify-center overflow-y-auto bg-black/60 p-4 py-[50px]"
          role="dialog"
          aria-modal="true"
          aria-label={heading}
          onClick={close}
        >
          <div
            className="relative my-auto w-full max-w-[600px] rounded-[3px] bg-white p-[30px] text-[var(--text-default)] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-[15px] top-[15px] flex h-8 w-8 items-center justify-center text-[24px] leading-none text-[#666] hover:text-[var(--brand-primary)]"
            >
              &times;
            </button>

            <BrevoForm
              heading={heading}
              modalBody={
                <RichText
                  content={modalBody}
                  className="text-[16px] leading-[1.6] [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                />
              }
              formAction={brevoFormAction}
              recaptchaSiteKey={brevoRecaptchaSiteKey}
            />
          </div>
        </div>
      )}
    </section>
  );
}
