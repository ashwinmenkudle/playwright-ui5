import { parse, SyntaxError} from "./parser"
import { expect } from "chai"

// interface Error {
//     message:string
// }

describe('Parse UI5 selector', () => {
    it("one property", () => {
        let test = parse(`sap.m.Button[text123="test"]`, {})
        expect({
            compName: "sap.m.Button", props: [{
                name: "text123", value: "test"
            }]
        }).to.deep.equal(test)
    })

    it("one property with spaces", () => {
        let test = parse(`sap.m.Button[  text123    = "test"  ]`, {})
        console.log(test)
        expect({
            compName: "sap.m.Button", props: [{
                name: "text123", value: "test"
            }]
        }).to.deep.equal(test)
    })

    it("Syntax error", () => {
        try {
            parse(`sap.m.Button[  text123    = test"  ]`, {})
        } catch (error) {
            expect(error.message).to.be.equal('Expected ["] but "t" found.');
            expect(error).instanceOf(SyntaxError)
        }
    })

    it("Two properties Error", () => {
        try {
            parse(`sap.m.Button[text123= "test" test = "test"]`, {})
        } catch (error) {
            expect(error).instanceOf(SyntaxError)
            expect(error.message).to.be.equal('Expected [,] or [\\]] but "t" found.');
        }
    })
})