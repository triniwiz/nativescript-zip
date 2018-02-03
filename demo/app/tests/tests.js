var Zip = require("nativescript-zip").Zip;
var zip = new Zip();

describe("greet function", function() {
    it("exists", function() {
        expect(zip.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(zip.greet()).toEqual("Hello, NS");
    });
});