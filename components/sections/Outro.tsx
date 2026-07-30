import Icon from "../Icon";
import Reveal from "../Reveal";
import SectionHead from "../SectionHead";
import SplitText from "../SplitText";
import { outro, site } from "@/lib/content";

export default function Outro() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] pt-24 pb-10 sm:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60vh]"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 100%, rgba(255,33,24,0.2), rgba(255,33,24,0.03) 46%, transparent 74%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead index={outro.index} label={outro.label} />

        <SplitText
          text={outro.headline}
          as="h2"
          drift={54}
          className="display mt-10 max-w-[16ch] text-[clamp(2.2rem,7vw,6rem)] text-paper sm:mt-14"
        />

        <Reveal delay={200} className="mt-12 sm:mt-16">
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex items-center gap-4 text-[clamp(1.1rem,3vw,2rem)] font-medium tracking-tight text-paper"
          >
            <span className="relative">
              {site.email}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brand transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
            </span>
            <span className="text-brand transition-transform duration-500 group-hover:translate-x-1.5">
              →
            </span>
          </a>
        </Reveal>

        <Reveal
          delay={280}
          className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 sm:mt-24"
        >
          {site.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer noopener" : undefined}
              className="eyebrow flex items-center gap-2.5 transition-colors duration-300 hover:text-brand"
            >
              <Icon name={link.icon} className="h-4 w-4" />
              {link.label}
            </a>
          ))}
        </Reveal>

        <div className="mt-20 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-faint sm:mt-28 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
