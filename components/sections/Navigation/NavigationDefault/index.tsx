"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationSection, NavLink, CtaEntry } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";
import { SocialLinks } from "@/components/common/SocialLinks";

function Caret({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function isActive(pathname: string, href: string | null): boolean {
  if (!href) return false;
  const norm = (s: string) => (s !== "/" && s.endsWith("/") ? s.slice(0, -1) : s);
  return norm(pathname) === norm(href);
}

export function NavigationDefault({ section }: { section: NavigationSection }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const {
    logo,
    logoWidth,
    logoHeight,
    donateLabel,
    donateHref,
    items,
    socialLinks,
  } = section;

  const donateCta: CtaEntry = {
    id: "nav-donate",
    label: donateLabel ?? "Donate",
    href: donateHref ?? "#",
    variant: "donate",
    ariaLabel: null,
    target: "_self",
  };
  const donate = <Cta cta={donateCta} />;

  return (
    <header className="w-full bg-white font-[family-name:var(--font-poppins)]">
      <div className="site-container flex items-center justify-between gap-6 py-4 lg:items-stretch lg:py-5">
        {/* Logo */}
        <Link href="/" className="block shrink-0">
          {logo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.url}
              alt={logo.title ?? "Carers Worldwide"}
              width={logoWidth ?? 260}
              height={logoHeight ?? 122}
              style={{ width: `${logoWidth ?? 260}px`, height: "auto" }}
              className="h-auto"
            />
          ) : null}
        </Link>

        {/* Desktop: donate pinned top, nav pinned bottom (bottom aligns with logo) */}
        <div className="hidden flex-col items-end justify-between lg:flex">
          <div>{donate}</div>
          <nav aria-label="Primary">
            <ul className="flex items-center gap-10">
              {items.map((item, i) => (
                <DesktopItem
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  alignRight={i >= items.length - 2}
                />
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded text-[var(--brand-primary)] lg:hidden"
        >
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile off-canvas */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[300px] max-w-[85%] flex-col overflow-y-auto bg-white shadow-xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            {donate}
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center text-[var(--nav-link)]"
            >
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>
          <ul className="flex flex-col px-2 py-2">
            {items.map((item) => (
              <MobileItem
                key={item.id}
                item={item}
                pathname={pathname}
                expanded={expanded === item.id}
                onToggle={() =>
                  setExpanded((cur) => (cur === item.id ? null : item.id))
                }
                onNavigate={() => setOpen(false)}
              />
            ))}
          </ul>
          {socialLinks.length > 0 && (
            <div className="mt-auto border-t border-black/10 px-5 py-5">
              <SocialLinks links={socialLinks} size={22} />
            </div>
          )}
        </aside>
      </div>
    </header>
  );
}

function DesktopItem({
  item,
  pathname,
  alignRight,
}: {
  item: NavLink;
  pathname: string;
  alignRight: boolean;
}) {
  const hasChildren = item.children.length > 0;
  const active = isActive(pathname, item.href);
  // Small menus (≤3 links) render as a single column, larger ones as two —
  // matching the source site.
  const columns = item.children.length > 3 ? 2 : 1;
  const rows = Math.ceil(item.children.length / columns);

  return (
    <li className="group relative">
      <a
        href={item.href ?? "#"}
        className={`block whitespace-nowrap text-[15.5px] font-semibold uppercase tracking-[1px] transition-colors group-hover:text-[var(--brand-accent)] ${
          active ? "text-[var(--brand-primary)]" : "text-[var(--nav-link)]"
        }`}
      >
        {item.label}
      </a>

      {hasChildren && (
        <div
          className={`invisible absolute top-full z-40 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          <div
            className={`rounded-b border-t-[3px] border-[var(--brand-accent)] bg-white p-6 shadow-[0_5px_25px_rgba(0,0,0,0.12)] ${
              columns === 2 ? "w-[480px]" : "min-w-[220px]"
            }`}
          >
            <ul
              className="grid grid-flow-col gap-x-8 gap-y-0.5"
              style={{ gridTemplateRows: `repeat(${rows}, auto)`, gridAutoColumns: "1fr" }}
            >
              {item.children.map((child) => (
                <li key={child.id}>
                  <a
                    href={child.href ?? "#"}
                    className="block whitespace-nowrap py-[7px] text-[16px] font-normal normal-case leading-tight tracking-normal text-[var(--nav-link-muted)] transition-colors hover:text-[var(--brand-accent)]"
                  >
                    {child.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

function MobileItem({
  item,
  pathname,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: NavLink;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const hasChildren = item.children.length > 0;
  const active = isActive(pathname, item.href);

  return (
    <li className="border-b border-black/5">
      <div className="flex items-center justify-between">
        <a
          href={item.href ?? "#"}
          onClick={onNavigate}
          className={`block flex-1 py-3 pl-3 text-[15px] font-semibold uppercase tracking-[1px] ${
            active ? "text-[var(--brand-primary)]" : "text-[var(--nav-link)]"
          }`}
        >
          {item.label}
        </a>
        {hasChildren && (
          <button
            type="button"
            aria-label={expanded ? "Collapse" : "Expand"}
            aria-expanded={expanded}
            onClick={onToggle}
            className="flex h-11 w-11 items-center justify-center text-[var(--nav-link)]"
          >
            <Caret className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
      {hasChildren && expanded && (
        <ul className="pb-2">
          {item.children.map((child) => (
            <li key={child.id}>
              <a
                href={child.href ?? "#"}
                onClick={onNavigate}
                className="block py-2 pl-6 text-[14px] text-[var(--nav-link-muted)] hover:text-[var(--brand-accent)]"
              >
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
