import * as observable from 'data/observable';
import * as pages from 'ui/page';
import * as fs from 'file-system';
import { HelloWorldModel } from './main-view-model';

import { Zip } from 'nativescript-zip';

var model: HelloWorldModel;

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    page.bindingContext = model = new HelloWorldModel();
}

export function unzip() {
  console.log(`begin unzip`);
  let appPath = fs.knownFolders.currentApp().path
  let testZipFile = fs.path.join(appPath, 'test.zip');
  // Zip.unzip(testZipFile, appPath);
  Zip.unzipWithProgress(testZipFile, appPath, onZipProgress, true)
    .then(() => {
      console.log(`unzip succesfully completed`);
    })
    .catch((err) => {
      console.log(`unzip error: ${err}`);
    });
}

export function showFiles() {
    traceFolderTree(fs.knownFolders.currentApp(), 1);
}

function onZipProgress(percent: number) {
    console.log(`unzip progress: ${percent}`);
    model.progress = percent;
    model.notifyPropertyChange('progress', percent);
}

function traceFolderTree(folder: fs.Folder, maxDepth: number = 3, depth: number = 0) {
  let whitespace = new Array(depth + 1).join('  ');
  console.log(`${whitespace}${fs.Folder.fromPath(folder.path).name}`);
  folder.eachEntity((ent) => {
    if (fs.Folder.exists(ent.path) && depth < maxDepth) {
      traceFolderTree(fs.Folder.fromPath(ent.path), maxDepth, depth + 1);
    } else {
      console.log(`${whitespace}- ${ent.name}`);
    }
    return true;
  });
}