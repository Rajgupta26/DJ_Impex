"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/**
 * DJI 3D Scattered Triangle Assembly & Zoom Animation
 * 
 * Automatically triggers when scrolling into view:
 * 1. Logo starts in 3D perspective, zoomed out with the geometric triangle pieces
 *    scattered and rotated in space ("messy").
 * 2. The triangles smoothly rotate, converge, and lock into their exact original positions.
 * 3. The white "dj" lettermark drops down smoothly and settles right on top.
 * 4. The whole logo smoothly zooms and lands into its fixed, crisp resting place.
 */
export function DJIAnimatedLogo({
  size = 150,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  // 3D Perspective container zoom & straighten animation
  const container3D = {
    hidden: {
      opacity: 0,
      scale: reduceMotion ? 1 : 0.76,
      rotateX: reduceMotion ? 0 : 20,
      rotateY: reduceMotion ? 0 : -18,
      z: reduceMotion ? 0 : -80,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      z: 0,
      transition: {
        duration: 2.2,
        ease,
      },
    },
  };

  // Triangle 1: Teal Facet (scattered top-left with rotation)
  const triangleLeft = {
    hidden: {
      opacity: 0,
      x: reduceMotion ? 0 : -85,
      y: reduceMotion ? 0 : -70,
      rotate: reduceMotion ? 0 : -28,
      scale: reduceMotion ? 1 : 0.78,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 1.6, delay: 0.1, ease },
    },
  };

  // Triangle 2: Deep Navy Facet (scattered top-right with rotation)
  const triangleRight = {
    hidden: {
      opacity: 0,
      x: reduceMotion ? 0 : 95,
      y: reduceMotion ? 0 : -80,
      rotate: reduceMotion ? 0 : 32,
      scale: reduceMotion ? 1 : 0.78,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 1.6, delay: 0.35, ease },
    },
  };

  // Triangle 3: Translucent Slate Facet (scattered bottom-left with rotation)
  const triangleBottomLeft = {
    hidden: {
      opacity: 0,
      x: reduceMotion ? 0 : -75,
      y: reduceMotion ? 0 : 85,
      rotate: reduceMotion ? 0 : -22,
      scale: reduceMotion ? 1 : 0.78,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 1.6, delay: 0.6, ease },
    },
  };

  // Triangle 4: Dark Charcoal Facet (scattered bottom-right with rotation)
  const triangleBottomRight = {
    hidden: {
      opacity: 0,
      x: reduceMotion ? 0 : 80,
      y: reduceMotion ? 0 : 75,
      rotate: reduceMotion ? 0 : 24,
      scale: reduceMotion ? 1 : 0.78,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 1.6, delay: 0.85, ease },
    },
  };

  // "dj" Lettermark: descends and locks on top after triangles converge
  const lettermarkAnim = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : -100,
      scale: reduceMotion ? 1 : 0.85,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.4, delay: 1.75, ease },
    },
  };

  // Final exact logo full-clarity lock-in
  const fullLogoLockIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, delay: 2.7, ease },
    },
  };

  return (
    <div style={{ perspective: "1000px" }} className="inline-flex items-center justify-center">
      <motion.div
        variants={container3D}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        style={{ transformStyle: "preserve-3d", width: size, height: size }}
        className={`relative select-none ${className}`.trim()}
      >
        {/* 1. Translucent Grey-Slate Facet */}
        <motion.div
          variants={triangleBottomLeft}
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{ clipPath: "polygon(10% 10%, 29% 99.5%, 66% 65%)" }}
        >
          <Image
            src="/images/logos/dji-logo-transparent.png"
            alt=""
            width={736}
            height={735}
            priority
            className="h-full w-full object-contain"
          />
        </motion.div>

        {/* 2. Top-Left Main Teal Facet */}
        <motion.div
          variants={triangleLeft}
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{ clipPath: "polygon(29% 0.5%, 10% 89%, 99.5% 50%)" }}
        >
          <Image
            src="/images/logos/dji-logo-transparent.png"
            alt=""
            width={736}
            height={735}
            priority
            className="h-full w-full object-contain"
          />
        </motion.div>

        {/* 3. Bottom-Right Dark Charcoal Facet */}
        <motion.div
          variants={triangleBottomRight}
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{ clipPath: "polygon(28% 34%, 29% 99.5%, 99.5% 50%)" }}
        >
          <Image
            src="/images/logos/dji-logo-transparent.png"
            alt=""
            width={736}
            height={735}
            priority
            className="h-full w-full object-contain"
          />
        </motion.div>

        {/* 4. Top-Right Deep Navy Facet */}
        <motion.div
          variants={triangleRight}
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{ clipPath: "polygon(29% 0.5%, 99.5% 50%, 28.5% 99.5%)" }}
        >
          <Image
            src="/images/logos/dji-logo-transparent.png"
            alt=""
            width={736}
            height={735}
            priority
            className="h-full w-full object-contain"
          />
        </motion.div>

        {/* 5. The White "dj" Lettermark */}
        <motion.div
          variants={lettermarkAnim}
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{ clipPath: "polygon(20% 20%, 68% 20%, 68% 85%, 20% 85%)" }}
        >
          <Image
            src="/images/logos/dji-logo-transparent.png"
            alt=""
            width={736}
            height={735}
            priority
            className="h-full w-full object-contain"
          />
        </motion.div>

        {/* 6. Complete Original Logo (Seamless 100% crisp final layer) */}
        <motion.div
          variants={fullLogoLockIn}
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src="/images/logos/dji-logo-transparent.png"
            alt="D J Impex & Co. (DJI)"
            width={736}
            height={735}
            priority
            className="h-full w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
