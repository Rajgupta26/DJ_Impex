"use client";

import { Award, Handshake, TrendingUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";

const valueIcons = [Handshake, Award, TrendingUp];

export function NabeenIntro({
  paragraphs,
  coreLine,
  values,
}: {
  paragraphs: string[];
  coreLine: string;
  values: string[];
}) {
  const reduceMotion = useReducedMotion();
  const rise = (delay = 0) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 46 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: reduceMotion ? 0.01 : 1.1, delay, ease: [0.22, 0.61, 0.36, 1] as const },
  });

  return (
    <section className="bg-white py-14 sm:py-18 md:py-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1.3fr_0.9fr] lg:gap-20 xl:gap-28">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-slate uppercase">About Nabeen</p>
            <span aria-hidden="true" className="mt-5 block h-px w-12 bg-accent" />
            <motion.h2
              className="mt-8 max-w-none font-sans text-[clamp(2.6rem,3.3vw,4.35rem)] leading-[0.98] tracking-[-0.035em] text-navy"
              {...rise()}
            >
              <span className="block md:whitespace-nowrap">A Global Fabric Brand</span>
              <span className="block md:whitespace-nowrap">with a Deeper Purpose</span>
            </motion.h2>
            <div className="mt-10 grid max-w-2xl gap-7 text-[clamp(1.05rem,0.98rem+0.3vw,1.22rem)] leading-relaxed text-slate">
              {paragraphs.map((paragraph, index) => (
                <motion.p key={paragraph} {...rise(0.14 + index * 0.14)}>
                  {withReg(paragraph)}
                </motion.p>
              ))}
            </div>
          </div>

          <div className="border-l border-line pl-7 sm:pl-10 lg:pl-14">
            <p className="text-xs font-semibold tracking-[0.22em] text-slate uppercase">Our Values</p>
            <span aria-hidden="true" className="mt-5 block h-px w-12 bg-accent" />
            <p className="mt-8 max-w-md text-[clamp(1rem,0.94rem+0.25vw,1.15rem)] leading-relaxed text-slate">
              {withReg(`Nabeen${"\u00AE"} is built on ${coreLine} It stands for:`)}
            </p>
            <ul className="mt-10 grid gap-8 sm:gap-9">
              {values.map((value, index) => {
                const Icon = valueIcons[index] ?? Award;
                return (
                  <motion.li
                    key={value}
                    className="flex items-center gap-5 sm:gap-6"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 52 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{
                      duration: reduceMotion ? 0.01 : 1.1,
                      delay: index * 0.16,
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                  >
                    <span className="flex size-[4.6rem] shrink-0 items-center justify-center rounded-full bg-mist text-navy sm:size-[5.25rem]">
                      <Icon aria-hidden="true" size={35} strokeWidth={1.4} />
                    </span>
                    <span>
                      <span className="block font-sans text-[clamp(2.15rem,2.3vw,3.35rem)] leading-none tracking-[-0.035em] text-navy">
                        {value}
                      </span>
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
