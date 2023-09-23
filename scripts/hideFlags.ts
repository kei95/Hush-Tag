// =============== disable flags ===============
// Returns boolean to tell the target tweet has been hidden by this function.
// If so, there's no need for executing logics to check beyond that

/** Util function to tell if the account is verified */
function checkIsVerifiedAccount(targetTweet: HTMLElement): boolean {
  // if the user is verified, hide it
  const isUserVerified = targetTweet.querySelector(
    `[data-testid="icon-verified"]`
  );

  if (isUserVerified) {
    return true;
  }

  return false;
}

/** Util function to tell if the given string contain Japanese */
function checkIsContainJapanese(inputString?: string | null) {
  if (!inputString) return false;

  // Define a regular expression pattern for Japanese characters
  // Excluded Kanji check as only kanji sentence = Non-Japanese
  const japaneseCharacterPattern = /[\p{Script=Hiragana}\p{Script=Katakana}]+/u;

  // Test the input string against the pattern
  return japaneseCharacterPattern.test(inputString);
}

/** Util function to detect given input string mentions NFT */
function checkIsMentionNFT(inputString?: string | null) {
  if (!inputString) return false;

  const nftWord = /NFT/i;

  return nftWord.test(inputString);
}

/** Hide if tweet doesn't contain text - such as "read more" */
export function hideNonTweetElement(targetTweet: HTMLElement): boolean {
  // if the given element is just for "show replies" hide it
  const isElementTweet = targetTweet.querySelector("article");
  if (!isElementTweet) {
    return true;
  }

  return false;
}

/** Hide element if the account name doesn't contain Japanese letter AND is verified */
export function hideSpecificAccount(targetTweet: HTMLElement): boolean {
  // Skip the check if the element doesn't contain the tweet author id and name
  const accountNameElement = targetTweet.querySelector(
    `[data-testid="User-Name"]`
  );
  if (!accountNameElement) return false;

  // case 1 - hide if the word "NFT" is included
  const isAccountMentionsNFT = checkIsMentionNFT(
    accountNameElement?.textContent
  );

  if (isAccountMentionsNFT) {
    return true;
  }

  // case 2 - hide if the account is non-japanese and verified
  const isAccountVerified = checkIsVerifiedAccount(targetTweet); // if not verified, skip the check
  if (!isAccountVerified) return false;

  const isAccountNameContainJapanese = checkIsContainJapanese(
    accountNameElement?.textContent
  );

  if (!isAccountNameContainJapanese) {
    return true;
  }

  return false;
}

export function hideNonJapaneseTweet(targetTweet: HTMLElement): boolean {
  // get text part of the given target tweet element
  const tweetTextElement = targetTweet.querySelector(
    `[data-testid="tweetText"]`
  );
  const isContainJapanese = checkIsContainJapanese(
    tweetTextElement?.textContent ?? undefined
  );
  const isTweetTextContainCharacter = tweetTextElement?.querySelector("span");

  if (!isTweetTextContainCharacter || !tweetTextElement || !isContainJapanese) {
    return true;
  }

  return false;
}
