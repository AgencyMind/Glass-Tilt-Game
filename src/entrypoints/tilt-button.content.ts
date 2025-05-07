import { browser } from 'wxt/browser';
import { defineContentScript } from 'wxt/utils/define-content-script';

export default defineContentScript({
  matches: ['https://*.hey.xyz/*'],
  runAt: 'document_idle',
  main: () => {
    const BUTTON_ID = 'glass-tilt-game-sidebar-button';
    const CONTAINER = 'main#_hey_ aside';
    const PROFILE = 'div[data-headlessui-state] > button';
    let obs: MutationObserver | null = null;

    function ref(): Element | null {
      const c = document.querySelector(CONTAINER);
      return c ? c.querySelector(PROFILE) : null;
    }

    function btn(): HTMLButtonElement {
      const b = document.createElement('button');
      b.id = BUTTON_ID;
      b.textContent = '🎲';
      b.style.cssText =
        'display:flex;align-items:center;justify-content:center;width:24px;height:24px;margin:8px auto 24px;padding:0;font-size:20px;background:none;border:none;cursor:pointer;transition:transform .2s ease;';
      b.onmouseenter = () => (b.style.transform = 'scale(1.1)');
      b.onmouseleave = () => (b.style.transform = 'scale(1)');
      b.addEventListener('click', async e => {
        e.preventDefault();
        e.stopPropagation();
        await browser.runtime.sendMessage({
          action: 'navigateToPost',
          url: 'https://hey.xyz/posts/0x01-0x01'
        });
      });
      return b;
    }

    function upsert(): void {
      const r = ref();
      const ex = document.getElementById(BUTTON_ID);
      if (r?.parentElement) {
        const p = r.parentElement;
        if (!ex) p.insertBefore(btn(), r);
        else if (ex.nextElementSibling !== r) p.insertBefore(ex, r);
      } else ex?.remove();
    }

    function watch(): void {
      obs?.disconnect();
      obs = new MutationObserver(m => {
        if (
          m.some(
            x =>
              x.type === 'childList' &&
              (x.addedNodes.length || x.removedNodes.length)
          )
        ) {
          upsert();
        }
      });
      const root = document.querySelector(CONTAINER) || document.body;
      obs.observe(root, { childList: true, subtree: true });
    }

    if (!(window as any).glassTiltGameInitialized) {
      (window as any).glassTiltGameInitialized = true;
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          upsert();
          watch();
        });
      } else {
        upsert();
        watch();
      }
    }
  }
});