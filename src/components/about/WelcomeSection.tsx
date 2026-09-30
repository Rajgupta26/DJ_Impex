import { Container } from "@/components/ui/Container";
import { WeaveArt } from "@/components/ui/WeaveArt";
import { getPage } from "@/lib/content";
import { field, section } from "@/lib/markdown";
import { WelcomeAnimated } from "@/components/about/WelcomeAnimated";

/**
 * The client's welcome section.
 * Arranged in a balanced 2-column layout with smooth scroll-in animations.
 */
export function WelcomeSection() {
  const copy = section(getPage("about"), "welcome");
  const lead = field(copy, "lead");
  const craft = field(copy, "craft");
  const invitation = field(copy, "invitation");
  const closing = field(copy, "closing");

  return (
    <section className="relative isolate bg-mist py-10 sm:py-14 lg:py-24">
      <WeaveArt pattern="lace" tone="mist" scale={1.6} intensity={0.08} />

      <Container className="relative">
        <WelcomeAnimated
          lead={lead}
          craft={craft}
          invitation={invitation}
          closing={closing}
        />
      </Container>
    </section>
  );
}


