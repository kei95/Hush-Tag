(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.ts-7e0fa926.js")
    );
  })().catch(console.error);

})();
