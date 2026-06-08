import { useEffect, useState } from 'react';
import { statsStorage } from '@/src/storage/stats';

const GITHUB_NEW_ISSUE = 'https://github.com/youpeihan/bajigu/issues/new?template=broken-rule.yml';

function getPlatform(url: string): string {
  if (url.includes('youtube.com')) return 'YouTube';
  if (url.includes('facebook.com')) return 'Facebook';
  return 'Unknown';
}

export default function App() {
  const [masterToggle, setMasterToggle] = useState(true);
  const [youtubeToggle, setYoutubeToggle] = useState(true);
  const [facebookToggle, setFacebookToggle] = useState(true);
  const [useNative, setUseNative] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setMasterToggle(await statsStorage.masterToggle.getValue());
      setYoutubeToggle(await statsStorage.youtubeToggle.getValue());
      setFacebookToggle(await statsStorage.facebookToggle.getValue());
      setUseNative(await statsStorage.useNativeNewtab.getValue());
      setIsLoading(false);
    }
    loadStats();

    const u1 = statsStorage.masterToggle.watch(setMasterToggle);
    const u2 = statsStorage.youtubeToggle.watch(setYoutubeToggle);
    const u3 = statsStorage.facebookToggle.watch(setFacebookToggle);
    const u4 = statsStorage.useNativeNewtab.watch(setUseNative);

    return () => { u1(); u2(); u3(); u4(); };
  }, []);

  if (isLoading) return null;

  return (
    <div className="p-5 flex flex-col space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <img src="/icon/128.png" alt="Bajigu" className="w-6 h-6 rounded-md shadow-lg shadow-brand/20" />
          <span className="font-extrabold text-xl text-white tracking-tight">Bajigu</span>
        </div>
        
        <button 
          onClick={() => statsStorage.masterToggle.setValue(!masterToggle)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${masterToggle ? 'bg-brand' : 'bg-zinc-700'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${masterToggle ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className={`flex flex-col space-y-5 ${!masterToggle ? 'opacity-40 pointer-events-none' : ''} transition-opacity`}>
        <div className="flex items-center justify-between">
          <span className="text-zinc-300 font-semibold tracking-wide">YouTube Shorts</span>
          <button 
            onClick={() => statsStorage.youtubeToggle.setValue(!youtubeToggle)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${youtubeToggle ? 'bg-brand' : 'bg-zinc-700'}`}
          >
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${youtubeToggle ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-zinc-300 font-semibold tracking-wide">Facebook Reels</span>
          <button 
            onClick={() => statsStorage.facebookToggle.setValue(!facebookToggle)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${facebookToggle ? 'bg-brand' : 'bg-zinc-700'}`}
          >
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${facebookToggle ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="pt-5 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Focus dashboard new tab</span>
        <button
          onClick={() => statsStorage.useNativeNewtab.setValue(!useNative)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${!useNative ? 'bg-brand' : 'bg-zinc-700'}`}
        >
          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${!useNative ? 'translate-x-5' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className="pt-5 border-t border-zinc-800">
        <button
          onClick={async () => {
            const tabs = await browser.tabs.query({ active: true, currentWindow: true });
            const currentUrl = tabs[0]?.url ?? '';
            const platform = getPlatform(currentUrl);
            // Prefill the issue-form fields by their ids (site, url).
            window.open(
              `${GITHUB_NEW_ISSUE}&site=${encodeURIComponent(platform)}&url=${encodeURIComponent(currentUrl)}`,
              '_blank'
            );
          }}
          className="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-bold uppercase tracking-wider py-2"
        >
          Report Broken Rule
        </button>
      </div>

      <div className="text-center">
         <button onClick={() => { browser.tabs.create({ url: browser.runtime.getURL('/dashboard.html') }); }} className="text-sm text-brand hover:text-brand-light transition-colors font-bold cursor-pointer">Open Dashboard →</button>
      </div>
    </div>
  );
}
