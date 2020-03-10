import { parse } from "./parser"
import { expect } from "chai"

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
})