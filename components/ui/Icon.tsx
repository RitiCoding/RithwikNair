export type IconName = "mail" | "linkedin" | "arrow" | "up";

const PATHS: Record<IconName, React.ReactNode> = {
  mail: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3 7l8.15 5.6a1.5 1.5 0 0 0 1.7 0L21 7" />
    </>
  ),
  linkedin: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="2.5" />
      <path d="M7 10.5V17" />
      <path d="M7 7.2v.01" />
      <path d="M11 17v-3.6a2.4 2.4 0 0 1 4.8 0V17" />
      <path d="M11 10.5V17" />
    </>
  ),
  // a diagonal arrow, up and to the right
  arrow: (
    <>
      <path d="M6 18L18 6" />
      <path d="M8 6h10v10" />
    </>
  ),
  up: (
    <>
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </>
  ),
};

export default function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      aria-hidden
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
