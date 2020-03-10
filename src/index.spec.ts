import { chromium } from "playwright";
import { expect } from "chai"
import { Server } from 'node-static';
import * as http from "http"
import { register, click } from ".";

declare global {
    const jQuery: any
}

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

        // Use the selector prefixed with its name.
        // let button = await page.evaluateHandle(() => {
        //     let p = new Promise<Element>((resolve, reject) => {
        //         if (!!jQuery("[data-sap-ui]").get(0)) {
        //             resolve(jQuery("[data-sap-ui]").get(0));
        //             // debugger
        //         }
        //         reject()
        //     });
        //     return p
        // });
        // let button = await page.$('tag=button');
        // await button.click()
        
        click(page)

        let button = await page.$('tag=button');
        // const button = await page.$('.sapMBtn');
        expect(button).to.be.a("object")

        browser.close()
    });

    afterEach(() => {
        server.close(() => {
            console.log('We closed!');
        })
    })
});
