// Browser: one shared <audio> for every play button on the page.
// <button data-say="기역"> plays /audio/ko/ae30_c5ed.mp3; data-slow plays it at 0.7×;
// data-src gives a full URL instead.

let el: HTMLAudioElement | null = null;
let current: HTMLElement | null = null;

export const clipUrl = (ko: string) =>
  '/audio/ko/' + [...ko].map((c) => c.codePointAt(0)!.toString(16).padStart(4, '0')).join('_') + '.mp3';

function mark(btn: HTMLElement | null) {
  current?.classList.remove('is-playing');
  current = btn;
  btn?.classList.add('is-playing');
}

export function play(src: string, opts: { slow?: boolean; button?: HTMLElement | null } = {}) {
  el ??= new Audio();
  el.pause();
  el.src = src;
  el.playbackRate = opts.slow ? 0.7 : 1;
  el.preservesPitch = true;
  mark(opts.button ?? null);
  el.onended = el.onerror = () => mark(null);
  return el.play().catch(() => mark(null));
}

export const say = (ko: string, opts: { slow?: boolean; button?: HTMLElement | null } = {}) => play(clipUrl(ko), opts);

export function wirePlayButtons(root: Document | HTMLElement = document) {
  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-say], [data-src]');
    if (!btn) return;
    const src = btn.dataset.src ?? clipUrl(btn.dataset.say!);
    play(src, { slow: 'slow' in btn.dataset, button: btn });
  });
}
