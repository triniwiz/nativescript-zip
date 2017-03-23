// require('globals'); // necessary to bootstrap tns modules on the new thread

declare var onmessage: any;
declare var onerror: any;
declare function postMessage(msg: any);
declare function close();

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
  postMessage({ result: false });
  close();
}

function unzipRequest(request) {
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
    postMessage({ result: false, err: err ? err.localizedDescription : 'error' });
  }
  close();
}

function debug(arg) {
  if (debugEnabled && console && console.log) {
    console.log(arg);
  }
}