declare const net;
export class Zip {
    public static zip() {
    }
    public static unzip(archive: string, destination: string, overwrite?: boolean, password?: string) {
        try {
            const zipFile = new net.lingala.zip4j.core.ZipFile(archive);
            zipFile.setRunInThread(true);
            if (zipFile.isEncrypted() && password) {
                zipFile.setPassword(password);
            }
            zipFile.extractAll(destination);
        } catch (ex) {
            console.log(ex);
        } finally {
            console.log("done")
        }
    }
}