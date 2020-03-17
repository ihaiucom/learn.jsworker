

var IsWxgame = WorkerConfig.IsWxgame;
class MWorker 
{
    static Create(scriptPath, name = "worker") 
    {
        var worker;
        if (IsWxgame) 
        {
            worker = wx.createWorker(scriptPath);
        }
        else 
        {
            worker = new Worker(scriptPath);
        }
        return new MWorker(worker, name);
    }

    constructor(worker, name = "worker") 
    {
        this.worker = worker;
        this.name = name;
    }

    onMessage(callback) 
    {
        if (IsWxgame) 
        {
            this.worker.onMessage(callback);
        }
        else 
        {
            this.worker.onmessage = (event) => 
            {
                callback(event.data);
            };
        }
    }

    postMessage(data) 
    {
        if (IsWxgame) 
        {
            this.worker.postMessage(data);
        }
        else
        {
            this.worker.postMessage(data);
        }
    }

    terminate() 
    {
        this.worker.terminate();
    }
}


this.MWorker = MWorker;
var module = this.module | {};
module.exports = MWorker;
