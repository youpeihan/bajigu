import { useEffect, useState } from 'react';
import { statsStorage } from '@/src/storage/stats';
import Dashboard from '@/src/components/Dashboard';

/** Clean neutral page shown when the user has opted out of the dashboard. */
function NeutralNewTab() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6">
      <button
        autoFocus
        onClick={() => statsStorage.useNativeNewtab.setValue(false)}
        className="text-zinc-600 hover:text-zinc-300 transition-colors text-sm font-semibold"
      >
        Show focus dashboard
      </button>
    </div>
  );
}

export default function App() {
  const [useNative, setUseNative] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setUseNative(await statsStorage.useNativeNewtab.getValue());
      setIsLoading(false);
    }
    load();
    const unwatch = statsStorage.useNativeNewtab.watch(setUseNative);
    return () => unwatch();
  }, []);

  if (isLoading) return null;
  return useNative ? <NeutralNewTab /> : <Dashboard />;
}
