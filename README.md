# NativeScript Zip

## Installation
`tns plugin add nativescript-zip`

## Usage

```ts
import {Zip} from "nativescript-zip";
import * fs from "file-system";
let zipPath = fs.path.join(fs.knownFolders.temp().path, "stuff.zip");
let dest = fs.path.join(fs.knownFolders.currentApp().path, "/assets");
Zip.unzip(zipPath,dest);
```
### Progress
```ts
import {Zip} from "nativescript-zip";
import * fs from "file-system";
let zipPath = fs.path.join(fs.knownFolders.temp().path, "stuff.zip");
let dest = fs.path.join(fs.knownFolders.currentApp().path, "/assets");
Zip.unzipWithProgress(zipPath,dest,onZipProgress);

function onZipProgress(percent: number) {
    console.log(`unzip progress: ${percent}`);
}
```


# TODO
- [ ] Compress method
- [x] Progress
