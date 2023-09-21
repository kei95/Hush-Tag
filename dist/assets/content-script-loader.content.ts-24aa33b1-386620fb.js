(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.ts-24aa33b1.js")
    );
  })().catch(console.error);

})();
