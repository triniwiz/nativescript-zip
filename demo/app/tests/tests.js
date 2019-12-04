const Zip = require('nativescript-zip').Zip;
const fs = require('tns-core-modules/file-system');
const testData = 'Testing testing 123';
const testPath = function () {
	return fs.path.join(fs.knownFolders.documents().path, 'zip_test');
};
const testFile = `${Date.now()}.txt`;
let output;
describe('Zip functions', function () {
	it('creates a file then add file to zip', async function () {
		try {
			const testFilePath = fs.path.join(testPath(), testFile);
			await fs.File.fromPath(testFilePath).writeText(testData);
			const archive = await Zip.zip({
				directory: testPath(),
			});

			output = archive;
			expect(archive).toBeDefined();
			expect(fs.File.exists(archive)).toBe(true);
			expect(fs.File.fromPath(archive).size).toBeGreaterThan(0);
		} catch (error) {
			fail(error);
		}
	});

	it('extract zip then reads file created earlier', async function () {
		try {
			expect(output).toBeDefined();
			const path = await Zip.unzip({
				archive: output
			});
			expect(path).toBeDefined();
			expect(fs.Folder.exists(path)).toBe(true);
			const file = fs.path.join(path, 'zip_test', testFile);
			const text = await fs.File.fromPath(file).readText();
			expect(text).toEqual(testData);
		} catch (error) {
			fail(error);
		}
	});

});
