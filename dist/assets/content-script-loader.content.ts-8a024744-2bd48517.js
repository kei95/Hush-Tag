(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.ts-8a024744.js")
    );
  })().catch(console.error);

})();
