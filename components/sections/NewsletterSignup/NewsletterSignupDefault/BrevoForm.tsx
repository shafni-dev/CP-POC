"use client";

import type { ReactNode } from "react";
import Script from "next/script";

type BrevoFormProps = {
  heading: string;
  modalBody: ReactNode;
  formAction: string | null;
  recaptchaSiteKey: string | null;
};

/**
 * Brevo (Sendinblue) embedded signup form: first name + email + opt-in
 * checkbox + reCAPTCHA + submit. Reproduces the third-party embed markup from
 * homepage.html (sib-* classes) and loads Brevo's native stylesheet + scripts,
 * so the form is styled and functional exactly as the source. The form POST
 * action and reCAPTCHA site key are CMS-driven.
 */
export function BrevoForm({
  heading,
  modalBody,
  formAction,
  recaptchaSiteKey,
}: BrevoFormProps) {
  return (
    <div className="sib-form" id="sib-container">
      {/* Brevo native form styles */}
      <link
        rel="stylesheet"
        href="https://sibforms.com/forms/end-form/build/sib-styles.css"
      />

      <div className="sib-form-container">
        <div className="sib-form-block">
          <h3 className="text-[28px] font-bold leading-[1.2] text-[var(--brand-primary)] font-[family-name:var(--font-poppins)]">
            {heading}
          </h3>
        </div>

        <div className="mt-3 text-left font-[family-name:var(--font-poppins)]">
          {modalBody}
        </div>

        <form
          id="sib-form"
          method="POST"
          action={formAction ?? "#"}
          data-type="subscription"
          className="mt-4"
        >
          {/* First name */}
          <div className="mb-4 text-left">
            <label
              htmlFor="FIRSTNAME"
              className="mb-1 block text-[16px] font-bold text-[#3c4858]"
              data-required="*"
            >
              Enter your FIRSTNAME
            </label>
            <input
              className="input w-full rounded-[3px] border border-[#c0ccd9] px-3 py-2 text-[16px]"
              maxLength={200}
              type="text"
              id="FIRSTNAME"
              name="FIRSTNAME"
              autoComplete="off"
              placeholder="FIRSTNAME"
              data-required="true"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4 text-left">
            <label
              htmlFor="EMAIL"
              className="mb-1 block text-[16px] font-bold text-[#3c4858]"
              data-required="*"
            >
              Enter your email address to subscribe
            </label>
            <input
              className="input w-full rounded-[3px] border border-[#c0ccd9] px-3 py-2 text-[16px]"
              type="email"
              id="EMAIL"
              name="EMAIL"
              autoComplete="off"
              placeholder="EMAIL"
              data-required="true"
              required
            />
            <p className="mt-1 text-[12px] text-[#8390a4]">
              Provide your email address to subscribe. For e.g abc@xyz.com
            </p>
          </div>

          {/* Opt-in */}
          <div className="mb-4 text-left">
            <label className="flex items-start gap-2 text-[14px] text-[#3c4858]">
              <input
                type="checkbox"
                value="1"
                id="OPT_IN"
                name="OPT_IN"
                required
                className="mt-1"
              />
              <span>
                I agree to receive your newsletters and accept the data privacy
                statement.
              </span>
            </label>
            <p className="mt-1 text-[12px] text-[#8390a4]">
              You may unsubscribe at any time using the link in our newsletter.
            </p>
          </div>

          {/* Brevo declaration */}
          <p className="mb-4 text-left text-[14px] text-[#687484]">
            We use Brevo as our marketing platform. By clicking below to submit
            this form, you acknowledge that the information you provided will be
            transferred to Brevo for processing in accordance with their{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              href="https://www.brevo.com/legal/termsofuse/"
            >
              terms of use
            </a>
            .
          </p>

          {/* reCAPTCHA */}
          <div className="mb-4 text-left">
            <div
              className="g-recaptcha"
              id="sib-captcha"
              data-sitekey={recaptchaSiteKey ?? undefined}
            />
            <p className="mt-1 text-[12px] text-[#8390a4]">
              Form secured by reCAPTCHA
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            form="sib-form"
            className="inline-flex h-11 items-center justify-center rounded-full border-2 border-transparent bg-[var(--brand-primary)] px-[30px] font-bold uppercase tracking-[1.5px] text-white transition-colors hover:bg-[var(--brand-primary-hover)] font-[family-name:var(--font-poppins)]"
          >
            Subscribe
          </button>

          <input
            type="text"
            name="email_address_check"
            defaultValue=""
            className="hidden"
          />
          <input type="hidden" name="locale" defaultValue="en" />
        </form>
      </div>

      {/* Brevo + reCAPTCHA scripts */}
      <Script
        src="https://sibforms.com/forms/end-form/build/main.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://www.google.com/recaptcha/api.js?hl=en"
        strategy="lazyOnload"
      />
    </div>
  );
}
