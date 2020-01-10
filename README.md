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

```typescript
import { Zip } from "nativescript-zip";
import * as fs from "tns-core-modules/file-system";
let path = fs.path.join(fs.knownFolders.temp().path, "stuff");
let dest = fs.path.join(fs.knownFolders.documents().path, "/assets");
Zip.zip({
    folder: path,
    directory: dest
});
```

#### Progress

```typescript
import { Zip } from "nativescript-zip";
import * as fs from "tns-core-modules/file-system";
let path = fs.path.join(fs.knownFolders.temp().path, "stuff");
let dest = fs.path.join(fs.knownFolders.documents().path, "/assets");
Zip.zip({
    folder: path,
    directory: dest,
    onProgress: onZipProgress
});

function onZipProgress(percent: number) {
    console.log(`unzip progress: ${percent}`);
}
```

### Unzip

```typescript
import { Zip } from "nativescript-zip";
import * as fs from "tns-core-modules/file-system";
let zipPath = fs.path.join(fs.knownFolders.temp().path, "stuff.zip");
let dest = fs.path.join(fs.knownFolders.documents().path, "/assets");
Zip.unzip({
    archive: zipPath,
    directory: dest
});
```

#### Progress

```typescript
import { Zip } from "nativescript-zip";
import * as fs from "tns-core-modules/file-system";
let zipPath = fs.path.join(fs.knownFolders.temp().path, "stuff.zip");
let dest = fs.path.join(fs.knownFolders.documennts().path, "/assets");
Zip.unzip({
    archive: zipPath,
    directory: dest,
    onProgress: onUnZipProgress
});

function onUnZipProgress(percent: number) {
    console.log(`unzip progress: ${percent}`);
}
```

# TODO

* [x] Compress method
* [x] Progress
