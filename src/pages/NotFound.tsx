import { useSeoMeta } from "@unhead/react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Shield, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useSeoMeta({
    title: "404 - Signal Lost | 0xPrivacy.online",
    description: "The page you are looking for could not be found. Return to the home page to continue browsing.",
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center hex-grid-bg relative isolate">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#00ff9f] rounded-full opacity-[0.02] blur-[100px]" />
      </div>

      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-lg border border-[#00ff9f]/20 bg-[#00ff9f]/5">
          <Shield className="w-8 h-8 text-[#00ff9f]/40" />
        </div>

        <h1 className="font-mono text-6xl sm:text-8xl font-bold text-[#00ff9f]/20 mb-2">404</h1>
        <p className="font-mono text-sm text-[#00ff9f]/60 mb-2">// signal_lost</p>
        <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
          This route does not exist. It may have been redacted, or you have wandered beyond the grid.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff9f]/10 border border-[#00ff9f]/20 rounded text-sm font-mono text-[#00ff9f] hover:bg-[#00ff9f]/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Base
          </Link>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded text-sm font-mono text-white/40 hover:text-white/60 hover:bg-white/[0.02] transition-all"
          >
            Browse Tools
          </Link>
        </div>

        <p className="mt-12 font-mono text-[10px] text-white/10">
          requested: {location.pathname}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
