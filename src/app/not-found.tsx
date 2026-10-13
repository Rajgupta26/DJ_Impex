import type { Metadata } from "next";
import { InteractiveThread404 } from "@/components/ui/InteractiveThread404";

export const metadata: Metadata = {
  title: "404 - The thread seems to have been lost | DJ Impex",
  description:
    "The page you are looking for is unfinished or no longer exists. Return to our luxury fabric collection.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen min-h-svh w-full items-center justify-center bg-[#f7f7f2] text-[#1e232e]">
      <InteractiveThread404 />
    </main>
  );
}
