import { browser } from 'wxt/browser';

function onInstalledHandler(details: browser.runtime.OnInstalledDetailsType): void {
  console.log('Glass Tilt Game: Background script installed/updated.', details);
}

function initializeBackgroundScript(): void {
  console.log('Glass Tilt Game: Initializing background script...');
  browser.runtime.onInstalled.addListener(onInstalledHandler);
  console.log('Glass Tilt Game: Background script ready.');
}

initializeBackgroundScript();