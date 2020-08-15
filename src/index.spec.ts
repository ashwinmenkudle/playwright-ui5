import { chromium, ChromiumBrowser, Page } from "playwright";
import { expect } from "chai"
import { Server } from 'node-static';
import * as http from "http"
import { register, waitForUI5Ready } from ".";

// jest.setTimeout(150000)
describe('Select UI5 component by property', () => {
    let server: http.Server
    let page: Page
    let browser: ChromiumBrowser

    beforeAll( async () => {
        var file = new Server('./fixtures');
        server = http.createServer(function (request, response) {
            request.addListener('end', function () {
                file.serve(request, response);
            }).resume();
        }).listen(8080);
        await register()
      });

    beforeEach(async () => {
        // browser = await chromium.launch({ headless: false, devtools: true })
        browser = await chromium.launch()
        let context = await browser.newContext()
        page = await context.newPage();
    })

    test('select by one propery', async () => {
        await page.goto('http://localhost:8080/property-select/index.html');
        await waitForUI5Ready(page)
        let button = await page.$('ui5=sap.m.Button[text="Test"]')
        expect(button).to.be.a("object")

        await page.click('ui5=sap.m.Button[text="Test"]')

        let dialog = await page.$('ui5=sap.m.Dialog[title="Test"]')
        expect(dialog).to.be.a("object")
        let buttons = await page.$$('ui5=sap.m.Button');
        expect(buttons).length(1)
    });

    test('select by component', async () => {
        await page.goto('http://localhost:8080/property-select/index.html');
        await waitForUI5Ready(page)
        await page.click('ui5=sap.m.Button')
        let dialog = await page.$('ui5=sap.m.Dialog[title="Test"]')
        expect(dialog).to.be.a("object")
    });
    
    afterEach(async () => {
        await browser.close()
    })
    
    afterAll(async () => {
        return new Promise((resolve)=>{
            server.close(() => {
                console.log('Test http server closed');
                resolve()
            })
        })
    });
});
