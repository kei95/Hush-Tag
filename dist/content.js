"use strict";
/** Util function to narrow down element to HTMLElement */
function isHTMLElement(element) {
    return element instanceof HTMLElement;
}
function checkIsContainJapanese(inputString) {
    if (!inputString)
        return false;
    // Define a regular expression pattern for Japanese characters
    const japaneseCharacterPattern = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}々〆〤]+/u;
    // Test the input string against the pattern
    return japaneseCharacterPattern.test(inputString);
}
function script(mutationsList, observer) {
    var _a;
    const isAtRepliesPage = window.location.pathname.includes("status");
    if (!isAtRepliesPage) {
        return;
    }
    const userId = window.location.pathname.split("/")[1];
    // Function to be executed when the target element appears
    for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            const targetTweets = document.querySelectorAll('[data-testid="cellInnerDiv"]');
            for (const targetTweet of targetTweets) {
                // if the element isn't HTMLElement, skip it
                if (!isHTMLElement(targetTweet))
                    continue;
                // if the element is hidden already, skip it
                if (targetTweet.style["display"] === "none")
                    continue;
                // if it's tweet owner, don't do anything
                const userNameNode = targetTweet.querySelector(`[data-testid="User-Name"]`);
                const userNameWithId = userNameNode === null || userNameNode === void 0 ? void 0 : userNameNode.textContent;
                if (userNameWithId === null || userNameWithId === void 0 ? void 0 : userNameWithId.includes(userId))
                    continue;
                // if the user is verified, hide it
                const isUserVerified = targetTweet.querySelector(`[data-testid="icon-verified"]`);
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
                const textElement = targetTweet.querySelector(`[data-testid="tweetText"]`);
                // if tweet doesn't contain any Japanese character, hide it
                const isContainJapanese = checkIsContainJapanese((_a = textElement === null || textElement === void 0 ? void 0 : textElement.textContent) !== null && _a !== void 0 ? _a : undefined);
                if (!(textElement === null || textElement === void 0 ? void 0 : textElement.querySelector("span")) ||
                    !textElement ||
                    !isContainJapanese) {
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
