import { chromium } from "playwright";
import { expect } from "chai"
import { Server } from 'node-static';
import * as http from "http"
import { register, click, isPresent } from ".";


describe('First test', () => {
    let server: http.Server
    beforeEach(() => {
        var file = new Server('./fixtures');
        server = http.createServer(function (request, response) {
            request.addListener('end', function () {
                file.serve(request, response);
            }).resume();
        }).listen(8080);
    })

    it('should return true', async () => {
        await register()
        const browser = await chromium.launch({ headless: false, devtools: true })
        let context = await browser.newContext()
        const page = await context.newPage();
        await page.goto('http://localhost:8080/property-select/index.html');

        await click(page, 'sap.m.Button[text="Test"]')
        await isPresent(page, 'sap.m.Dialog[title="Test"]')

        let button = await page.$('tag=button');
        expect(button).to.be.a("object")

        browser.close()
    });

    afterEach(() => {
        server.close(() => {
            console.log('We closed!');
        })
    })
});
