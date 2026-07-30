import Reveal from "./Reveal";

export default function SectionHead({
  index,
  label,
  className = "",
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <Reveal className={`flex items-center gap-4 ${className}`} y={16}>
      <span className="eyebrow text-brand">{index}</span>
      <span className="rule w-10 sm:w-16" />
      <span className="eyebrow">{label}</span>
    </Reveal>
  );
}
