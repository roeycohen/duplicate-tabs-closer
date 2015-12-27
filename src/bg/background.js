//https://developer.chrome.com/extensions/tabs
chrome.tabs.onCreated.addListener(update_count_badge);
chrome.tabs.onUpdated.addListener(update_count_badge);
chrome.tabs.onRemoved.addListener(update_count_badge);

function update_count_badge()
{
	chrome.tabs.query({}, function(tabs) {
		var urls = [];
		var duplicate_count = 0;
		for (var i in tabs)
		{
			var tab = tabs[i];
			if (urls.indexOf(tab.url) >= 0)
				duplicate_count++;
			else
				urls.push(tab.url);
		}
		if (duplicate_count > 0)
			chrome.browserAction.setBadgeText({text: '' + duplicate_count});
		else
			chrome.browserAction.setBadgeText({text: ''});
	} );
}

chrome.browserAction.onClicked.addListener(function(tab)
{
	chrome.tabs.query({}, function(tabs) {
		var urls = [];
		var tabs_to_remove = [];
		for (var i in tabs)
		{
			var tab = tabs[i];
			if (urls.indexOf(tab.url) >= 0)
				tabs_to_remove.push(tab.id)
			else
				urls.push(tab.url);
		}

		chrome.tabs.remove(tabs_to_remove);
		chrome.browserAction.setBadgeText({text: ''});

		var opt = {
			type: "basic",
			title: "Duplicate tabs remover",
			message: tabs_to_remove.length + " tabs were closes.",
			iconUrl: "../../icons/icon128.png"
		}

		chrome.notifications.create(null, opt);
	} );
});