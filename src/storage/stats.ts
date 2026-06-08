export const statsStorage = {
  // Scale metric. NOTE: storage key stays 'local:blockedCount' so existing
  // users' historical numbers carry over — this value always really measured
  // "Shorts removed from the feed", it was just mislabeled before.
  removedCount: storage.defineItem<number>('local:blockedCount', {
    defaultValue: 0,
  }),
  // Integrity metric: Shorts/Reels the user actually opened and we redirected.
  interceptCount: storage.defineItem<number>('local:interceptCount', {
    defaultValue: 0,
  }),
  lastActiveDate: storage.defineItem<string>('local:lastActiveDate', {
    defaultValue: '',
  }),
  streakDays: storage.defineItem<number>('local:streakDays', {
    defaultValue: 0,
  }),
  masterToggle: storage.defineItem<boolean>('local:masterToggle', {
    defaultValue: true,
  }),
  youtubeToggle: storage.defineItem<boolean>('local:youtubeToggle', {
    defaultValue: true,
  }),
  facebookToggle: storage.defineItem<boolean>('local:facebookToggle', {
    defaultValue: true,
  }),
  // When true, the new-tab override renders a neutral blank page instead of the
  // dashboard. The dashboard is still reachable from the popup.
  useNativeNewtab: storage.defineItem<boolean>('local:useNativeNewtab', {
    defaultValue: false,
  }),
};

/** Advance the consecutive-day focus streak. Idempotent within a day. */
async function touchStreak() {
  const today = new Date().toLocaleDateString('en-CA');
  const lastActive = await statsStorage.lastActiveDate.getValue();
  if (lastActive === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-CA');

  let streak = await statsStorage.streakDays.getValue();
  streak = lastActive === yesterdayStr ? streak + 1 : 1;

  await statsStorage.streakDays.setValue(streak);
  await statsStorage.lastActiveDate.setValue(today);
}

/** Scale metric: Shorts/Reels removed from the feed. Drives the daily streak. */
export async function incrementRemoved(amount: number = 1) {
  const current = await statsStorage.removedCount.getValue();
  await statsStorage.removedCount.setValue(current + amount);
  await touchStreak();
}

/** Integrity metric: a Short/Reel the user opened that we intercepted. */
export async function incrementIntercept(amount: number = 1) {
  const current = await statsStorage.interceptCount.getValue();
  await statsStorage.interceptCount.setValue(current + amount);
  await touchStreak();
}
