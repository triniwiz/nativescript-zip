export class Zip {

  public static zip() { }

  public static unzipWithProgress(archive: string, destination: string, progressCallback: (progressPercent) => void, overwrite?: boolean, password?: string): Promise<any> {
    let lastProgressPercent: number;
    return new Promise((resolve, reject) => {
      const progressHandler = (entry: string, zipFileInfo: any, entryNumber: number, total: number) => {
        // console.log(`progressHandler: entry=${entry},entryNumber=${entryNumber},total=${total}`);
        if (progressCallback && total > 0) {
          // Throttle progress callbacks to client somewhat
          const percent = entryNumber / total * 100;
          if (!lastProgressPercent || percent - lastProgressPercent >= 1) {
            lastProgressPercent = percent;
            progressCallback(Math.floor(percent));
          }
        }
      };
      const completionHandler = (path: string, succeeded: boolean, err: NSError) => {
        // console.log(`completionHandler: path=${path},succeeded=${succeeded},err=${err}`);
        if (succeeded) {
          resolve();
        } else {
          reject(err ? err.debugDescription : 'error');
        }
      };
      if (SSZipArchive.isFilePasswordProtectedAtPath(archive) && password) {
        SSZipArchive.unzipFileAtPathToDestinationOverwritePasswordProgressHandlerCompletionHandler(
          archive, destination, overwrite, password, progressHandler, completionHandler
        );
      } else {
        SSZipArchive.unzipFileAtPathToDestinationProgressHandlerCompletionHandler(
          archive, destination, progressHandler, completionHandler
        )
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