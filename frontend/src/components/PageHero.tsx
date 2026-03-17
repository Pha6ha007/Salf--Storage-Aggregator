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
  cta?: {
    label: string;
    href: string;
    variant?: "primary" | "accent";
  };
  /** Make hero taller with more visual presence */
  size?: "sm" | "md" | "lg";
}

export function PageHero({ title, subtitle, breadcrumbs, cta, size = "md" }: PageHeroProps) {
  const py = size === "lg" ? "py-24 md:py-32" : size === "sm" ? "py-10 md:py-12" : "py-16 md:py-20";

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #060E1E 0%, #0f2a5c 100%)" }}
    >
      {/* Mesh glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)" }} />
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.10), transparent 70%)" }} />
        {/* Subtle grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "56px 56px"
        }} />
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${py}`}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-6 text-xs" style={{ color: "rgba(147,197,253,0.5)" }}>
            <Link href="/" className="hover:text-blue-200 transition-colors">Home</Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {b.href
                  ? <Link href={b.href} className="hover:text-blue-200 transition-colors">{b.label}</Link>
                  : <span style={{ color: "rgba(147,197,253,0.85)" }}>{b.label}</span>
                }
              </span>
            ))}
          </nav>
        )}

        <div className="flex items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl text-white font-bold mb-4"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.025em", lineHeight: 1.08 }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: "rgba(147,197,253,0.7)" }}>
                {subtitle}
              </p>
            )}
          </div>
          {cta && (
            <Link
              href={cta.href}
              className="shrink-0 hidden sm:inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
              style={
                cta.variant === "accent"
                  ? { background: "linear-gradient(145deg,#fbbf24,#f59e0b)", color: "#060E1E", boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }
                  : { background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }
              }
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>

      {/* Bottom blend — no gap */}
      <div className="absolute bottom-0 left-0 right-0 h-12"
        style={{ background: "linear-gradient(to top, white, transparent)" }} />
    </section>
  );
}
