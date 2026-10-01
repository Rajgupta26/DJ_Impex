import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reg } from "@/components/ui/Reg";

export function ExploreNabeenCTA({
  bg = "bg-white",
  className = "",
}: {
  bg?: string;
  className?: string;
}) {
  return (
    <section className={`${bg} py-11 sm:py-12 lg:py-16 ${className}`.trim()}>
      <Container className="flex justify-center">
        <Link
          href="/nabeen"
          className="group inline-flex max-w-full items-center gap-2 rounded-full bg-navy px-5 py-4 text-sm sm:px-8 sm:gap-3 sm:text-base font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:bg-navy-soft hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span>
            Explore Nabeen<Reg /> Collection
          </span>
          <span
            className="text-accent transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </Container>
    </section>
  );
}
