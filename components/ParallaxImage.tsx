"use client";

import Image from "next/image";
import { useRef } from "react";
import { useInView, useParallax } from "@/lib/hooks";

type ParallaxImageProps = {
  src: string;
  alt: string;
  /** CSS aspect-ratio for the frame, e.g. "3/4" */
  ratio?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** parallax travel in px */
  distance?: number;
  /** ms before the entry wipe starts */
  delay?: number;
};

/**
 * Image in a fixed-ratio frame. It enters behind a hard clip wipe while the
 * picture itself settles up into place, then drifts inside the frame as the
 * page scrolls. The picture is oversized so the crop never runs out of image.
 */
export default function ParallaxImage({
  src,
  alt,
  ratio = "3/4",
  className = "",
  sizes = "(max-width: 768px) 100vw, 45vw",
  priority = false,
  distance = 70,
  delay = 0,
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useInView(frameRef, { threshold: 0.12 });
  useParallax(imgRef, { distance, baseScale: 1.14, zoom: 0.03 });

  return (
    <div
      ref={frameRef}
      className={`frame ${className}`}
      style={{ aspectRatio: ratio, "--rd": `${delay}ms` } as React.CSSProperties}
    >
      <div className="wipe">
        <div className="wipe-inner">
          <Image
            ref={imgRef}
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
