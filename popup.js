var bg = chrome.extension.getBackgroundPage();

var opt = {
  type: "basic",
  title: "Primary Title",
  message: "Primary message to display",
  iconUrl: "url_to_small_icon"
}

// INIT //

/*
* Determine current tab and initialize list
*/
chrome.tabs.query({active: true}, function(tab) { 
  bg.currentTab = tab[0];

  showList(); 
});

if(bg.options.addNewTabs) 
  document.getElementById('chk-add-new').checked = true;

if(bg.options.switchTabs) 
  document.getElementById('chk-switch-tabs').checked = true;

/*
* Run through the array of watched tabs and add them to the list
*/
function showList() {
  bg.updateBadge(bg.currentTab.id);
  document.getElementById('watchedTabs').innerHTML = '';

  if(bg.listHasTab(bg.currentTab.id)) 
    document.getElementById('add').style.display = 'none';
  else
    document.getElementById('add').style.display = 'block';

  var list = '';

  for(var i=0; i<bg.watchedTabs.length; i++) {
    var title = bg.watchedTabs[i].title;
    var id = bg.watchedTabs[i].id;

    if(title.length == 0)
      title = '(no title)'

    if(title.length > 45)
      title = title.substring(0, 45) + '...';

    if(id == bg.currentTab.id)
      title = '<b>' + title + '</b>';

    var delItem = document.createElement('span');
    delItem.className = 'delete-item';
    delItem.innerHTML = 'delete';
    delItem.setAttribute('tab-id', id);

    delItem.onclick = function() { 
      var tabId = this.getAttribute('tab-id');
      bg.removeTab(tabId);
      showList();
    }

    var item = document.createElement('div');
    item.className = 'tab';
    item.innerHTML = title;
    item.setAttribute('tab-id', id);
    item.appendChild(delItem);

    item.onclick = function() { 
      var tabId = this.getAttribute('tab-id');

      if(bg.listHasTab(tabId))
        bg.switchToTab(tabId);
    }

    document.getElementById('watchedTabs').appendChild(item);
  }

  if(bg.watchedTabs.length == 0)
    document.getElementById('watchedTabs').innerHTML += '<i>No items in your list.</i>';
}

function addCurrentTab() {
	chrome.tabs.query({active: true}, function(tab) {
		var currentTab = tab[0];	
    bg.watchedTabs.push(currentTab);

    showList();
	});
}

function addAllOpenTabs() {
  bg.watchedTabs = [];

  chrome.tabs.query({}, function(tab) {
    for(var i=0; i<tab.length; i++) 
      bg.watchedTabs.push(tab[i]);

    showList();
  });
}

function deleteList() {
  bg.watchedTabs = [];

  showList();
}


document.getElementById('add').addEventListener('click', addCurrentTab);
document.getElementById('version').innerHTML = 'v' + chrome.app.getDetails().version;
document.getElementById('delete').addEventListener('click', deleteList);
document.getElementById('add-all').addEventListener('click', addAllOpenTabs);
document.getElementById('get-the-code').addEventListener('click', function() { chrome.tabs.create({url: 'https://github.com/luckyluki/TabWatcher' }); });
document.getElementById('chk-add-new').onclick = function() {
    // access properties using this keyword
    if ( this.checked ) {
      bg.options.addNewTabs = true;
    } else {
      bg.options.addNewTabs = false;
    }
};
document.getElementById('chk-switch-tabs').onclick = function() {
    // access properties using this keyword
    if ( this.checked ) {
      bg.options.switchTabs = true;
    } else {
      bg.options.switchTabs = false;
    }
};
// chrome.app.getDetails().version