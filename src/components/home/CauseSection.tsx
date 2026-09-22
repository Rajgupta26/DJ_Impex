import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { TextLink } from "@/components/ui/TextLink";
import { getSite } from "@/lib/content";

/**
 * Wear2Care, told plainly: photograph left, words right, on navy.
 *
 * The photograph is the client's own, from the donation itself. It is set at its
 * native 4:3 rather than stretched to fill a tall column, because cropping a room
 * of people to a portrait frame cuts half of them out of their own story.
 */
export function CauseSection() {
  const site = getSite();
  const { socialCause, wear2care } = site;
  const photo = wear2care.photos[0];

  return (
    <section className="on-dark bg-navy text-white">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <figure className="relative aspect-[4/3] w-full self-center overflow-hidden">
            <Image
              src={`/images/wear2care/${photo.file}`}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </figure>

          <div className="flex flex-col justify-center py-[clamp(2rem,1.5rem+3vw,4rem)]">
            <p className="t-small font-semibold text-zari">{socialCause.campaign}</p>
            <h2 className="t-h2 mt-4 max-w-[16ch]">{withReg(socialCause.headline)}</h2>
            <p className="measure mt-6 text-white/75">{withReg(socialCause.body)}</p>
            <p className="mt-9">
              <TextLink href="/nabeen-x-ali-nuhu" onDark>
                About Wear2Care
              </TextLink>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
