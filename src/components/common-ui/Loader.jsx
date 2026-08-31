// components/common/Loader.jsx

import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;