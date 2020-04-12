
var page_rules = [
    {
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                css: [
                    "meta[property='og:site_name'][content='Medium']"
                ]
            })
        ],
        actions: [
            new chrome.declarativeContent.RequestContentScript({
                css: [
                    "css/medium.com.css"
                ]
            }),
            new chrome.declarativeContent.ShowPageAction()
        ]
    }
];

chrome.runtime.onInstalled.addListener((details) => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules(page_rules);
    });
});
