import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Interests from "@/components/sections/Interests";
import Personal from "@/components/sections/Personal";
import Work from "@/components/sections/Work";
import { contact } from "@/lib/content";

export default function Home() {
  return (
    <>
      <main className="page">
        {/* the hero stays pinned only while About slides up over it */}
        <div className="relative">
          <Hero />
          <About />
        </div>
        <Interests />
        <Work />
        <Personal />
        {/* marks where the page lifts off the footer, for the header's chapter label */}
        <div data-chapter-end data-chapter={contact.label} data-chapter-index={contact.index} aria-hidden />
      </main>
      <Contact year={new Date().getFullYear()} />
    </>
  );
}
