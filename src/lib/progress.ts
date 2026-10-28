// "Your 40 letters": the letters a visitor has learned, kept in this browser only.
// Every page reads it; anything that changes it calls learn() or clear(), and
// all listeners (header dots, hints, tiles) update through one event.

const KEY = 'hanguledu.letters.v1';
const EVENT = 'hanguledu:letters';

export const ALL = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㄸㅃㅆㅉㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣㅐㅒㅔㅖㅘㅙㅚㅝㅞㅟㅢ';

export function known(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return new Set(Array.isArray(raw) ? raw.filter((g) => ALL.includes(g)) : []);
  } catch {
    return new Set();
  }
}

function save(set: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...ALL].filter((g) => set.has(g))));
  } catch {
    /* private mode: progress lives until the tab closes */
  }
  memory = set;
  window.dispatchEvent(new CustomEvent(EVENT));
}

let memory: Set<string> | null = null;
const current = () => (memory ??= known());

export function learn(...letters: string[]) {
  const set = current();
  const before = set.size;
  letters.forEach((g) => ALL.includes(g) && set.add(g));
  if (set.size !== before) save(set);
}

export function clear() {
  save(new Set());
}

export const has = (g: string) => current().has(g);
export const count = () => current().size;
export const list = () => [...ALL].filter((g) => current().has(g));

export function onChange(fn: (letters: Set<string>) => void) {
  const run = () => fn(current());
  window.addEventListener(EVENT, run);
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      memory = null;
      run();
    }
  });
  run();
}

/** A syllable's letters are all known: data-jamo="ㅎㅏㄴ". Compound finals count as their parts. */
export const knowsAll = (letters: string, set = current()) => [...letters].every((g) => set.has(g));
