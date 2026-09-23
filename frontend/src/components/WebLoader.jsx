import Logo from "../assets/Logo.png";

// Full-screen splash shown while the app or a page's data is loading.
// One deliberate animated moment (the pulse on the mark) plus a slim
// indeterminate progress bar — both respect prefers-reduced-motion.
function WebLoader() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-8 bg-[#05080B]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px]" />

      <img
        src={Logo}
        alt="RaviX Mobile Hub"
        className="relative h-24 w-24 object-contain motion-safe:animate-pulse"
      />

      <div className="relative h-1 w-40 overflow-hidden rounded-full bg-white/10">
        <div className="loader-sweep absolute inset-y-0 w-1/2 rounded-full bg-cyan-400" />
      </div>

      <span className="sr-only" role="status">Loading…</span>

      <style>{`
        @keyframes loaderSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .loader-sweep {
          animation: loaderSweep 1.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .loader-sweep {
            animation: none;
            width: 40%;
          }
        }
      `}</style>
    </div>
  );
}

export default WebLoader;
