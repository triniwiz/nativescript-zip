let lastProgressPercent;
let debugEnabled = true;

debug(`ZipWorker.Init`);

(<any>global).onmessage = msg => {
    const request = msg.data;
    if (request.action === 'zip') {
        zipRequest(request);
    } else if (request.action === 'unzip') {
        unzipRequest(request);
    }
};

(<any>global).onerror = err => {
    debug(`ZipWorker.Error: ${err}`);
    (<any>global).postMessage({result: false, err});
    close();
};

function unzipRequest(request: ZipRequest) {
    const archivePath = request.archive;
    const destinationPath = request.destination;
    const overwrite = request.overwrite || true;
    const password = request.password || null;

    debug(`ZipWorker.unzip - archive=${archivePath}`);

    const result = SSZipArchive.unzipFileAtPathToDestinationOverwritePasswordProgressHandlerCompletionHandler(
        archivePath,
        destinationPath,
        overwrite,
        password,
        onUnzipProgress,
        onUnzipCompletion
    );
}

function onUnzipProgress(entry, zipFileInfo, entryNumber, entriesTotal) {
    if (entriesTotal > 0) {
        const percent = Math.floor(entryNumber / entriesTotal * 100);
        if (percent !== lastProgressPercent) {
            lastProgressPercent = percent;
            (<any>global).postMessage({progress: percent});
        }
    }
}

function onUnzipCompletion(path, succeeded, err) {
    if (succeeded) {
        (<any>global).postMessage({result: true});
    } else {
        (<any>global).postMessage({
            result: false,
            err: err ? err.localizedDescription : 'Unknown error'
        });
    }
    close();
}

function debug(arg) {
    if (debugEnabled && console && console.log) {
        console.log(arg);
    }
}

function zipRequest(request) {
    const folderPath = request.folder;
    const destinationPath = request.destination;
    const keepParent = request.keepParent || true;
    const password = request.password || null;
    debug(
        'ZipWorker.zip - folder=' +
        folderPath +
        '\n' +
        'ZipWorker.zip - destinationPath=' +
        destinationPath
    );
    const fs = require('file-system');
    const temp = fs.knownFolders.temp();
    const tempDestinationPath = temp.getFile('archive.zip');
    debug('ZipWorker.zip - tempFolder= ' + tempDestinationPath.path);
    const result = SSZipArchive.createZipFileAtPathWithContentsOfDirectoryKeepParentDirectoryCompressionLevelPasswordAESProgressHandler(
        tempDestinationPath.path,
        folderPath,
        keepParent,
        -1,
        password,
        true,
        onZipProgress
    );
    debug('ZipWorker.zip - after create in temp folder with result=' + result);
    if (!result) {
        (<any>global).postMessage({
            result: false,
            err: 'Error creating zip file.'
        });
        close();
    } else {
        const sourceFile = fs.File.fromPath(tempDestinationPath.path);
        const destinationFile = fs.File.fromPath(destinationPath);

        const source = sourceFile.readSync(function (error) {
            (<any>global).postMessage({
                result: false,
                err: 'Error creating zip file.'
            });
            temp.clear().then(
                function () {
                    close();
                },
                function (error) {
                    close();
                }
            );
        });
        destinationFile.writeSync(source, function (error) {
            (<any>global).postMessage({
                result: false,
                err: 'Error creating zip file.'
            });
            temp.clear().then(
                function () {
                    close();
                },
                function (error) {
                    close();
                }
            );
        });
        (<any>global).postMessage({result: true});
        temp.clear().then(
            function () {
                close();
            },
            function (error) {
                close();
            }
        );
    }
}

function onZipProgress(entryNumber, entriesTotal) {
    if (entriesTotal > 0) {
        const percent = Math.floor(entryNumber / entriesTotal * 100);
        debug('ZipWorker.zip - zipProgress= ' + percent);
        if (percent !== lastProgressPercent) {
            lastProgressPercent = percent;
            (<any>global).postMessage({progress: percent});
        }
    }
}
