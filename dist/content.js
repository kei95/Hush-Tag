"use strict";
// =============== util functions ===============
/** Util function to narrow down element to HTMLElement to help TS to narrow down given element type */
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
// =============== skip flags ===============
// Returns boolean to tell the target tweet should skip the check.
// If true, there's no need for executing logics to check beyond that
function skipIfElementHidden(targetTweet) {
    if (targetTweet.style["display"] === "none")
        return true;
    return false;
}
function skipIfHeaderElement(targetTweet) {
    if (targetTweet.querySelector(`[role="heading"]`))
        return true;
    return false;
}
function skipIfTweetFromOwner(targetTweet) {
    // If the article element's `tabindex` is -1, it means it's an authors tweet
    const replyButtonElement = targetTweet.querySelector(`article[tabindex="-1"]`);
    if (replyButtonElement)
        return true;
    return false;
}
// =============== disable flags ===============
// Returns boolean to tell the target tweet has been hidden by this function.
// If so, there's no need for executing logics to check beyond that
function hideNonTweetElement(targetTweet) {
    // if the given element is just for "show replies" hide it
    const isElementTweet = targetTweet.querySelector("article");
    if (!isElementTweet) {
        targetTweet.style.display = "none";
        return true;
    }
    return false;
}
function isVerifiedAccount(targetTweet) {
    // if the user is verified, hide it
    const isUserVerified = targetTweet.querySelector(`[data-testid="icon-verified"]`);
    if (isUserVerified) {
        return true;
    }
    return false;
}
/** Hide element if the account name doesn't contain Japanese letter AND is verified */
function hideNonJapaneseVerifiedAccount(targetTweet) {
    const accountNameElement = targetTweet.querySelector(`[data-testid="User-Name"]`);
    const isAccountNameContainJapanese = checkIsContainJapanese(accountNameElement === null || accountNameElement === void 0 ? void 0 : accountNameElement.textContent);
    const isAccountVerified = isVerifiedAccount(targetTweet);
    if (!isAccountNameContainJapanese && isAccountVerified) {
        targetTweet.style.display = "none";
        return true;
    }
    return false;
}
function hideNonJapaneseTweet(targetTweet) {
    var _a;
    // get text part of the given target tweet element
    const tweetTextElement = targetTweet.querySelector(`[data-testid="tweetText"]`);
    const isContainJapanese = checkIsContainJapanese((_a = tweetTextElement === null || tweetTextElement === void 0 ? void 0 : tweetTextElement.textContent) !== null && _a !== void 0 ? _a : undefined);
    const isTweetTextContainCharacter = tweetTextElement === null || tweetTextElement === void 0 ? void 0 : tweetTextElement.querySelector("span");
    if (!isTweetTextContainCharacter || !tweetTextElement || !isContainJapanese) {
        targetTweet.style.display = "none";
        return true;
    }
    return false;
}
function script() {
    const isAtRepliesPage = window.location.pathname.includes("status");
    if (!isAtRepliesPage) {
        return;
    }
    const baseElement = document.body.querySelector('[aria-label="Timeline: Conversation"]');
    const targetTweets = baseElement === null || baseElement === void 0 ? void 0 : baseElement.querySelectorAll('[data-testid="cellInnerDiv"]');
    // When mutation happens, iterate through tweets
    if (!targetTweets)
        return;
    for (const targetTweet of targetTweets) {
        // skip checks - if any of the following is true, skip the check
        if (!isHTMLElement(targetTweet))
            continue;
        if (skipIfElementHidden(targetTweet))
            continue;
        if (skipIfHeaderElement(targetTweet))
            continue;
        if (skipIfTweetFromOwner(targetTweet))
            continue;
        // hide checks - if any of the following is true, hide the tweet
        if (hideNonTweetElement(targetTweet))
            continue;
        if (hideNonJapaneseVerifiedAccount(targetTweet))
            continue;
        if (hideNonJapaneseTweet(targetTweet))
            continue;
    }
}
// Create a MutationObserver to trigger the script when DOM updates
const observer = new MutationObserver(script);
// Start observing the target node for mutations
observer.observe(document.body, {
    childList: true,
    subtree: true,
});
