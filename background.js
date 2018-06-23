var currentWindowsIds = [];
var currentFocusedWindowId;

function init() {
	chrome.windows.getAll(function (windows) {
		currentWindowsIds = windows.map(win => win.id);
	});

	chrome.windows.getCurrent(function (window) {
		if (window.focused) {
			currentFocusedWindowId = window;
		}
		else {
			console.log("Couldn't locate initial focused window.");
		}
	})
}

function setCurrentFocusedWindowId() {
	chrome.windows.getCurrent(function (window) { currentFocusedWindowId = window.id });
}

function getNextFocusedWindowId() {
	const currentFocusPos = currentWindowsIds.indexOf(currentFocusedWindowId);
	const nextWindowPos = (currentFocusPos+1)%currentWindowsIds.length;
	const nextWindowId = currentWindowsIds[nextWindowPos];
	return nextWindowId;
}

function onClicked() {
	const focusWinId = getNextFocusedWindowId();
	if (focusWinId === undefined) {
		console.log("There is no current focused window.");
		return;
	}

	chrome.windows.update(focusWinId, { focused: true }, function (window) {
		if (window.focused == true) {
			currentFocusedWindowId = window.id;
		}
	});
}

chrome.windows.onRemoved.addListener(init);
chrome.windows.onCreated.addListener(init);
chrome.windows.onFocusChanged.addListener(setCurrentFocusedWindowId);
chrome.browserAction.onClicked.addListener(onClicked);

init();