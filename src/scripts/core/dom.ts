export const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  scope.querySelector<T>(sel);

export const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel));

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Keeps keyboard focus inside `container` while active. Returns a release function. */
export function trapFocus(container: HTMLElement) {
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const items = $$<HTMLElement>(FOCUSABLE, container).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  document.addEventListener('keydown', onKey);
  return () => document.removeEventListener('keydown', onKey);
}

export const firstFocusable = (container: HTMLElement) =>
  $$<HTMLElement>(FOCUSABLE, container).find((el) => el.offsetParent !== null);

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
