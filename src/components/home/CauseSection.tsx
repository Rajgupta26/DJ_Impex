import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { withReg } from "@/components/ui/Reg";
import { TextLink } from "@/components/ui/TextLink";
import { getSite } from "@/lib/content";

/**
 * Wear2Care, told plainly: image left, words right, on navy.
 *
 * No stock photography of children, ever. Until the client sends real campaign
 * photographs the panel carries drawn cloth instead, which is honest.
 */
export function CauseSection() {
  const { socialCause } = getSite();

  return (
    <section className="on-dark bg-navy text-white">
      <Container>
        <div className="grid items-stretch gap-0 md:grid-cols-2">
          <div className="relative min-h-[18rem] md:min-h-[32rem]">
            <ImagePlaceholder
              pending="Wear2Care campaign photograph (real, never stock)"
              pattern="lace"
              scale={1.2}
            />
          </div>

          <div className="flex flex-col justify-center py-[clamp(3rem,2rem+5vw,6rem)] md:pl-[clamp(2rem,4vw,5rem)]">
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
