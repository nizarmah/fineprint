
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