(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.ts-2f6a6568.js")
    );
  })().catch(console.error);

})();
