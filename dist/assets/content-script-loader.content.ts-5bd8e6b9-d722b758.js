(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.ts-5bd8e6b9.js")
    );
  })().catch(console.error);

})();
