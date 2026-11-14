import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useRoute } from '../lib/router';
import s from './Shell.module.css';
export function Brand() {
  return (
    <Link className={s.brand} href="/">
      <svg width="36" height="36" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M3 21h34M20 3v34M6 21q14-21 28 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="20" cy="21" r="2.5" fill="currentColor" />
      </svg>
      <span>RIMWAKE</span>
    </Link>
  );
}
export function Header() {
  const { path } = useRoute();
  const [menu, setMenu] = useState(false);
  return (
    <>
      <a className={s.skip} href="#main">
        Skip to content
      </a>
      <header className={s.header}>
        <Brand />
        <nav className={s.navigation} aria-label="Primary">
          {[
            ['/', 'Experience'],
            ['/explore', 'Explorer'],
            ['/field-guide', 'Field Guide'],
          ].map(([url, label]) => (
            <Link key={url} href={url} aria-current={path === url ? 'page' : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <Link className={s.headerAction} href="/explore">
          Explore the skies <span aria-hidden="true">↗</span>
        </Link>
        <button
          className={s.menuButton}
          onClick={() => setMenu(true)}
          aria-label="Open navigation menu"
        >
          Menu <span>+</span>
        </button>
      </header>
      {menu && (
        <Dialog title="Navigate RIMWAKE" onClose={() => setMenu(false)}>
          <nav className={s.menuNav} aria-label="Mobile primary">
            {[
              ['/', 'Experience'],
              ['/explore', 'Explorer'],
              ['/field-guide', 'Field Guide'],
              ['/sources', 'Sources'],
            ].map(([url, label]) => (
              <Link key={url} href={url} onClick={() => setMenu(false)}>
                {label}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
        </Dialog>
      )}
    </>
  );
}
export function Footer() {
  return (
    <footer className={s.footer}>
      <Brand />
      <p>
        Where you stand
        <br />
        changes the sky.
      </p>
      <div>
        <Link href="/sources#credits">Sources, credits & AI disclosure ↗</Link>
        <span>Independent educational project · 2026</span>
      </div>
    </footer>
  );
}
export function Dialog({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={`${s.dialog} ${wide ? s.wide : ''}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const elements = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href],button:not(:disabled),summary,input,select,textarea,[tabindex="0"]',
          ),
        ].filter((element) => element.checkVisibility());
        const first = elements[0],
          last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <div className={s.dialogTop}>
        <span className="eyebrow">RIMWAKE / INSPECT</span>
        <button autoFocus onClick={onClose} aria-label={`Close ${title}`}>
          Close <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className={s.dialogContent}>{children}</div>
    </dialog>
  );
}
