import * as fs from 'file-system';

declare interface TNSAsync {
  async(nativeClass: any, args: any | any[]): Promise<any>;
}

// Undocumented but reliable way to call native iOS APIs asynchronously
// See: https://github.com/NativeScript/NativeScript/issues/1673#issuecomment-190658780
// Note: Seems to only work on device when using native type arguments (like NSString & ZipDelegate)
function doNativeAsync(nativeClass: any, funcRef: any, args: any): Promise<any> {
  return (<TNSAsync>funcRef).async(nativeClass, args);
}
function doOnMainThread(func: any) {
  Promise.resolve().then(() => {
    func();
  });
}

export class TNSZipArchiveDelegate extends NSObject implements SSZipArchiveDelegate {
  
  public static ObjCProtocols = [ SSZipArchiveDelegate ];

  private progressCallback;
  private lastProgressPercent = 0;

  public static initWithProgressCallback(progressCallback: (progressPercent) => void) {
    const self = new TNSZipArchiveDelegate();
    self.progressCallback = progressCallback;
    return self;
  }

	zipArchiveProgressEventTotal(loaded: number, total: number) {
    // console.log(`TNSZipDelegate.progress ${loaded} / ${total}`);
    if (this.progressCallback && total > 0) {
      // Throttle progress callbacks somewhat
      const percent = Math.floor(loaded / total * 100);
      if (percent != this.lastProgressPercent) {
        this.lastProgressPercent = percent;
        doOnMainThread(() => {
          this.progressCallback(percent);
        });
      }
    }
  }
  // zipArchiveDidUnzipArchiveAtPathZipInfoUnzippedPath?(path: string, zipInfo: unz_global_info, unzippedPath: string);
	// zipArchiveDidUnzipArchiveFileEntryPathDestPath(zipFile: string, entryPath: string, destPath: string): void;
	// zipArchiveDidUnzipFileAtIndexTotalFilesArchivePathFileInfo(fileIndex: number, totalFiles: number, archivePath: string, fileInfo: unz_file_info): void;
	// zipArchiveDidUnzipFileAtIndexTotalFilesArchivePathUnzippedFilePath(fileIndex: number, totalFiles: number, archivePath: string, unzippedFilePath: string): void;
	// zipArchiveShouldUnzipFileAtIndexTotalFilesArchivePathFileInfo(fileIndex: number, totalFiles: number, archivePath: string, fileInfo: unz_file_info): boolean;
	// zipArchiveWillUnzipArchiveAtPathZipInfo(path: string, zipInfo: unz_global_info): void;
	// zipArchiveWillUnzipFileAtIndexTotalFilesArchivePathFileInfo(fileIndex: number, totalFiles: number, archivePath: string, fileInfo: unz_file_info): void;
}

export class Zip {

  public static zip() { }

  public static unzipWithProgress(archive: string, destination: string, progressCallback: (progressPercent) => void, overwrite?: boolean, password?: string): Promise<any> {
    return new Promise((resolve, reject) => {

      if (!fs.File.exists(archive)) {
        return reject(`File does not exist, invalid archive path: ${archive}`);
      }

      console.log(`Unzip ${archive} to ${destination}`);
      const archiveNSString = NSString.stringWithString(archive);
      const destinationNSString = NSString.stringWithString(destination);

      try {
        let asyncPromise;
        const zipArchiveDelegate = TNSZipArchiveDelegate.initWithProgressCallback(progressCallback);
        if (SSZipArchive.isFilePasswordProtectedAtPath(archive) && password) {
          asyncPromise = (<any>SSZipArchive.unzipFileAtPathToDestinationOverwritePasswordErrorDelegate).async(SSZipArchive,
            [archiveNSString, destinationNSString, overwrite, password, zipArchiveDelegate]
          );
        } else {
          asyncPromise = (<any>SSZipArchive.unzipFileAtPathToDestinationDelegate).async(SSZipArchive,
            [archiveNSString, destinationNSString, zipArchiveDelegate]
          );
        }
        asyncPromise.then((succeeded) => {
          console.log(`.async result: ${succeeded}`);
          if (succeeded) {
            resolve();
          } else {
            //TODO: retrieve NSError
            reject();
          }
        });
      }
      catch (err) {
        console.log(`Err: ${err}`);
        reject(err);
      }
    });
  }

  public static unzip(archive: string, destination: string, overwrite?: boolean, password?: string) {
    try {
      if (password || overwrite) {
        SSZipArchive.unzipFileAtPathToDestinationOverwritePasswordError(archive, destination, overwrite, password);
      }
      else {
        SSZipArchive.unzipFileAtPathToDestination(archive, destination);
      }
    } catch (ex) {
      console.log(ex)
    } finally {
      console.log("done")
    }
  }
}