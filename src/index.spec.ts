import { chromium, ChromiumBrowser, Page } from "playwright";
import { expect } from "chai"
import { Server } from 'node-static';
import * as http from "http"
import { register, click, isPresent } from ".";


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
        // const browser = await chromium.launch({ headless: false, devtools: true })
        browser = await chromium.launch()
        let context = await browser.newContext()
        page = await context.newPage();
    })

    test('select by one propery', async () => {
        await page.goto('http://localhost:8080/property-select/index.html');

        await click(page, 'sap.m.Button[text="Test"]')
        await isPresent(page, 'sap.m.Dialog[title="Test"]')

        let button = await page.$('tag=button');
        expect(button).to.be.a("object")
    });

    test('select by component', async () => {
        await page.goto('http://localhost:8080/property-select/index.html');

        await click(page, 'sap.m.Button')
        await isPresent(page, 'sap.m.Dialog[title="Test"]')

        let button = await page.$('tag=button');
        expect(button).to.be.a("object")
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
