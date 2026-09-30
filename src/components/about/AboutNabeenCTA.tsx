import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reg } from "@/components/ui/Reg";

export function AboutNabeenCTA() {
  return (
    <section className="bg-white pb-16 pt-4 sm:pb-20 sm:pt-6">
      <Container className="flex justify-center">
        <Link
          href="/nabeen"
          className="group inline-flex items-center gap-3 rounded-full bg-navy px-8 py-4 text-sm sm:text-base font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:bg-navy-soft hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span>Explore Nabeen<Reg /> Collection</span>
          <span
            className="transition-transform duration-300 group-hover:translate-x-1 text-accent"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </Container>
    </section>
  );
}
