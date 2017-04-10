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

# TODO
* Compress method
* Progress
