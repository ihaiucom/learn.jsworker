var workerconfig = require('./workerconfig');
console.log(workerconfig);
var isMiniGame = workerconfig.IsWxgame;
console.log("isMiniGame", isMiniGame);
console.log("workercod>>  this=", this)
console.log("workercod>>  this.constructor=", this.constructor);
console.log("workercod>>  this.worker=", this.worker);
console.log("workercod>>  worker=", worker);


class MWorker 
{
    static Create(scriptPath, name = "worker") {
        var worker;
        if (isMiniGame) {
            worker = wx.createWorker(scriptPath);
        }
        else {
            worker = new Worker(scriptPath);
        }
        return new MWorker(worker, name);
    }
    constructor(worker, name = "worker") {
        this.worker = worker;
        this.name = name;
    }
  onMessage(callback) {
    console.log(this.name,"=====");
    console.log(this.name, "this=", this);
    console.log(this.name, "this.worker=", this.worker);
    console.log(this.name, "this.worker.onmessage=", this.worker.onmessage);
    console.log(this.name, "this.worker.onMessage=", this.worker.onMessage);
        if (isMiniGame) {

          // this.worker.onmessage = (event) => {
          //   console.log(this.name, "onMessage", event);
          //   //this.postMessage(event);
          // };
          this.worker.onMessage((result) => {
              console.log(this.name, "onMessage", result);
              this.postMessage(result);
            });
        }
        else {
            this.worker.onmessage = (event) => {
              console.log(this.name, "onMessage", event);
              //this.postMessage(event);
            };
        }
    }
    postMessage(data) {
        if (isMiniGame) {
            this.worker.postMessage(data);
        }
        else {
            this.worker.postMessage(data);
        }
    }
    terminate() {
        this.worker.terminate();
    }
}



var CmdType =
{
    Start:"Start",
    TickData : "TickData",
}


var mainWorker = new MWorker(isMiniGame ? worker : this, "WorkerCode");
mainWorker.onMessage((...args)=>
{
    console.log(args);
});




class UnitData {
  constructor() {
    this.id = 0;
    this.x = 0;
    this.y = 0;
    this.speed = 1;
    this.time = 0;
  }
  update(dt) {
    this.time += dt;
    this.x += dt * this.speed;
  }
}

console.log("Hello");