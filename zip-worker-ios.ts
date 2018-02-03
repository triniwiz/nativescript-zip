declare var onmessage: any;
declare var onerror: any;
declare function postMessage(msg: any);
declare function close();
declare const Math;
var lastProgressPercent;
var debugEnabled = true;

debug(`ZipWorker.Init`);

onmessage = (msg) => {
  var request = msg.data;
  if (request.action === 'unzip') {
    unzipRequest(request);
  }
}

onerror = (err) => {
  debug(`ZipWorker.Error: ${err}`);
  postMessage({ result: false, err });
  close();
}

function unzipRequest(request: ZipRequest) {
  var archivePath = request.archive;
  var destinationPath = request.destination;
  var overwrite = request.overwrite || true;
  var password = request.password || null;

  debug(`ZipWorker.unzip - archive=${archivePath}`);

  const result = SSZipArchive.unzipFileAtPathToDestinationOverwritePasswordProgressHandlerCompletionHandler(
    archivePath, destinationPath, overwrite, password, onUnzipProgress, onUnzipCompletion
  );
}

function onUnzipProgress(entry, zipFileInfo, entryNumber, entriesTotal) {
  if (entriesTotal > 0) {
    const percent = Math.floor(entryNumber / entriesTotal * 100);
    if (percent != lastProgressPercent) {
      lastProgressPercent = percent;
      postMessage({ progress: percent });
    }
  }
}

function onUnzipCompletion(path, succeeded, err) {
  if (succeeded) {
    postMessage({ result: true });
  } else {
    postMessage({ result: false, err: err ? err.localizedDescription : 'Unknown error' });
  }
  close();
}

function debug(arg) {
  if (debugEnabled && console && console.log) {
    console.log(arg);
  }
}
function zipRequest(request) {
  var folderPath = request.folder;
  var destinationPath = request.destination;
  var keepParent = request.keepParent || true;
  var password = request.password || null;
  debug(
    'ZipWorker.zip - folder=' +
      folderPath +
      '\n' +
      'ZipWorker.zip - destinationPath=' +
      destinationPath
  );
  var fs = require('file-system');
  var temp = fs.knownFolders.temp();
  var tempDestinationPath = temp.getFile('archive.zip');
  debug('ZipWorker.zip - tempFolder= ' + tempDestinationPath.path);
  var result = SSZipArchive.createZipFileAtPathWithContentsOfDirectoryKeepParentDirectoryCompressionLevelPasswordAESProgressHandler(
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
    postMessage({ result: false, err: 'Error creating zip file.' });
    close();
  } else {
    var sourceFile = fs.File.fromPath(tempDestinationPath.path);
    var destinationFile = fs.File.fromPath(destinationPath);

    var source = sourceFile.readSync(function(error) {
      postMessage({ result: false, err: 'Error creating zip file.' });
      temp.clear().then(
        function() {
          close();
        },
        function(error) {
          close();
        }
      );
    });
    destinationFile.writeSync(source, function(error) {
      postMessage({ result: false, err: 'Error creating zip file.' });
      temp.clear().then(
        function() {
          close();
        },
        function(error) {
          close();
        }
      );
    });
    postMessage({ result: true });
    temp.clear().then(
      function() {
        close();
      },
      function(error) {
        close();
      }
    );
  }
}
function onZipProgress(entryNumber, entriesTotal) {
  if (entriesTotal > 0) {
    var percent = Math.floor(entryNumber / entriesTotal * 100);
    debug('ZipWorker.zip - zipProgress= ' + percent);
    if (percent != lastProgressPercent) {
      lastProgressPercent = percent;
      postMessage({ progress: percent });
    }
  }
}
