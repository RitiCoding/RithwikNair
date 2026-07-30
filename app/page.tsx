import Hero from "@/components/Hero";
import Intro from "@/components/sections/Intro";
import Passions from "@/components/sections/Passions";
import Work from "@/components/sections/Work";
import Personal from "@/components/sections/Personal";
import Outro from "@/components/sections/Outro";

export default function Home() {
  return (
    <main>
      <Hero />
      <Intro />
      <Passions />
      <Work />
      <Personal />
      <Outro />
    </main>
  );
}
