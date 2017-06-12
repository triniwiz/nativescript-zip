
declare class SSZipArchive extends NSObject {

	static alloc(): SSZipArchive; // inherited from NSObject

	static createZipFileAtPathWithContentsOfDirectory(path: string, directoryPath: string): boolean;

	static createZipFileAtPathWithContentsOfDirectoryKeepParentDirectory(path: string, directoryPath: string, keepParentDirectory: boolean): boolean;

	static createZipFileAtPathWithContentsOfDirectoryKeepParentDirectoryWithPassword(path: string, directoryPath: string, keepParentDirectory: boolean, password: string): boolean;

	static createZipFileAtPathWithContentsOfDirectoryKeepParentDirectoryWithPasswordAndProgressHandler(path: string, directoryPath: string, keepParentDirectory: boolean, password: string, progressHandler: (p1: number, p2: number) => void): boolean;

	static createZipFileAtPathWithContentsOfDirectoryWithPassword(path: string, directoryPath: string, password: string): boolean;

	static createZipFileAtPathWithFilesAtPaths(path: string, paths: NSArray<any>): boolean;

	static createZipFileAtPathWithFilesAtPathsWithPassword(path: string, paths: NSArray<any>, password: string): boolean;

	static isFilePasswordProtectedAtPath(path: string): boolean;

	static isPasswordValidForArchiveAtPathPasswordError(path: string, pw: string): boolean;

	static new(): SSZipArchive; // inherited from NSObject

	static unzipFileAtPathToDestination(path: string, destination: string): boolean;

	static unzipFileAtPathToDestinationDelegate(path: string, destination: string, delegate: SSZipArchiveDelegate): boolean;

	static unzipFileAtPathToDestinationOverwritePasswordError(path: string, destination: string, overwrite: boolean, password: string): boolean;

	static unzipFileAtPathToDestinationOverwritePasswordErrorDelegate(path: string, destination: string, overwrite: boolean, password: string, error: interop.Pointer | interop.Reference<NSError>, delegate: SSZipArchiveDelegate): boolean;

	static unzipFileAtPathToDestinationOverwritePasswordProgressHandlerCompletionHandler(path: string, destination: string, overwrite: boolean, password: string, progressHandler: (p1: string, p2: unz_file_info, p3: number, p4: number) => void, completionHandler: (p1: string, p2: boolean, p3: NSError) => void): boolean;

	static unzipFileAtPathToDestinationPreserveAttributesOverwritePasswordErrorDelegate(path: string, destination: string, preserveAttributes: boolean, overwrite: boolean, password: string, error: interop.Pointer | interop.Reference<NSError>, delegate: SSZipArchiveDelegate): boolean;

	static unzipFileAtPathToDestinationProgressHandlerCompletionHandler(path: string, destination: string, progressHandler: (p1: string, p2: unz_file_info, p3: number, p4: number) => void, completionHandler: (p1: string, p2: boolean, p3: NSError) => void): boolean;

	readonly close: boolean;

	readonly open: boolean;

	constructor(o: { path: string; });

	initWithPath(path: string): this;

	writeDataFilenameWithPassword(data: NSData, filename: string, password: string): boolean;

	writeFileAtPathWithFileNameWithPassword(path: string, fileName: string, password: string): boolean;

	writeFileWithPassword(path: string, password: string): boolean;

	writeFolderAtPathWithFolderNameWithPassword(path: string, folderName: string, password: string): boolean;
}

interface SSZipArchiveDelegate extends NSObjectProtocol {

	zipArchiveDidUnzipArchiveAtPathZipInfoUnzippedPath?(path: string, zipInfo: unz_global_info, unzippedPath: string): void;

	zipArchiveDidUnzipArchiveFileEntryPathDestPath?(zipFile: string, entryPath: string, destPath: string): void;

	zipArchiveDidUnzipFileAtIndexTotalFilesArchivePathFileInfo?(fileIndex: number, totalFiles: number, archivePath: string, fileInfo: unz_file_info): void;

	zipArchiveDidUnzipFileAtIndexTotalFilesArchivePathUnzippedFilePath?(fileIndex: number, totalFiles: number, archivePath: string, unzippedFilePath: string): void;

	zipArchiveProgressEventTotal?(loaded: number, total: number): void;

	zipArchiveShouldUnzipFileAtIndexTotalFilesArchivePathFileInfo?(fileIndex: number, totalFiles: number, archivePath: string, fileInfo: unz_file_info): boolean;

	zipArchiveWillUnzipArchiveAtPathZipInfo?(path: string, zipInfo: unz_global_info): void;

	zipArchiveWillUnzipFileAtIndexTotalFilesArchivePathFileInfo?(fileIndex: number, totalFiles: number, archivePath: string, fileInfo: unz_file_info): void;
}
declare var SSZipArchiveDelegate: {

	prototype: SSZipArchiveDelegate;
};

declare var SSZipArchiveVersionNumber: number;

declare var SSZipArchiveVersionString: interop.Reference<number>;

declare var ZipArchiveVersionNumber: number;

declare var ZipArchiveVersionString: interop.Reference<number>;

interface tm_unz {
	tm_sec: number;
	tm_min: number;
	tm_hour: number;
	tm_mday: number;
	tm_mon: number;
	tm_year: number;
}
declare var tm_unz: interop.StructType<tm_unz>;

interface unz_file_info {
	version: number;
	version_needed: number;
	flag: number;
	compression_method: number;
	dosDate: number;
	crc: number;
	compressed_size: number;
	uncompressed_size: number;
	size_filename: number;
	size_file_extra: number;
	size_file_comment: number;
	disk_num_start: number;
	internal_fa: number;
	external_fa: number;
	tmu_date: tm_unz;
}
declare var unz_file_info: interop.StructType<unz_file_info>;

interface unz_file_info64 {
	version: number;
	version_needed: number;
	flag: number;
	compression_method: number;
	dosDate: number;
	crc: number;
	compressed_size: number;
	uncompressed_size: number;
	size_filename: number;
	size_file_extra: number;
	size_file_comment: number;
	disk_num_start: number;
	internal_fa: number;
	external_fa: number;
	tmu_date: tm_unz;
	disk_offset: number;
	size_file_extra_internal: number;
}
declare var unz_file_info64: interop.StructType<unz_file_info64>;

interface unz_global_info {
	number_entry: number;
	number_disk_with_CD: number;
	size_comment: number;
}
declare var unz_global_info: interop.StructType<unz_global_info>;

interface unz_global_info64 {
	number_entry: number;
	number_disk_with_CD: number;
	size_comment: number;
}
declare var unz_global_info64: interop.StructType<unz_global_info64>;
