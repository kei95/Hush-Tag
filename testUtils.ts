/** Util function to retrieve tweet from testing DOM */
export function getTweet(): HTMLElement {
  return document.body.querySelector(
    '[data-testid="cellInnerDiv"]'
  ) as HTMLElement;
}

/** Util function that sets given stringified tweet HTML element on the testing DOM */
export function setTweet(
  tweetElement: `<div data-testid="cellInnerDiv${string}`
) {
  document.body.innerHTML = tweetElement;
}
