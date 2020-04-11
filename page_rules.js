
var pageRules = [
    new Rule({
        conditions: [
            new Condition({
                css: [
                    "a[href^='https://medium.com/'][aria-label='Homepage']"
                ]
            })
        ],
        cssFiles: [
            "medium.com.css"
        ]
    })
];

function Condition(condition) {
    if (condition.pageUrl) {
        this.pageUrl = condition.pageUrl || {};
    }

    if (condition.css) {
        this.css = condition.css || [];
    }
}

function Rule(rule) {
    this.conditions = rule.conditions || [];

    this.getCondition = function (index) {
        return this.conditions[index];
    };

    this.cssFiles = rule.cssFiles || [];

    this.getCssFiles = function () {
        return this.cssFiles;
    };
}

function getRule(ruleIndex) {
    return pageRules[ruleIndex];
}