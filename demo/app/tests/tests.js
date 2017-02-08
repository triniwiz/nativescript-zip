var Zip = require("nativescript-zip").Zip;
var zip = new Zip();

// TODO replace 'functionname' with an acual function name of your plugin class and run with 'npm test <platform>'
describe("functionname", function() {
  it("exists", function() {
    expect(zip.functionname).toBeDefined();
  });

  it("returns a promise", function() {
    expect(zip.functionname()).toEqual(jasmine.any(Promise));
  });
});