import * as fs from 'file-system';

declare interface TNSAsync {
  async(nativeClass: any, args: any | any[]): Promise<any>;
}

// Undocumented but reliable way to call native iOS APIs asynchronously
// See: https://github.com/NativeScript/NativeScript/issues/1673#issuecomment-190658780
function doNativeAsync(nativeClass: any, funcRef: any, args: any): Promise<any> {
  return (<TNSAsync>funcRef).async(nativeClass, args);
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

      let lastProgressPercent: number;
      const progressHandler = (entry: string, zipFileInfo: any, entryNumber: number, entriesTotal: number) => {
        // console.log(`progressHandler: entry=${entry},entryNumber=${entryNumber},total=${total}`);
        if (progressCallback && entriesTotal > 0) {
          // Throttle progress callbacks somewhat
          const percent = Math.floor(entryNumber / entriesTotal * 100);
          if (percent != lastProgressPercent) {
            lastProgressPercent = percent;
            doOnMainThread(() => {
              progressCallback(percent);
            });
          }
        }
      };

      const completionHandler = (path: string, succeeded: boolean, err: NSError) => {
        // console.log(`completionHandler: path=${path},succeeded=${succeeded},err=${err}`);

        doOnMainThread(() => {
          if (succeeded) {
              resolve(path);
          } else {
              reject(err ? err.debugDescription : 'error');
          }
        });
      };

      if (SSZipArchive.isFilePasswordProtectedAtPath(archive) && password) {
        doNativeAsync(SSZipArchive, SSZipArchive.unzipFileAtPathToDestinationOverwritePasswordProgressHandlerCompletionHandler,
          [archive, destination, overwrite, password, progressHandler, completionHandler]
        );
      } else {
        doNativeAsync(SSZipArchive, SSZipArchive.unzipFileAtPathToDestinationProgressHandlerCompletionHandler,
          [archive, destination, progressHandler, completionHandler]
        );
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