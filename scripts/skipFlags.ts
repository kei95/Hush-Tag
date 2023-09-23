// =============== skip flags ===============
// Returns boolean to tell the target tweet should skip the check.
// If true, there's no need for executing logics to check beyond that

/** Util function to narrow down element to HTMLElement to help TS to narrow down given element type */
export function checkIfHTMLElement(
  element: Element | Node | null
): element is HTMLElement {
  return element instanceof HTMLElement;
}

export function skipIfTweetIsHidden(targetTweet: HTMLElement): boolean {
  if (targetTweet.style["display"] === "none") return true;
  return false;
}

export function skipIfTweetFromOwner(targetTweet: HTMLElement): boolean {
  // If the article element's `tabindex` is -1, it means it's an authors tweet
  const replyButtonElement = targetTweet.querySelector(
    `article[tabindex="-1"]`
  );

  if (replyButtonElement) return true;

  return false;
}
