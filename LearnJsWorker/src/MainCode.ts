
import UnitData from "./UnitData";

var CmdType =
{
    Start:"Start",
    TickData : "TickData",
}

export default class MainCode
{
    scene: Laya.Scene3D;
    worker: MWorker;

    boxMain: Laya.MeshSprite3D;
    boxWorker: Laya.MeshSprite3D;

    unitMain: UnitData;
    unitWorker: UnitData;

    text: Laya.Text;

    constructor(scene: Laya.Scene3D)
    {
        this.worker = MWorker.Create("workers/index.js", "MainCode");
        this.worker.onMessage(this.onMessage.bind(this));
        window['mainCode'] = this;
        window['worker'] = this.worker;

        var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
        box.transform.localPositionY = 1;
        scene.addChild(box);
        this.boxMain = box;

        
        var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
        box.transform.localPositionY = 2;
        scene.addChild(box);
        this.boxWorker = box;

        this.unitMain = new UnitData();
        this.unitWorker = new UnitData();

        this.text = new Laya.Text();
        this.text.fontSize = 25;
        this.text.align = "left";
        this.text.width = 300;
        this.text.height = 300;
        this.text.y = 50;
        this.text.x = (Laya.stage.width -  this.text.width ) * 0.5;
        Laya.stage.addChild( this.text);



        console.log(Date.now(), "发送第一给消息")
        this.t = Date.now();
        this.worker.postMessage({cmd: CmdType.Start});

        
        Laya.timer.frameLoop(1, this, this.onUpdate);
        // setInterval(this.update.bind(this), 16);
    }

    
lastT = Date.now();
update()
{
    var delta = Date.now() - this.lastT;
    this.lastT = Date.now();

    
    if(this.isStarted)
    {
        this.unitMain.update(delta);
        
        this.boxMain.transform.localPositionX = this.unitMain.x;
        this.boxWorker.transform.localPositionX = this.unitWorker.x;

    }

    this.text.text = "传送时间花费: " +  this.postUseTime + "ms\n" 
                    + "MainCode.delta: " + delta + "ms\n"
                    + "WorkerCode.delta: " + this.workerFrameDelta + "ms\n";
}


    t =0;
    onUpdate()
    {
        if(this.isStarted)
        {
            this.unitMain.update(Laya.timer.delta);
            
            this.boxMain.transform.localPositionX = this.unitMain.x;
            this.boxWorker.transform.localPositionX = this.unitWorker.x;

        }

        this.text.text = "传送时间花费: " +  this.postUseTime + "ms\n" 
                        + "Laya.timer.delta: " + Laya.timer.delta + "ms\n"
                        + "Worker.delta: " + this.workerFrameDelta + "ms\n";
    }

    isStarted = false;
    postUseTime = 0;
    workerFrameDelta = 0;
    onMessage(msg)
    {
        switch(msg.cmd)
        {
            case CmdType.Start:
                console.log(Date.now() - this.t);
                console.log(Date.now(), "MainCode onMessage >>", msg);
                this.isStarted = true;
                break;
            case CmdType.TickData:
                this.unitWorker = msg.unit;
                this.postUseTime =Date.now() - msg.time;
                this.workerFrameDelta = msg.delta;
                break;
        }
    
    }
}