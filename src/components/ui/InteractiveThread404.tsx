import Image from "next/image";
import Link from "next/link";

export function InteractiveThread404() {
  return (
    <div className="mx-auto grid w-full max-w-[1240px] items-center md:grid-cols-[57%_43%]">
      {/* Preserve the reference artwork, with readable HTML copy and links alongside it. */}
      <div className="relative aspect-[584/572] w-full overflow-hidden" aria-hidden="true">
        <Image
          src="/images/404/exact-404-clean.webp"
          alt=""
          width={1024}
          height={572}
          priority
          sizes="(max-width: 767px) 175vw, 1240px"
          className="pointer-events-none block h-auto max-w-none select-none"
          style={{ width: "175.342466%" }}
        />
      </div>
      <div
        className="px-6 pt-2 pb-12 font-normal sm:px-10 md:py-10 md:pr-8 md:pl-[9%]"
        style={{ fontFamily: 'var(--font-open-sans), "Open Sans", sans-serif' }}
      >
        <p className="mb-4 text-sm tracking-[0.1em] text-[#171717] lg:text-base">404 ERROR</p>
        <h1 className="text-[clamp(2.125rem,4.1vw,3.625rem)] leading-[1.15] font-normal tracking-[-0.035em] text-[#111111]">
          The thread seems to have been lost...
        </h1>
        <p className="mt-5 text-base leading-[1.65] text-[#242424] lg:text-lg">
          The page you are looking for is unfinished or no longer exists.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border border-[#151c28] bg-[#252d3b] px-4 py-3 text-center text-sm font-normal text-white shadow-[0_8px_16px_rgba(28,35,46,0.24)] transition-colors hover:bg-[#151c28] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#252d3b]"
          >
            GO BACK HOME <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/nabeen"
            className="inline-flex min-h-12 items-center justify-center rounded-[3px] border border-[#a8a9a3] bg-transparent px-4 py-3 text-center text-sm font-normal text-[#171717] transition-colors hover:bg-[#eae8e0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#252d3b]"
          >
            BROWSE FABRICS
          </Link>
        </div>
      </div>
    </div>
  );
}
