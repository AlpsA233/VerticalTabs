let isFullscreen = false;

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({windowId: tab.windowId}).then(() => {
    if (!isFullscreen) {
      chrome.windows.update(tab.windowId, {state: "fullscreen"});
      isFullscreen = true;
    } else {
      chrome.windows.update(tab.windowId, {state: "normal"});
      isFullscreen = false;
    }
  });
});

chrome.windows.onRemoved.addListener((windowId) => {
  isFullscreen = false;
});