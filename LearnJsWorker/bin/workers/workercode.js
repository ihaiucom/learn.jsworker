


var CmdType =
{
    Start:"Start",
    TickData : "TickData",
}


var mainWorker = new MWorker(this, "WorkerCode");
mainWorker.onMessage((...args)=>
{
    console.log("workercode onMessage >>", args);
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