import { selectors, Page } from "playwright"
import { parse } from "./parser";

declare global {
    const sap: any
    const jQuery: any
}

declare interface CompProperty {
    name: string,
    value: string
}

declare interface Selection {
    compName: string
    props: Array<CompProperty>
}

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

function selectionHandler(selection: Selection): Promise<Element> {
    return new Promise<Element>((resolve, reject) => {
        sap.ui.require(["sap/base/util/ObjectPath"], function (ObjectPath) {
            // debugger
            jQuery("[data-sap-ui]").each(function () {
                if (!!this.id) {
                    let control = sap.ui.getCore().byId(this.id);
                    if (control instanceof ObjectPath.get(selection.compName)) {
                        if (!!selection.props && selection.props.length == 0) {
                            resolve(this);
                            return false;
                        }
                        var propsMatch = true;
                        for (var i = 0; i < selection.props.length; i++) {
                            var value = control.getProperty(selection.props[0].name);
                            if (String(value) !== String(selection.props[0].value)) {
                                propsMatch = false;
                            }
                        }
                        if (propsMatch) {
                            resolve(this);
                            return false;
                        }
                    }
                }
            });
        });

    });
}

export async function click(page: Page, selector: string) {
    try {
        var selection: Selection = parse(selector, {})
        let control = await page.evaluateHandle(selectionHandler, selection);
        await control.click()
    } catch (error) {
        console.error("UI5 selector syntax is incorrect : " + error)
    }
}

export async function isPresent(page: Page, selector: string) {
    try {
        var selection: Selection = parse(selector, {})
        let control = await page.evaluateHandle(selectionHandler, selection);
        return !!control;
    } catch (error) {
        console.error("UI5 selector syntax is incorrect : " + error)
    }
}

