"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/**
 * DJI 4-Directional Triangle Assembly Animation
 * 
 * Automatically triggers when scrolling into view:
 * 1. 4 geometric triangle pieces fly in cleanly from 4 directions (Top, Right, Down, Left).
 * 2. The pieces converge and lock into their exact positions in the center.
 * 3. The white "dj" lettermark locks on top.
 * 4. The whole logo transitions seamlessly into the crisp, complete brand logo.
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

  // Container reveal without 3D tilt distortion
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease,
      },
    },
  };

  // 1. Top / Upper-side Facet (flies down into place)
  const triangleTop = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : -180,
      x: 0,
      scale: reduceMotion ? 1 : 0.85,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 1.3, delay: 0.1, ease },
    },
  };

  // 2. Right Facet (flies in from right)
  const triangleRight = {
    hidden: {
      opacity: 0,
      x: reduceMotion ? 0 : 180,
      y: 0,
      scale: reduceMotion ? 1 : 0.85,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 1.3, delay: 0.25, ease },
    },
  };

  // 3. Down / Bottom Facet (flies up into place)
  const triangleBottom = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 180,
      x: 0,
      scale: reduceMotion ? 1 : 0.85,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 1.3, delay: 0.4, ease },
    },
  };

  // 4. Left Facet (flies in from left)
  const triangleLeft = {
    hidden: {
      opacity: 0,
      x: reduceMotion ? 0 : -180,
      y: 0,
      scale: reduceMotion ? 1 : 0.85,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 1.3, delay: 0.55, ease },
    },
  };

  // 5. "dj" Lettermark: settles on top after facets converge
  const lettermarkAnim = {
    hidden: {
      opacity: 0,
      scale: reduceMotion ? 1 : 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.9, delay: 1.1, ease },
    },
  };

  // 6. Final exact logo full-clarity lock-in
  const fullLogoLockIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, delay: 1.7, ease },
    },
  };

  return (
    <div className="inline-flex items-center justify-center">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        style={{ width: size, height: size }}
        className={`relative select-none ${className}`.trim()}
      >
        {/* 1. Left Facet (flies in from Left) */}
        <motion.div
          variants={triangleLeft}
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

        {/* 2. Top / Upper Facet (flies in from Top) */}
        <motion.div
          variants={triangleTop}
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

        {/* 3. Bottom / Down Facet (flies in from Down) */}
        <motion.div
          variants={triangleBottom}
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

        {/* 4. Right Facet (flies in from Right) */}
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
