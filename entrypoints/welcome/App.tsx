import { useState } from 'react';
import { statsStorage } from '@/src/storage/stats';

export default function App() {
  const [done, setDone] = useState(false);

  async function choose(useNative: boolean) {
    await statsStorage.useNativeNewtab.setValue(useNative);
    setDone(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-zinc-950 text-zinc-100 font-sans selection:bg-brand selection:text-white">
      <div className="max-w-xl w-full space-y-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">Bajigu</span>
        </div>

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            You're set. Shorts &amp; Reels are now blocked.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Bajigu hides YouTube Shorts and Facebook Reels, and redirects any Short you
            open to the normal video player.
          </p>
          <p className="text-zinc-500 text-sm leading-relaxed mt-3 italic">
            Named by my two-year-old — her best try at "peek-a-boo." Bajigu hands those
            scrolled-away minutes back, for whatever matters most to you.
          </p>
        </div>

        <ul className="space-y-3 text-zinc-300">
          <li className="flex items-start space-x-3">
            <span className="text-brand font-black">✓</span>
            <span><strong className="text-white">No ads, ever.</strong> We don't change your search engine or inject anything.</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-brand font-black">✓</span>
            <span><strong className="text-white">100% local.</strong> Your stats live only on this device — nothing is sent anywhere.</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-brand font-black">✓</span>
            <span><strong className="text-white">Your call.</strong> Bajigu can turn your new tab into a focus dashboard with your streak — or stay out of the way.</span>
          </li>
        </ul>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="text-sm text-zinc-400 font-medium">
            Make your new tab a focus dashboard (streak, time rescued, progress)?
          </div>
          {done ? (
            <div className="text-brand font-bold">Saved — you can change this anytime from the popup. You can close this tab.</div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => choose(false)}
                className="flex-1 bg-brand hover:bg-brand-light transition-colors text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-brand/20"
              >
                Yes, show my dashboard
              </button>
              <button
                onClick={() => choose(true)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-200 font-bold px-5 py-3 rounded-2xl"
              >
                No, keep a blank new tab
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
