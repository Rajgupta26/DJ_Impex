"use client";

import { motion, useReducedMotion } from "motion/react";
import { PostCard } from "@/components/journal/PostCard";
import type { Post } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

export function JournalAnimated({
  lead,
  rest,
}: {
  lead: Post;
  rest: Post[];
}) {
  const reduceMotion = useReducedMotion();

  const leftVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 1.35,
        ease: EASE,
      },
    },
  };

  const rightCardVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : -50 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 1.25,
        delay: reduceMotion ? 0 : 0.35 + index * 0.45,
        ease: EASE,
      },
    }),
  };

  return (
    <motion.div
      className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-[7fr_5fr] lg:gap-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25, margin: "-60px 0px" }}
    >
      <motion.div variants={leftVariants}>
        <PostCard post={lead} size="large" />
      </motion.div>

      <div className="grid content-start gap-12">
        {rest.map((post, index) => (
          <motion.div key={post.slug} variants={rightCardVariants} custom={index}>
            <PostCard post={post} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
