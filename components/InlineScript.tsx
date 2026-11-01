/**
 * A script that runs while the HTML is still parsing, before first paint.
 * On the client it renders as inert text/plain, so React doesn't warn about
 * rendering a script and doesn't run it a second time.
 */
export default function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
