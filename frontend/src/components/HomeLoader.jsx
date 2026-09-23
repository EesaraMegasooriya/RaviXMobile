import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import WebLoader from "./WebLoader";

export default function HomeLoader({ dataLoading }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const root = document.getElementById("root");
    const previousInert = root?.inert;
    const previousOverflow = document.body.style.overflow;
    if (root) root.inert = true;
    document.body.style.overflow = "hidden";
    return () => {
      if (root) root.inert = previousInert;
      document.body.style.overflow = previousOverflow;
    };
  }, [ready]);

  useEffect(() => {
    if (dataLoading || ready) return;

    let cancelled = false;
    let settledChecks = 0;
    const decoded = new WeakMap();
    // Two settled checks allow React to render image error fallbacks first.
    const interval = window.setInterval(() => {
      let allReady = document.fonts?.status !== "loading";
      for (const img of document.querySelectorAll("img")) {
        img.loading = "eager";
        if (!img.complete) {
          allReady = false;
          continue;
        }
        if (!img.naturalWidth) continue; // Failed images must not block entry.
        const source = img.currentSrc || img.src;
        let entry = decoded.get(img);
        if (entry?.source !== source) {
          entry = { source, done: false };
          decoded.set(img, entry);
          Promise.resolve().then(() => img.decode?.()).catch(() => {}).then(() => {
            if (!cancelled) entry.done = true;
          });
        }
        if (!entry.done) allReady = false;
      }
      settledChecks = allReady ? settledChecks + 1 : 0;
      if (settledChecks >= 2) setReady(true);
    }, 100);
    // Release the overlay if an image server never finishes responding.
    const timeout = window.setTimeout(() => setReady(true), 30000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [dataLoading, ready]);

  return ready ? null : createPortal(<WebLoader />, document.body);
}
