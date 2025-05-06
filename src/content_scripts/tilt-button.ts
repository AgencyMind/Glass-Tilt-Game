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
    display: block;
    width: 40px;
    height: 40px;
    margin: 15px auto;
    padding: 0;
    font-size: 1.8rem;
    border: 1px solid #888;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    line-height: 40px;
    text-align: center;
    color: #333;
    transition: background-color 0.2s ease;
  `;
  button.title = 'Tilt with Glass Tilt Game!';

  button.onmouseenter = () => button.style.backgroundColor = 'rgba(230, 230, 230, 0.9)';
  button.onmouseleave = () => button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  button.onfocus = () => button.style.boxShadow = '0 0 0 2px rgba(0, 120, 255, 0.5)';
  button.onblur = () => button.style.boxShadow = 'none';

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(`%c[${BUTTON_ID}] Tilt button clicked!`, 'color: dodgerblue; font-weight: bold;');
    // TODO: Implement phase 2 navigation logic
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
      observer.observe(containerToObserve, {
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