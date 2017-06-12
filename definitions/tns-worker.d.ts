declare interface WorkerError {
  message: string;
  filename: string;
  lineno: number;
}

declare class Worker {
  constructor(path: string);
  postMessage(msg: any);
  onmessage: (msg: any) => void;
  onerror: (err: WorkerError) => void;
}