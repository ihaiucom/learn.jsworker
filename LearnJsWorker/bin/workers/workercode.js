


var CmdType =
{
    Start:"Start",
    TickData : "TickData",
}


var mainWorker = new MWorker(this.worker ? this.worker : this, "WorkerCode");
mainWorker.onMessage((msg)=>
{
    switch(msg.cmd)
    {
        case CmdType.Start:
            console.log(Date.now(), "workercode onMessage >>", msg);
            mainWorker.postMessage(msg);
            lastT = Date.now();
            setInterval(update, 16);
            break;
    }
});



class UnitData {
    constructor() {
        this.id = 0;
        this.x = 0;
        this.y = 0;
        this.speed = 0.01;
        this.time = 0;
    }
    update(dt) {
        this.time += dt;
        this.x += dt * this.speed;
        if(this.x > 5 || this.x < -5)
        {
            this.speed *= -1;
        }
    }
}

var unitList = [];
for(var i = 0; i < 2000; i ++)
{
    var item = new UnitData();
    item.id = i;
    unitList.push(item);
}

var unit = unitList[0]
unit.y = -3;
var lastT = Date.now();
function update()
{
    var delta = Date.now() - lastT;
    lastT = Date.now();
    unit.update(delta);
    mainWorker.postMessage({cmd: CmdType.TickData, unitList: unitList, time: lastT, delta: delta})
}