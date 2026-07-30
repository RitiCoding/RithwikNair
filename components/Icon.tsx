export type IconName = "mail" | "linkedin";

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
};

export default function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
