
function cssSelectorExistsInPage(pageDocument, selector) {
    return pageDocument.querySelector(selector);
}

function pageUrlFilterMatchesPage(page, filter, value) {
    /*
     * checks what pageUrl filter is needed
     * that is done through Regex in order to save a lot of work
     *
     * so basically, we check which value of the page.location 
     * is necessary to be used later on...
     * there are some exceptions such as `schemes`
     *
     * after we specify which page.location value to use
     * (page.location is equivalent to a window.location object)
     * then we check if we are checking for a:
     *          - match / contains
     *          - prefix
     *          - suffix
     *          - equals
     *
     * each of those operations only differ by a regex ^ and/or $
     *      ie. beginning of line and/or end of line
     */

    let pageUrlValue = "";

    switch (filter) {
        case "schemes":
            let pageScheme = window.location.protocol.slice(0, 
                                    window.location.protocol.length - 1);

            return value.indexOf(pageScheme);

        default:
            if (filter.startsWith("host")) {
                pageUrlValue = page.location.hostname;
            } else if (filter.startsWith("path")) {
                pageUrlValue = page.location.pathname;
            } else if (filter.startsWith("url")) {
                pageUrlValue = page.location.href;
            }
    }

    if (pageUrlValue.length == 0) {
        return false;
    }

    let regex = value;
    if (filter.endsWith("Matches") || 
            filter.endsWith("Contains")) {
        // do nothing to regex
    }

    if (filter.endsWith("Prefix") ||
            filter.endsWith("Equals")) {
        regex = "^" + regex;
    }

    if (filter.endsWith("Suffix") ||
            filter.endsWith("Equals")) {
        regex = regex + "$";
    }

    return (new RegExp(regex).exec(pageUrlValue) != null);
}

function conditionMatchesPage(page, condition) {
    /*
     * check if the condition properties all match
     * 
     * condition properties (pageUrl, css, ...) are joined by AND
     * therefore, if one doesn't match, then neither does the condition
     * 
     * therefore, make sure all pageUrlFilters match
     * in addition, make sure all css selectors exist
     */

    for (let filter in condition.pageUrl) {
        if (!pageUrlFilterMatchesPage(page, filter, 
                                        condition.pageUrl[filter])) {
            return false;
        }
    }

    for (let i in condition.css) {
        if (!cssSelectorExistsInPage(page.document, 
                                        condition.css[i])) {
            return false;
        }
    }

    return true;
}

function getMatchingPageRuleCondition(page, rule) {
    /*
     * go over all the conditions in a rule
     * check if one of the conditions for the rule matches
     * if a condition matches, then return its index in the rule
     * so that we can store it later with the rule index in cache
     */

    for (let conditionIndex in rule.conditions) {
        let condition = rule.getCondition(conditionIndex);

        if (conditionMatchesPage(page, condition)) {
            return conditionIndex;
        }
    }

    return -1;
}

function getMatchingPageRule(page) {
    /*
     * go over all the page rules we have currently
     * check if one of the conditions for the rule match
     * if a condition matches, then use that rule (with its files)
     *
     * please note that the conditions for a rule are joined by OR
     * therefore, if one condition matches, then the rule is taken
     *
     * we return the Rule Index, and Condition Index 
     * so that we can store them in cache
     */

    let matchingRule = {
        ruleIndex: -1,
        conditionIndex: -1
    }

    for (let ruleIndex in pageRules) {
        let rule = getRule(ruleIndex);

        let matchingConditionIndex = getMatchingPageRuleCondition(page, rule);
        if (matchingConditionIndex > -1) {
            matchingRule.ruleIndex = ruleIndex;
            matchingRule.conditionIndex = matchingConditionIndex;

            break;
        }
    }

    return matchingRule;
}