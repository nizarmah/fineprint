# fineprint
Chrome Extension for Improving Printed Version of Popular Online Websites

### How to Use

1. Just install the extension from the [chrome web store](https://chrome.google.com/webstore/detail/fine-print/haplmldmmjboafjpelboplllnofkhcaj)
2. Print whenever you feel like it ( :

> The extension automatically inserts CSS print media type on page load if the page is supported by the extension or not.

### Supported Websites

- medium websites (_includes medium articles on domains that aren't medium.com._)

> ##### [Want us to support a website that is not listed ? Click Here](https://github.com/nizarmah/fineprint/issues/new?assignees=&labels=website+request&template=new-website-support-request.md&title=)

---

> ##### [Check the dev.to blog post about the approach](https://dev.to/nizarmah_/hacking-my-way-to-automatic-file-injection-in-chrome-extensions-5big)
>
> ##### The approach taken to code this is into more detail in comments describing important functions. 
> ###### If the extension ends up getting a bunch of installs or requests for new websites to be supported, I will be adding a Wiki page to explain the rules and conditions. For now, refer to the [`chrome.declarativeContent.PageStateMatcher` chrome developers api](https://developer.chrome.com/extensions/declarativeContent#type-PageStateMatcher). It is almost identical to the `Rule` and `Condition` objects.
