declare class MWorker  
{
    static Create(scriptPath: string, name?: string) :MWorker;
    onMessage(callback: (data:any)=>{})
    postMessage(message: any, transfer?: any[]): void;
    terminate(): void;
}