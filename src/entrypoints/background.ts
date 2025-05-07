import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(details => {
    console.log('Glass Tilt Game installed/updated.', details);
  });

  browser.runtime.onMessage.addListener(async (message, sender) => {
    if (
      message.action === 'navigateToPost' &&
      sender.tab?.id &&
      typeof message.url === 'string'
    ) {
      await browser.tabs.update(sender.tab.id, { url: message.url });
    }
  });
});