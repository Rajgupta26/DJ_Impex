"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Tracks which full-screen overlays are open (the mobile menu, the contact popup)
 * so the floating actions can step out of the way and the page behind can stop
 * scrolling. One shared source of truth beats three components guessing.
 */
type OverlayContextValue = {
  open: string[];
  setOpen: (id: string, isOpen: boolean) => void;
};

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpenIds] = useState<string[]>([]);

  const setOpen = useCallback((id: string, isOpen: boolean) => {
    setOpenIds((current) => {
      const without = current.filter((item) => item !== id);
      return isOpen ? [...without, id] : without;
    });
  }, []);

  useEffect(() => {
    if (open.length === 0) return;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, [open.length]);

  const value = useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}

function useOverlayContext(): OverlayContextValue {
  const context = useContext(OverlayContext);
  if (!context) throw new Error("useOverlay must be used inside OverlayProvider");
  return context;
}

/** Register an overlay's open state. */
export function useOverlay(id: string, isOpen: boolean) {
  const { setOpen } = useOverlayContext();
  useEffect(() => {
    setOpen(id, isOpen);
    return () => setOpen(id, false);
  }, [id, isOpen, setOpen]);
}

export function useAnyOverlayOpen(): boolean {
  return useOverlayContext().open.length > 0;
}
