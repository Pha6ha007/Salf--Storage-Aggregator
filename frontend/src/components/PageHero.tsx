import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  /** Optional right-side slot */
  cta?: {
    label: string;
    href: string;
    variant?: "primary" | "accent";
  };
}

export function PageHero({ title, subtitle, breadcrumbs, cta }: PageHeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #060E1E 0%, #0f2a5c 100%)" }}
    >
      {/* Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-10 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-5 text-xs" style={{ color: "rgba(147,197,253,0.6)" }}>
            <Link href="/" className="hover:text-blue-200 transition-colors">Home</Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {b.href ? (
                  <Link href={b.href} className="hover:text-blue-200 transition-colors">{b.label}</Link>
                ) : (
                  <span style={{ color: "rgba(147,197,253,0.9)" }}>{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex items-end justify-between gap-6">
          <div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-3"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-base sm:text-lg max-w-2xl leading-relaxed" style={{ color: "rgba(147,197,253,0.75)" }}>
                {subtitle}
              </p>
            )}
          </div>
          {cta && (
            <Link
              href={cta.href}
              className="shrink-0 hidden sm:inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
              style={
                cta.variant === "accent"
                  ? { background: "linear-gradient(145deg,#fbbf24,#f59e0b)", color: "#060E1E", boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }
                  : { background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }
              }
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>

      {/* Bottom blend */}
      <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: "linear-gradient(to top, white, transparent)" }} />
    </section>
  );
}
