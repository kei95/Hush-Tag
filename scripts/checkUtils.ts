/** Util function to tell if the account is verified */
export function checkIsVerifiedAccount(targetTweet: HTMLElement): boolean {
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
export function checkIsContainJapanese(inputString?: string | null) {
  if (!inputString) return false;

  // Define a regular expression pattern for Japanese characters
  // Excluded Kanji check as only kanji sentence = Non-Japanese
  const japaneseCharacterPattern = /[\p{Script=Hiragana}\p{Script=Katakana}]+/u;

  // Test the input string against the pattern
  return japaneseCharacterPattern.test(inputString);
}

/** Util function to detect given input string mentions NFT */
export function checkIsMentionNFT(inputString?: string | null) {
  if (!inputString) return false;

  const nftWord = /NFT/i;

  return nftWord.test(inputString);
}
