// Background script

console.log("hello")
// Function to read the current HTML page
function readCurrentPage(tabId) {
  chrome.tabs.get(tabId, function (tab) {
    if (tab && tab.url && tab.status === 'complete') {
      // Fetch the HTML content of the current page
      chrome.tabs.sendMessage(tabId, { action: 'readPage' }, function (response) {
        if (response && response.html) {
          // Handle the HTML content
          console.log(response.html);
        }
      });
    }
  });
}
// Event listener for browser startup
chrome.runtime.onStartup.addListener(function () {
  chrome.tabs.query({}, function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      readCurrentPage(tabs[i].id);
    }
  });
});

// Event listener for browser action click
chrome.browserAction.onClicked.addListener(function (tab) {
  readCurrentPage(tab.id);
});

// Event listener for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    readCurrentPage(tabId);
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Check if the page has finished loading
  if (changeInfo.status === 'complete') {
    // Execute your logic here
    console.log('Page loaded:', tab.url);
  }
});