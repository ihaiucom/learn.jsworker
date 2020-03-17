if(this.require)
{
    require('./WorkerConfig.js');
    require('./MWorker.js');
    require('./workercode.js');
}
else if(this.importScripts)
{
    importScripts('./WorkerConfig.js');
    importScripts('./MWorker.js');
    importScripts('./workercode.js');
}