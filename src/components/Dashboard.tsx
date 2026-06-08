import { useEffect, useState } from 'react';
import { statsStorage } from '@/src/storage/stats';

export default function Dashboard() {
  const [removed, setRemoved] = useState(0);
  const [intercepted, setIntercepted] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    async function load() {
      setRemoved(await statsStorage.removedCount.getValue());
      setIntercepted(await statsStorage.interceptCount.getValue());
      setStreak(await statsStorage.streakDays.getValue());
      setIsLoading(false);
    }
    load();

    const u1 = statsStorage.removedCount.watch(setRemoved);
    const u2 = statsStorage.interceptCount.watch(setIntercepted);
    const u3 = statsStorage.streakDays.watch(setStreak);
    return () => { u1(); u2(); u3(); };
  }, []);

  if (isLoading) return null;

  // Time Rescued is tied to the integrity metric (Shorts actually opened &
  // intercepted), not the feed-removal count — so it stays defensible.
  const totalSeconds = intercepted * 40;
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  async function share() {
    const text =
      `🧠 ${streak}-day focus streak with Bajigu — I've kept ${removed.toLocaleString()} ` +
      `Shorts & Reels out of my feed and resisted ${intercepted.toLocaleString()} of them. #BajiguFocus`;
    try {
      if (navigator.share) await navigator.share({ text });
      else await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-zinc-950 text-zinc-100 font-sans selection:bg-brand selection:text-white">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: greeting + streak hero + share */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">Focus Restored</h1>
            <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">Your attention is your most valuable asset.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
            <div className="text-sm text-zinc-500 font-bold mb-2 uppercase tracking-widest">Current Streak</div>
            <div className="text-5xl font-black text-brand flex items-baseline space-x-2">
              <span>{streak}</span>
              <span className="text-2xl text-zinc-500 font-bold">days</span>
            </div>
          </div>

          <button
            onClick={share}
            className="self-start bg-brand hover:bg-brand-light transition-colors text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-brand/20"
          >
            {shared ? 'Copied! ✓' : 'Share my progress →'}
          </button>
        </div>

        {/* Right: scale + integrity + time */}
        <div className="grid grid-cols-1 gap-6">
          {/* Scale metric */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
            </div>
            <div className="text-sm text-zinc-500 font-bold mb-4 uppercase tracking-widest">Removed From Feed</div>
            <div className="text-6xl font-black text-white mb-2 z-10">{removed.toLocaleString()}</div>
            <div className="text-sm text-zinc-400 font-medium z-10">Shorts &amp; Reels kept out of sight</div>
          </div>

          {/* Integrity metric + time rescued */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-24 h-24 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div className="flex items-baseline justify-between mb-4 z-10">
              <div className="text-sm text-zinc-500 font-bold uppercase tracking-widest">You Resisted</div>
              <div className="text-sm text-zinc-500 font-bold uppercase tracking-widest">
                Time Rescued <span className="text-[10px] ml-1 bg-zinc-800 px-2 py-1 rounded text-zinc-400 font-bold">EST.</span>
              </div>
            </div>
            <div className="flex items-end justify-between z-10">
              <div className="text-6xl font-black text-white">{intercepted.toLocaleString()}</div>
              <div className="flex items-baseline space-x-1">
                <div className="text-4xl font-black text-white">{hours}</div>
                <div className="text-xl text-zinc-500 font-bold uppercase">h</div>
                <div className="text-4xl font-black text-white ml-1">{mins}</div>
                <div className="text-xl text-zinc-500 font-bold uppercase">m</div>
              </div>
            </div>
            <div className="text-sm text-zinc-500 mt-4 font-medium z-10">Shorts you opened, then walked away from · ~40s each</div>
          </div>
        </div>
      </div>
    </div>
  );
}
