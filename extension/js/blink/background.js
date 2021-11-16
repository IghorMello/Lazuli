//================================================================================
// Execute code in background
//================================================================================

setInterval(notificationDispatcher, notificationDispatcherInterval);
refreshScheduler();

chrome.runtime.onInstalled.addListener(refreshScheduler);
chrome.runtime.onStartup.addListener(refreshScheduler);
chrome.runtime.onMessage.addListener(receiveMessage);
