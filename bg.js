/*
* bg.js
*
* This file contains the background logic of TabWatcher.
*/

var watchedTabs = []; /* The watchlist which contains the observed tabs */
var currentTab; /* The tab that is currently active */

/* 
* The user can choose the following options:
*
* addNewTabs = Add every newly created tab to the watchlist
* switchTabs = When a tab on the watchlist finished loading, immediately switch to it
*/
var options = {
  'addNewTabs': false,
  'switchTabs': false
}

/*
* The look of the notification box 
*/
var notificationOptions = {
  type: "basic",
  title: "Tab has finished loading!",
  message: "",
  iconUrl: "icon.png"
}

/*
* FUNCTIONS
*/ 

/* 
* Check if a tab is part of the watchlist
*/
function listHasTab(id) {
  for(var i=0; i<watchedTabs.length; i++) {
    if(watchedTabs[i].id == id) return true;
  }

  return false;
}

/*
* Remove tab from the watchlist
*/
function removeTab(id) {
	watchedTabs.splice(watchedTabs.indexOf(id), 1);
  // popup();
}

/*
* Change focus on another tab
*/
function switchToTab(id) {
	chrome.tabs.update(parseInt(id), {highlighted: true});
}

/*
* Add a badge with an exaclamation mark to the icon if the current tab is on the watchlist
*/
function updateBadge(id) {
  if(listHasTab(id))
    chrome.browserAction.setBadgeText({text: "!"});
  else
    chrome.browserAction.setBadgeText({text: ""});
}

function popup() {
  chrome.windows.create({
      type: 'popup',
      url: "https://www.google.de/"
  }, function (newWindow) {
      console.log(newWindow);
      chrome.tabs.executeScript(newWindow.tabs[0].id, {
          code: 'document.write("hello world");'
      });
  });
}

/*
* EVENTS
*/

/*
* If a tab status is updated (either completed or loading) check for the status 'completed'
*/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   if(listHasTab(tabId)) {

      if(changeInfo.status == 'complete') {
      	notificationOptions.message = tab.title;
      	chrome.notifications.create('', notificationOptions, function(notificationId) {});

      if(options.switchTabs)      
         switchToTab(tabId);
      }
   } 
}); 

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  if(listHasTab(tabId)) {
  	removeTab(tabId);	
  }
});

chrome.tabs.onCreated.addListener(function(tab) {
  if(options.addNewTabs) {
    watchedTabs.push(tab);
  }
});

chrome.notifications.onClicked.addListener(function(notificationId) {
  alert(notificationId);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  updateBadge(activeInfo.tabId); 
}); 

chrome.commands.onCommand.addListener(function(command) {
  if(command == 'add-tab') {
       /* ??? */
  }
});