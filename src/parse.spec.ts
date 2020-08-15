import { parse, SyntaxError} from "./parser"
import { expect } from "chai"

describe('Parse UI5 selector', () => {
    it("no property", () => {
        let test = parse(`sap.m.Button`, {})
        expect({
            compName: "sap.m.Button", props: []
        }).to.deep.equal(test)
    })

    it("one property", () => {
        let test = parse(`sap.m.Button[text123="test"]`, {})
        expect({
            compName: "sap.m.Button", props: [{
                name: "text123", value: "test"
            }]
        }).to.deep.equal(test)
    })
    it("empty property value", () => {
        let test = parse(`sap.m.Button[icon=""]`, {})
        expect({
            compName: "sap.m.Button", props: [{
                name: "icon", value: ""
            }]
        }).to.deep.equal(test)
    })

    it("two property", () => {
        let test = parse(`sap.m.Button[text123="test", icon="demo.demo"]`, {})
        expect({
            compName: "sap.m.Button", props: [{
                name: "text123", value: "test"
            }, {
                name: "icon", value: "demo.demo"
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
            expect(error.message).to.be.equal("Expected [,] or [\\]] but \"t\" found.");
        }
    })
})