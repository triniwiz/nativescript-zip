import * as fs from 'file-system';

// zip4j docs:
// http://javadox.com/net.lingala.zip4j/zip4j/1.3.1/net/lingala/zip4j
// progress example:
// http://www.lingala.net/zip4j/forum/index.php?topic=68.0
const ProgressMonitor = net.lingala.zip4j.progress.ProgressMonitor;

export class Zip {

    public static ProgressUpdateRate = 100;

    public static zip() {
    }

    public static unzipWithProgress(archive: string, destination: string, progressCallback: (progressPercent) => void, overwrite?: boolean, password?: string): Promise<any> {
        if (!fs.File.exists(archive)) {
            return Promise.reject(`File does not exist, invalid archive path: ${archive}`);
        }
        return new Promise((resolve, reject) => {
            try {
                const zipFile = new net.lingala.zip4j.core.ZipFile(archive);
                zipFile.setRunInThread(true);
                if (zipFile.isEncrypted() && password) {
                    zipFile.setPassword(password);
                }
                zipFile.extractAll(destination);
                const monitor = zipFile.getProgressMonitor();
                const progressInterval = setInterval(() => {
                    if (monitor.getState() === ProgressMonitor.STATE_BUSY) {
                        if (progressCallback) progressCallback(monitor.getPercentDone());
                    } else {
                        // Done working
                        const result = monitor.getResult();
                        if (result === ProgressMonitor.RESULT_SUCCESS) {
                            resolve();
                        } else if (result === ProgressMonitor.RESULT_ERROR) {
                            reject(monitor.getException() ? monitor.getException().getMessage() : 'error');
                        } else {
                            reject('cancelled');
                        }
                        clearInterval(progressInterval);
                    }
                }, Zip.ProgressUpdateRate);
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public static unzip(archive: string, destination: string, overwrite?: boolean, password?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const zipFile = new net.lingala.zip4j.core.ZipFile(archive);
                zipFile.setRunInThread(true);
                if (zipFile.isEncrypted() && password) {
                    zipFile.setPassword(password);
                }
                zipFile.extractAll(destination);
                resolve();
            } catch (ex) {
                reject(ex);
            }
        });
    }
}