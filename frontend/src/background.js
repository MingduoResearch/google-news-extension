// Keep track of the current article being read
var currentArticle = null;

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "trackArticle") {
    // The user clicked on a news article, let's track it
    currentArticle = { url: message.url, startTime: new Date() };
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    currentArticle &&
    tabId === tab.id &&
    changeInfo.status === "complete" &&
    tab.url === currentArticle.url
  ) {
    // The user finished loading the article, let's track their reading progress
    var endTime = new Date();
    var readingTime = endTime - currentArticle.startTime;
    // You can do something with the reading time here, like send it to an analytics service
    console.log(
      "User spent " + readingTime + " ms reading " + currentArticle.url
    );
    // Reset the current article
    currentArticle = null;
  }
});