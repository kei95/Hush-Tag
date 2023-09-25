import { checkIsContainJapanese } from "./checkUtils";

// =============== skip flags ===============
// Returns boolean to tell the target tweet should skip the check.
// If true, there's no need for executing logics to check beyond that

/** Util function to narrow down element to HTMLElement to help TS to narrow down given element type */
export function checkIfHTMLElement(
  element: Element | Node | null
): element is HTMLElement {
  return element instanceof HTMLElement;
}

export function skipIfTweetIsHidden(targetTweet: HTMLElement) {
  if (targetTweet.style["display"] === "none") return true;
  return false;
}

export function skipIfTweetFromOwner(targetTweet: HTMLElement) {
  // If the article element's `tabindex` is -1, it means it's an authors tweet
  const firstTweetElement = targetTweet.querySelector(`article[tabindex="-1"]`);

  if (firstTweetElement) return true;

  return false;
}

/** Skip the entire check if the original tweet is not in Japanese to avoid false-positives in non-Japanese environment */
export function skipIfOriginalTweetIsNonJapanese(targetElement: Element) {
  // If the article element's `tabindex` is -1, it means it's an authors tweet
  const firstTweetElement = targetElement.querySelector(
    `article[tabindex="-1"]`
  );

  if (!firstTweetElement) return false; // skip check if it's not tweet owner

  // get text part of the given target tweet element
  const tweetTextElement = targetElement.querySelector(
    `[data-testid="tweetText"]`
  );
  const isContainJapanese = checkIsContainJapanese(
    tweetTextElement?.textContent ?? undefined
  );
  const isTweetTextContainCharacter = tweetTextElement?.querySelector("span");

  return (
    !isTweetTextContainCharacter || !tweetTextElement || !isContainJapanese
  );
}
