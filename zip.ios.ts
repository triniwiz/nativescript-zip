export class Zip {
  public static zip() { }
  public static unzip(archive: string, destination: string) {
    try {
      SSZipArchive.unzipFileAtPathToDestination(archive, destination);
    } catch (ex) {
      console.log(ex)
    } finally {
      console.log("done")
    }
  }
}