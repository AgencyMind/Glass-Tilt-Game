import browser from 'webextension-polyfill';
const BUTTON_ID = 'glass-tilt-game-sidebar-button';
const SIDEBAR_CONTAINER_SELECTOR = 'main#_hey_ aside';
const PROFILE_BUTTON_SELECTOR = 'div[data-headlessui-state] > button';
let injectionObserver: MutationObserver | null = null;
function findInsertionReferencePoint(): Element | null {
  try {
    const container = document.querySelector(SIDEBAR_CONTAINER_SELECTOR);
    if (!container) {
      return null;
    }
    const profileButtonElement = container.querySelector(PROFILE_BUTTON_SELECTOR);
    return profileButtonElement;
  } catch (error) {
    console.error(`[${BUTTON_ID}] Error finding reference point:`, error);
    return null;
  }
}
function createTiltButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = BUTTON_ID;
  button.textContent = '🎲';
  button.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin: 8px auto 24px auto;
    padding: 0;
    font-size: 20px;
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease;
  `;
  button.title = 'Discover something new with Glass Tilt';
  button.onmouseenter = () => {
    button.style.transform = 'scale(1.1)';
  };
  button.onmouseleave = () => {
    button.style.transform = 'scale(1)';
  };
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(`%c[${BUTTON_ID}] Tilt button clicked!`, 'color: dodgerblue; font-weight: bold;');
  });
  return button;
}
function addOrUpdateTiltButton(): void {
  const referenceElement = findInsertionReferencePoint();
  const existingButton = document.getElementById(BUTTON_ID);
  if (referenceElement?.parentElement) {
    const parentContainer = referenceElement.parentElement;
    if (!existingButton) {
      const button = createTiltButton();
      parentContainer.insertBefore(button, referenceElement);
    } else if (existingButton.nextElementSibling !== referenceElement) {
      parentContainer.insertBefore(existingButton, referenceElement);
    }
  } else {
    if (existingButton) {
      existingButton.remove();
    }
  }
}
function observeDOMChanges(): void {
  if (injectionObserver) {
    injectionObserver.disconnect();
  }
  injectionObserver = new MutationObserver((mutations) => {
     let relevantChange = false;
     for (const mutation of mutations) {
         if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
             relevantChange = true;
             break;
         }
     }
     if(relevantChange) {
         addOrUpdateTiltButton();
     }
  });
  const containerToObserve = document.querySelector(SIDEBAR_CONTAINER_SELECTOR) || document.body;
  try {
      injectionObserver.observe(containerToObserve, {
          childList: true,
          subtree: true,
      });
  } catch (error) {
      console.error(`[${BUTTON_ID}] Failed to initialize MutationObserver:`, error);
  }
}
function initialize(): void {
  requestAnimationFrame(() => {
    addOrUpdateTiltButton();
    observeDOMChanges();
  });
}
if (!(window as any).glassTiltGameInitialized) {
  (window as any).glassTiltGameInitialized = true;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}
export {};