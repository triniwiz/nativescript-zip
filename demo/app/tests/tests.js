var Zip = require('nativescript-zip').Zip;
var fs = require('tns-core-modules/file-system');
var testData = 'Testing testing 123';
var testPath = function () {
	return fs.path.join(fs.knownFolders.documents().path, 'zip_test');
};
var testFile = `${Date.now()}.txt`;
var output;
describe('Zip functions', function () {
	it('creates a file then add file to zip', function () {
		const testFilePath = fs.path.join(testPath(), testFile);
		fs.File.fromPath(testFilePath).writeTextSync(testData, function (error) {
			fail(error);
		});
		return Zip.zip({
			directory: testPath(),
		})
			.then(function (archive) {
				output = archive;
				expect(archive).toBeDefined();
				expect(fs.File.exists(archive)).toBe(true);
				expect(fs.File.fromPath(archive).size).toBeGreaterThan(0);
			}).catch(function (error) {
				fail(error);
			});
	});

	it('extract zip then reads file created earlier', function () {
		expect(output).toBeDefined();
		return Zip.unzip({
			archive: output
		})
			.then(function (path) {
				expect(path).toBeDefined();
				expect(fs.Folder.exists(path)).toBe(true);
				var file = fs.path.join(path, 'zip_test', testFile);
				var text = fs.File.fromPath(file).readTextSync(function (error) {
					fail(error);
				});
				expect(text).toEqual(testData);
			}).catch(function (error) {
				fail(error);
			})
	});

});
