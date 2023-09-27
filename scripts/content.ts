import {
  hideNonTweetElement,
  hideSpecificAccount,
  hideNonJapaneseTweet,
} from "./hideFlags";
import {
  checkIfHTMLElement,
  skipIfTweetIsHidden,
  skipIfTweetFromOwner as skipIfOriginalTweet,
  skipIfOriginalTweetIsNonJapanese,
} from "./skipFlags";

// =============== util functions ===============
function hideTweet(targetTWeet: HTMLElement) {
  targetTWeet.style.display = "none";
}

/** Flag to tell if the original tweet of current thread is non japanese */
let nonJapaneseThreadFlag = false;

/** Script to run when observer catches DOM updates */
function script() {
  // when it's not on reply page, do nothing
  const isAtRepliesPage = window.location.pathname.includes("status");
  if (!isAtRepliesPage) {
    return;
  }

  const baseElement = document.body.querySelector(
    '[aria-label="Timeline: Conversation"]'
  );
  const targetTweets = baseElement?.querySelectorAll(
    '[data-testid="cellInnerDiv"]'
  );

  // if targetTweets don't exist in DOM, skip the execution
  if (!targetTweets || !baseElement) return;

  // Iterate though tweets and apply style update to hide ones that are "inappropriate"
  for (const targetTweet of targetTweets) {
    // skip checks - if any of the following is true, skip the check
    if (!checkIfHTMLElement(targetTweet)) continue;
    if (skipIfTweetIsHidden(targetTweet)) continue;
    if (skipIfOriginalTweet(targetTweet)) {
      // When the original tweet is being checked, update the flag to tell whether if it's Japanese
      nonJapaneseThreadFlag = skipIfOriginalTweetIsNonJapanese(targetTweet);
      continue;
    }

    // If the original tweet is not in Japanese, skip the check
    if (nonJapaneseThreadFlag) continue;

    // hide checks - if any of the following is true, hide the tweet
    if (hideNonTweetElement(targetTweet)) {
      hideTweet(targetTweet);
      continue;
    }
    if (hideSpecificAccount(targetTweet)) {
      hideTweet(targetTweet);
      continue;
    }
    if (hideNonJapaneseTweet(targetTweet)) {
      hideTweet(targetTweet);
      continue;
    }
  }
}

// Create a MutationObserver to trigger the script when DOM updates
const observer = new MutationObserver(script);

// Start observing the target node for mutations
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
