import * as fs from 'file-system';

// Undocumented but reliable way to call native iOS APIs asynchronously
// See: https://github.com/NativeScript/NativeScript/issues/1673#issuecomment-190658780
// Note: Type marshalling does not seem to work with .async, need to create native args (like NSString & ZipDelegate).
declare interface TNSAsync {
  async(nativeClass: any, args: any | any[]): Promise<any>;
}
function doOnMainThread(func: any) {
  Promise.resolve().then(() => {
    func();
  });
}

export class Zip {

  public static zip() { }

  public static unzipWithProgress(archive: string, destination: string, progressCallback: (progressPercent) => void, overwrite?: boolean, password?: string): Promise<any> {
    return new Promise((resolve, reject) => {

      if (!fs.File.exists(archive)) {
        return reject(`File does not exist, invalid archive path: ${archive}`);
      }

      overwrite = overwrite !== undefined ? overwrite : true;
      const archiveNSString = NSString.stringWithString(archive);
      const destinationNSString = NSString.stringWithString(destination);
      const passwordNSString = password !== undefined ? NSString.stringWithString(password) : null;

      try {
        const nsErr = NSError.alloc().initWithDomainCodeUserInfo('TNSZip', 1, null);
        const zipArchiveDelegate = TNSZipArchiveDelegate.initWithProgressCallback(progressCallback);

        (<TNSAsync><any>SSZipArchive.unzipFileAtPathToDestinationOverwritePasswordErrorDelegate).async(SSZipArchive,
          [archiveNSString, destinationNSString, overwrite, passwordNSString, nsErr, zipArchiveDelegate]
        ).then((succeeded) => {
          if (succeeded) {
            resolve();
          } else {
            reject(nsErr.localizedDescription);
          }
        });
      }
      catch (err) {
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


export class TNSZipArchiveDelegate extends NSObject implements SSZipArchiveDelegate {

  public static ObjCProtocols = [SSZipArchiveDelegate];

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