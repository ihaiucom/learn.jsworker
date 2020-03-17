
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

    constructor(scene: Laya.Scene3D)
    {
        this.worker = MWorker.Create("workers/index.js", "MainCode");
        this.worker.onMessage(this.onMessage.bind(this));
        window['mainCode'] = this;
        window['worker'] = this.worker;

        var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
        scene.addChild(box);
        this.boxMain = box;

        
        var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
        scene.addChild(box);
        this.boxWorker = box;

        this.unitMain = new UnitData();
        this.unitWorker = new UnitData();

        Laya.timer.frameLoop(1, this, this.onUpdate);
        this.worker.postMessage({cmd: CmdType.Start});
    }

    onUpdate()
    {
        this.unitMain.update(Laya.timer.delta);
        
        this.boxMain.transform.localPositionX = this.unitMain.x;
        this.boxWorker.transform.localPositionX = this.unitWorker.x;
    }

    onMessage(...args)
    {
        console.log("MainCode onMessage >>", args);
    }
}