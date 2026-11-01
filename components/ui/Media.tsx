"use client";

import Image from "next/image";
import { useRef } from "react";
import { useInView, useMediaMotion } from "@/lib/hooks";

/**
 * An image in a fixed-ratio frame. It enters behind a hard wipe up from the
 * bottom edge, settles from a slight zoom, then drifts inside the frame as the
 * page scrolls. The frame is observed rather than the clipped layer, because a
 * clip-path would stop the frame from ever registering as in view.
 */
export default function Media({
  src,
  alt,
  ratio,
  focus,
  sizes,
  className = "",
  style,
  distance = 56,
  zoom = 0.08,
  delay = 0,
}: {
  src: string;
  alt: string;
  /** width / height; omit when the frame's size comes from its parent */
  ratio?: number;
  focus?: string;
  sizes: string;
  className?: string;
  style?: React.CSSProperties;
  distance?: number;
  zoom?: number;
  delay?: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useInView(frameRef, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  useMediaMotion(imgRef, frameRef, { distance, zoom });

  return (
    <div
      ref={frameRef}
      className={`media ${className}`}
      style={{ aspectRatio: ratio, "--rd": `${delay}ms`, ...style } as React.CSSProperties}
    >
      <div className="media-wipe">
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={focus ? { objectPosition: focus } : undefined}
        />
      </div>
    </div>
  );
}
