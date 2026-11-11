import Link from "next/link";

/** The Blocksy brick mark: three interlocked bricks, readable at 16px. */
export function BrickMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {/* bottom coral 2x4 */}
      <rect x="2.5" y="17" width="27" height="12" rx="3.4" fill="#FF777B" />
      <rect x="2.5" y="25.5" width="27" height="3.5" rx="1.75" fill="#E55E63" opacity=".55" />
      {/* top-left blue */}
      <rect x="6" y="6.6" width="3.8" height="3" rx="1.3" fill="#69B9FF" />
      <rect x="11.6" y="6.6" width="3.8" height="3" rx="1.3" fill="#69B9FF" />
      <rect x="2.5" y="8.4" width="16" height="10.6" rx="3.2" fill="#69B9FF" />
      <rect x="2.5" y="15.6" width="16" height="3.4" rx="1.7" fill="#4C9BE2" opacity=".55" />
      {/* top-right yellow */}
      <rect x="22.6" y="6.6" width="3.8" height="3" rx="1.3" fill="#FFD45C" />
      <rect x="20" y="8.4" width="9.5" height="10.6" rx="3.2" fill="#FFD45C" />
      <rect x="20" y="15.6" width="9.5" height="3.4" rx="1.7" fill="#E9B835" opacity=".55" />
      {/* gloss */}
      <rect x="4.4" y="10" width="7" height="1.6" rx=".8" fill="#fff" opacity=".55" />
      <rect x="21.8" y="10" width="3.4" height="1.6" rx=".8" fill="#fff" opacity=".6" />
      <rect x="4.4" y="19" width="9" height="1.6" rx=".8" fill="#fff" opacity=".45" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-[-0.02em] text-ink ${className}`}>
      blocksy<span className="text-coral">.</span>
    </span>
  );
}

export function Logo({
  href = "/",
  size = "md",
  className = "",
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const s = {
    sm: { mark: "h-6 w-6", text: "text-xl" },
    md: { mark: "h-8 w-8", text: "text-[1.65rem]" },
    lg: { mark: "h-11 w-11", text: "text-4xl" },
  }[size];
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-xl ${className}`}
      aria-label="blocksy. home"
    >
      <BrickMark className={`${s.mark} transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105`} />
      <Wordmark className={`${s.text} leading-none`} />
    </Link>
  );
}
