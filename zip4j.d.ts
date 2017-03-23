declare namespace  net.lingala.zip4j {

  namespace core {

    export class ZipFile {
      constructor(archivePath: string);
      extractAll(destinationPath: string): void;
      getProgressMonitor(): progress.ProgressMonitor;
      isEncrypted(): boolean;
      setPassword(password: string): void;
      setRunInThread(runInThread: boolean);
    }

  }

  namespace progress {

    export class ProgressMonitor {
      static RESULT_CANCELLED: number;
      static RESULT_ERROR: number;
      static RESULT_SUCCESS: number;
      static STATE_BUSY: number;
      static STATE_READY: number;
      getException(): any;
      getPercentDone(): number;
      getResult(): number;
      getState(): number;
    }

  }

}