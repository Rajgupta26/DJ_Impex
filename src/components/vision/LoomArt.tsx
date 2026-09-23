import { WeaveArt } from "@/components/ui/WeaveArt";

/**
 * The loom: thread becoming cloth.
 *
 * There is still no photography for this page, and the brochure scans are
 * 300-480px, so the panel is drawn rather than filled with someone else's
 * picture. It is built the way the cloth is: warp threads hung down the whole
 * panel, and the weave closing up across it from left to right, so the empty
 * side carries the words and the woven side carries the eye.
 *
 * Threads are CSS gradients, not SVG: they stay a crisp hairline at any width
 * and cost nothing. The cloth is the house herringbone, the suiting weave.
 */
export function LoomArt() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(112deg,var(--color-navy-deep),var(--color-navy)_64%,var(--color-navy-soft))]" />

      {/* Warp: the threads on the beam. Two periods, so it does not read as
          graph paper -- a fine thread every 44px and a stronger one every 133. */}
      <div
        className="loom-warp absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_43px,rgb(95_149_221/0.16)_43px_44px),repeating-linear-gradient(90deg,transparent_0_131px,rgb(95_149_221/0.34)_131px_133px)]"
      />

      {/* Cloth: the weave closing up towards the right of the panel. A phone is
          too narrow for the weave to stay out of the words' way, so it is held
          back there rather than drawn across the whole screen. */}
      <div className="loom-cloth absolute inset-0 opacity-45 [mask-image:linear-gradient(104deg,transparent_20%,black_64%)] sm:opacity-80 lg:opacity-100">
        <WeaveArt bare pattern="herringbone" scale={0.92} intensity={0.3} />
      </div>

      {/* Raking light from the lower left, which is where the words sit: it
          keeps their ground close to flat navy while the cloth stays lit. */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_105%_at_6%_100%,rgb(13_23_51/0.94)_0%,rgb(13_23_51/0.55)_42%,transparent_76%)]" />

      {/* And a second fall to the foot of the panel, because the type sits low
          and the threads would otherwise run straight through the reading. */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-[linear-gradient(to_top,rgb(13_23_51/0.8)_0%,rgb(13_23_51/0.38)_46%,transparent_100%)]" />
    </div>
  );
}
