[![npm](https://img.shields.io/npm/v/nativescript-zip.svg)](https://www.npmjs.com/package/nativescript-zip)
[![npm](https://img.shields.io/npm/dt/nativescript-zip.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-zip)
[![Build Status](https://travis-ci.org/triniwiz/nativescript-zip.svg?branch=master)](https://travis-ci.org/triniwiz/nativescript-zip)

# NativeScript Zip

## Installation

#### NativeScript 4x

* `tns plugin add nativescript-zip`


#### NativeScript 2x & 3x

* `tns plugin add nativescript-zip@2.0.4`


## Usage

### Zip

```ts
import { Zip } from "nativescript-zip";
import * as fs from "file-system";
let path = fs.path.join(fs.knownFolders.temp().path, "stuff");
let dest = fs.path.join(fs.knownFolders.currentApp().path, "/assets");
Zip.zip(path,dest);
```

#### Progress

```ts
import { Zip } from "nativescript-zip";
import * as fs from "file-system";
let path = fs.path.join(fs.knownFolders.temp().path, "stuff");
let dest = fs.path.join(fs.knownFolders.currentApp().path, "/assets");
Zip.zipWithProgress(path,dest,onZipProgress);

function onZipProgress(percent: number) {
    console.log(`unzip progress: ${percent}`);
}
```

### Unzip

```ts
import { Zip } from "nativescript-zip";
import * as fs from "file-system";
let zipPath = fs.path.join(fs.knownFolders.temp().path, "stuff.zip");
let dest = fs.path.join(fs.knownFolders.currentApp().path, "/assets");
Zip.unzip(zipPath,dest);
```

#### Progress

```ts
import { Zip } from "nativescript-zip";
import * as fs from "file-system";
let zipPath = fs.path.join(fs.knownFolders.temp().path, "stuff.zip");
let dest = fs.path.join(fs.knownFolders.currentApp().path, "/assets");
Zip.unzipWithProgress(zipPath,dest,onZipProgress);

function onZipProgress(percent: number) {
    console.log(`unzip progress: ${percent}`);
}
```

# TODO

* [x] Compress method
* [x] Progress
