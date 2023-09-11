/** Util function to narrow down element to HTMLElement */
function isHTMLElement(element: Element): element is HTMLElement {
  return element instanceof HTMLElement;
}

function checkIsContainJapanese(inputString?: string) {
  if (!inputString) return false;

  // Define a regular expression pattern for Japanese characters
  const japaneseCharacterPattern =
    /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}々〆〤]+/u;

  // Test the input string against the pattern
  return japaneseCharacterPattern.test(inputString);
}

function script(mutationsList: MutationRecord[], observer: MutationObserver) {
  const isAtRepliesPage = window.location.pathname.includes("status");
  if (!isAtRepliesPage) {
    return;
  }

  const userId = window.location.pathname.split("/")[1];

  // Function to be executed when the target element appears
  for (const mutation of mutationsList) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      const targetTweets = document.querySelectorAll(
        '[data-testid="cellInnerDiv"]'
      );

      for (const targetTweet of targetTweets) {
        // if the element isn't HTMLElement, skip it
        if (!isHTMLElement(targetTweet)) continue;
        // if the element is hidden already, skip it
        if (targetTweet.style["display"] === "none") continue;

        // if it's tweet owner, don't do anything
        const userNameNode = targetTweet.querySelector(
          `[data-testid="User-Name"]`
        );
        const userNameWithId = userNameNode?.textContent;
        if (userNameWithId?.includes(userId)) continue;

        // if the user is verified, hide it
        const isUserVerified = targetTweet.querySelector(
          `[data-testid="icon-verified"]`
        );
        if (isUserVerified) {
          targetTweet.style.display = "none";
          continue;
        }

        // if the node is just for "show replies" hide it
        const isElementTweet = targetTweet.querySelector("article");
        if (!isElementTweet) {
          targetTweet.style.display = "none";
          continue;
        }

        // if tweet only contains emoji, hide it
        const textElement = targetTweet.querySelector(
          `[data-testid="tweetText"]`
        );
        // if tweet doesn't contain any Japanese character, hide it
        const isContainJapanese = checkIsContainJapanese(
          textElement?.textContent ?? undefined
        );
        if (
          !textElement?.querySelector("span") ||
          !textElement ||
          !isContainJapanese
        ) {
          targetTweet.style.display = "none";
          continue;
        }
      }
    }
  }
}

// Create a MutationObserver with the elementAppearedCallback function
const observer = new MutationObserver(script);

// Specify the target node and the type of mutations to observe
const targetNode = document.body;

// Start observing the target node for mutations
observer.observe(targetNode, { childList: true, subtree: true });
