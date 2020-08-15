import { selectors, Page } from "playwright"
import { readFile } from "fs";
import { join } from "path";

declare global {
    const sap: any
    const jQuery: any
    interface Window { ObjectPath: any; ui5:any; }
}

declare interface CompProperty {
    name: string,
    value: string
}

declare interface Selection {
    compName: string
    props: Array<CompProperty>
}

function scriptLoaderHandler(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        sap.ui.require(["sap/base/util/ObjectPath"], function (ObjectPath) {
            window.ObjectPath = ObjectPath;
            resolve();
        });
    });
}

export async function waitForUI5Ready(page: Page) {
    let script = await new Promise<string>((resolve) => {
        let filePath = join(__dirname, "selector.js")
        readFile(filePath, (err, data) => {
            resolve(data.toString())
        })
    })
    await page.evaluate(script)
    await page.evaluateHandle(scriptLoaderHandler);
}

// Register the engine. Selectors will be prefixed with "tag=".
export async function register() {
    // Must be a function that evaluates to a selector engine instance.
    const ui5SelectorEngine = () => ({
        // Creates a selector that matches given target when queried at the root.
        // Can return undefined if unable to create one.
        create(root, target) {
            return root.querySelector(target.tagName) === target ? target.tagName : undefined;
        },

        // Returns the first element matching given selector in the root's subtree.
        query(root, selector) {
            selector = window.ui5.parse(selector)
            var element;
            jQuery("[data-sap-ui]").each(function () {
                if (!!this.id) {
                    let control = sap.ui.getCore().byId(this.id);
                    if (control instanceof window.ObjectPath.get(selector.compName)) {
                        if (!!selector.props && selector.props.length == 0) {
                            element = this
                            return false;
                        }
                        var propsMatch = true;
                        for (var i = 0; i < selector.props.length; i++) {
                            var value = control.getProperty(selector.props[0].name);
                            if (String(value) !== String(selector.props[0].value)) {
                                propsMatch = false;
                            }
                        }
                        if (propsMatch) {
                            element = this
                            return false;
                        }
                    }
                }
            });
            return element;
        },

        // Returns all elements matching given selector in the root's subtree.
        queryAll(root, selector) {
            var elements = [];
            jQuery("[data-sap-ui]").each(function () {
                if (!!this.id) {
                    let control = sap.ui.getCore().byId(this.id);
                    if (control.getMetadata()._sClassName === selector) {
                        elements.push(control.$()[0]);
                    }
                }
            });
            return elements;
        }
    });
    await selectors.register('ui5', ui5SelectorEngine);
}
