import * as fs from 'file-system';

export class Zip {

    public static zip() {
    }

    public static unzipWithProgress(archive: string, destination: string, progressCallback: (progressPercent) => void, overwrite?: boolean, password?: string): Promise<any> {
        return new Promise((resolve, reject) => {

            if (!fs.File.exists(archive)) {
                return reject(`File does not exist, invalid archive path: ${archive}`);
            }

            var worker = new Worker('./zip-worker-ios');
            worker.postMessage(<ZipRequest>{ action: 'unzip', archive, destination, overwrite, password });
            worker.onmessage = (msg) => {
                // console.log(`Received worker callback: ${JSON.stringify(msg)}`);
                if (msg.data.progress != undefined) {
                    progressCallback(msg.data.progress);
                } else if (msg.data.result != undefined) {
                    if (msg.data.result) {
                        resolve();
                    } else {
                        reject(msg.data.err);
                    }
                } else {
                    reject('zip-worker-ios failed');
                }
            };
            worker.onerror = (err) => {
                console.log(`An unhandled error occurred in worker: ${err.filename}, line: ${err.lineno}`);
                reject(err.message);
            };
        });
    }

    public static unzip(archive: string, destination: string, overwrite?: boolean, password?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                if (password || overwrite) {
                    SSZipArchive.unzipFileAtPathToDestinationOverwritePasswordError(archive, destination, overwrite, password);
                }
                else {
                    SSZipArchive.unzipFileAtPathToDestination(archive, destination);
                }
                resolve()
            } catch (ex) {
                reject(ex)
            }
        });
    }
}