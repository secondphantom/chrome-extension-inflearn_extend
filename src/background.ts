chrome.tabs.onUpdated.addListener((...args) => {
  const [tabId, changeInfo, tab] = args;
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("inflearn.com")
  ) {
    chrome.tabs.sendMessage(tabId, {
      url: tab.url,
    });
  }
});
