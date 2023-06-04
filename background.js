console.log("hello")

chrome.console.log("hey")

chrome.tabs.onUpdated.addListener(function(tabId, tab){
    if (tab){
        console.log(tabId);
    }
});

const script = document.createElement('script');
script.src = chrome.runtime.getURL('background.js');
document.documentElement.appendChild(script);
script.remove();
// Background script


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

// Event listener for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    readCurrentPage(tabId);
  }
});

// Event listener for browser action click
chrome.browserAction.onClicked.addListener(function (tab) {
  readCurrentPage(tab.id);
});

// Event listener for extension installation or update
chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.query({}, function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      readCurrentPage(tabs[i].id);
    }
  });
});
  