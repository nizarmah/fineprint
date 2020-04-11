
function parsePageDocument(pageDocument) {
    /*
     * in order to be able to pass the document as
     * a message it had to be converted to a string
     * therefore, we have to inject it into an HTML
     * element in order to querySelect later on
     * 
     * please note that image srcs result in an error
     * (net::ERR_FILE_NOT_FOUND), therefore, we had to
     * remove the src of the image to prevent that error
     */

    let container = document.createElement("div");

    // remove all SRCs from Images to avoid net::ERR_FILE_NOT_FOUND
    pageDocument = pageDocument.replace(
                        new RegExp("(src=|xlink:href=).[^\'\"]*.", "g"), "");
    container.innerHTML = pageDocument;

    return container;
}

/*
 * cache stores:
 *      tabId : {
 *                  ruleIndex: Rule Object Index in Rules,
 *                  conditionIndex: Condition Object Index in Rule 
 *              }
 * 
 * we store the rule index, and condition index in order to 
 * update the rule, condition, and css files in case the extension
 * receives an update.
 *
 * now you might think that the index might change for either 
 * the rule or the condition; however, that's alright, because
 * the condition wouldn't be valid anyway, so it'll check for a new one
 *
 * this helps us load the css faster
 * instead of rechecking which rule and condition fits best
 * we already know the last matched rule and condition and that way
 * we just go ahead and test that condition if it is valid, or not
 */
let cache = {}

function getCache(tabId) {
    return cache[tabId];
}

function cacheData(tabId, data) {
    cache[tabId] = data;
}

function deleteCache(tabId) {
    delete cache[tabId];
}

function deleteCacheIfExists(tabId) {
    delete cache[tabId];
}

function cacheExists(tabId, callback) {
    let exists = (getCache(tabId) != undefined);

    if (callback) {
        callback(exists, getCache(tabId));
    } else {
        return exists;
    }
}

function cacheValid(tabId, page) {
    /*
     * checks if the condition stored still matches page or not
     */

    let cachedCondition = getRule(getCache(tabId).ruleIndex)
                            .getCondition(getCache(tabId).conditionIndex);

    return conditionMatchesPage(page, cachedCondition);
}

function cacheExistsAndValid(tabId, page) {
    return (cacheExists(tabId) && cacheValid(tabId, page));
}

chrome.runtime.onMessage.addListener((page, sender, sendResponse) => {
    /*
     * we are using Content_Script on all pages, to communicate
     * the page source (to check if element exists in the page)
     * and which css files need to be injected in that page
     * because it requires no permissions whatsoever to inject those files 
     *
     * meanwhile `activeTab` requires permission in order to inject:
     *      - JS  : to check if the CSS selector exists in the page
     *      - CSS : to inject the Fine Print media css 
     * 
     * in addition, `declarativeContent` contains an experimental method
     * which is not available on Stable Builds in order to inject files
     *
     * ------------------------------------------------------------------------
     *
     * check Branch `declarativeContent.RequestContentScript`
     * 
     * this approach was the prettiest, therefore, we wanted to recreate it
     * manually... so to avoid using any permissions we used Messaging
     * 
     * ------------------------------------------------------------------------
     * 
     * messaging process :
     *          1. page sends its:
     *                  - window.location
     *                  - string document
     *          2. extension receives those
     *             extension then parses the string document to HTML element
     *          3. extension then checks its rules for match in:
     *                  - page url (host | path | url | scheme | ...)
     *                  - css selectors for existing elements
     */

    page.document = parsePageDocument(page.document);
    
    let tabId = sender.tab.id;

    if (!cacheExists(tabId) || !cacheValid(tabId, page)) {
        /*
         * if no cache for this tabId exists
         * or if the available cache isn't valid anymore
         *      ie. condition matched when cached, doesn't match anymore
         *
         * then find a new rule and condition that match
         */

        let matchingRule = getMatchingPageRule(page);

        if (matchingRule.ruleIndex > -1 &&
                matchingRule.conditionIndex > -1) {
            cacheData(tabId, matchingRule);
        } else {
            /*
             * if no rule and condition match this tabId anymore,
             * then clear it from cache, because it is useless now
             */

            deleteCacheIfExists(tabId);
        }
    }

    cacheExists(tabId, (exists, cacheData) => {
        let response = {}

        if (exists) {
            response["origin"] = window.location.origin;
            response["cssFiles"] = getRule(cacheData.ruleIndex).getCssFiles();
        }

        sendResponse(response);
    });
});