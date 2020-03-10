import { selectors, Page } from "playwright"
import { parse } from "./parser";

// Register the engine. Selectors will be prefixed with "tag=".
export async function register() {
    const engineString = `
    options = options || {};
    const name = options.name || 'tag';
    return {
        name: name,
        create(root, target) {
            //debugger
            return root.querySelector(target.tagName) === target ? target.tagName : undefined;
        },
        query(root, selector) {
            //console.log(jQuery)
            // debugger
            //return jQuery("[data-sap-ui]").get(0);
            return root.querySelector(selector);
        },
        queryAll(root, selector) {
            //debugger
            return Array.from(root.querySelectorAll(selector));
        }
    }`
    const selectorEngine = new Function("options", engineString)
    await selectors.register(selectorEngine, { name: 'tag' });
}

export async function click(page: Page) {
    let string = "demo"

    const regex = /([a-zA-Z\.]+)(?:\[([a-zA-Z0-9]+)\=\"(.+)\"\]?)*/gm;
    const selector = `sap.m.Button[text123="test"]`;
    let m;
// ([a-zA-Z\.]+)(\[([a-zA-Z0-9]+)\=\"([^\"]+)\"\])*
    while ((m = regex.exec(selector)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            console.log(`Found match, group ${groupIndex}: ${match}`);
        });
    }

    let control = await page.evaluateHandle((selector) => {
        let p = new Promise<Element>((resolve, reject) => {
            if (!!jQuery("[data-sap-ui]").get(0)) {
                resolve(jQuery("[data-sap-ui]").get(0));
                debugger
                console.log(string);
            }
            reject()
        });
        return p
    }, "sap.m.Button[text='test']");
    await control.click()
}

