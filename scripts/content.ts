// =============== util functions ===============
/** Util function to narrow down element to HTMLElement */
function isHTMLElement(element: Element): element is HTMLElement {
  return element instanceof HTMLElement;
}

function checkIsContainJapanese(inputString?: string | null) {
  if (!inputString) return false;

  // Define a regular expression pattern for Japanese characters
  const japaneseCharacterPattern =
    /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}々〆〤]+/u;

  // Test the input string against the pattern
  return japaneseCharacterPattern.test(inputString);
}

// =============== skip flags ===============
// Returns boolean to tell the target tweet should skip the check.
// If true, there's no need for executing logics to check beyond that

function skipIfElementHidden(targetTweet: HTMLElement): boolean {
  if (targetTweet.style["display"] === "none") return true;
  return false;
}

function skipIfHeaderElement(targetTweet: HTMLElement): boolean {
  if (targetTweet.querySelector(`[role="heading"]`)) return true;
  return false;
}

function skipIfTweetFromOwner(
  targetTweet: HTMLElement,
  userId: string
): boolean {
  const userNameNode = targetTweet.querySelector(`[data-testid="User-Name"]`);
  const userNameWithId = userNameNode?.textContent;
  if (userNameWithId?.includes(userId)) return true;

  return false;
}

// =============== disable flags ===============
// Returns boolean to tell the target tweet has been hidden by this function.
// If so, there's no need for executing logics to check beyond that

function hideNonTweetElement(targetTweet: HTMLElement): boolean {
  // if the given element is just for "show replies" hide it
  const isElementTweet = targetTweet.querySelector("article");
  if (!isElementTweet) {
    targetTweet.style.display = "none";
    return true;
  }

  return false;
}

function hideVerifiedAccount(targetTweet: HTMLElement): boolean {
  // if the user is verified, hide it
  const isUserVerified = targetTweet.querySelector(
    `[data-testid="icon-verified"]`
  );

  if (isUserVerified) {
    targetTweet.style.display = "none";
    return true;
  }

  return false;
}

function hideNonJapaneseAccount(targetTweet: HTMLElement): boolean {
  const accountNameElement = targetTweet.querySelector(`[dir="ltr"]`);
  const isAccountNameContainJapanese = checkIsContainJapanese(
    accountNameElement?.textContent
  );

  if (!isAccountNameContainJapanese) {
    targetTweet.style.display = "none";
    return true;
  }

  return false;
}

function hideNonJapaneseTweet(targetTweet: HTMLElement): boolean {
  // get text part of the given target tweet element
  const tweetTextElement = targetTweet.querySelector(
    `[data-testid="tweetText"]`
  );
  const isContainJapanese = checkIsContainJapanese(
    tweetTextElement?.textContent ?? undefined
  );
  const isTweetTextContainCharacter = tweetTextElement?.querySelector("span");

  if (!isTweetTextContainCharacter || !tweetTextElement || !isContainJapanese) {
    targetTweet.style.display = "none";
    return true;
  }

  return false;
}

function script(mutationsList: MutationRecord[], observer: MutationObserver) {
  const isAtRepliesPage = window.location.pathname.includes("status");
  if (!isAtRepliesPage) {
    return;
  }

  const userId = window.location.pathname.split("/")[1];

  // When mutation happens, iterate through tweets
  for (const mutation of mutationsList) {
    if (mutation.type !== "childList" || mutation.addedNodes.length === 0)
      return;
    const targetTweets = document.querySelectorAll(
      '[data-testid="cellInnerDiv"]'
    );

    for (const targetTweet of targetTweets) {
      // skip checks - if any of the following is true, skip the check
      if (!isHTMLElement(targetTweet)) continue;
      if (skipIfElementHidden(targetTweet)) continue;
      if (skipIfHeaderElement(targetTweet)) continue;
      if (skipIfTweetFromOwner(targetTweet, userId)) continue;

      // hide checks - if any of the following is true, hide the tweet
      if (hideNonJapaneseAccount(targetTweet)) continue;
      if (hideNonTweetElement(targetTweet)) continue;
      if (hideNonJapaneseTweet(targetTweet)) continue;
    }
  }
}

// Create a MutationObserver to trigger the script when DOM updates
const observer = new MutationObserver(script);

// Specify the target node and the type of mutations to observe
const targetNode = document.body;

// Start observing the target node for mutations
observer.observe(targetNode, { childList: true, subtree: true });
