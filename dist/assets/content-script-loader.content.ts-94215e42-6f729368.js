(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.ts-94215e42.js")
    );
  })().catch(console.error);

})();
