(function () {
    'use strict';

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

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
            if (this.x > 5 || this.x < -5) {
                this.speed *= -1;
            }
        }
    }

    var CmdType = {
        Start: "Start",
        TickData: "TickData",
    };
    class MainCode {
        constructor(scene) {
            this.lastT = Date.now();
            this.t = 0;
            this.isStarted = false;
            this.postUseTime = 0;
            this.workerFrameDelta = 0;
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
            this.text.x = (Laya.stage.width - this.text.width) * 0.5;
            Laya.stage.addChild(this.text);
            console.log(Date.now(), "发送第一给消息");
            this.t = Date.now();
            this.worker.postMessage({ cmd: CmdType.Start });
            Laya.timer.frameLoop(1, this, this.onUpdate);
        }
        update() {
            var delta = Date.now() - this.lastT;
            this.lastT = Date.now();
            if (this.isStarted) {
                this.unitMain.update(delta);
                this.boxMain.transform.localPositionX = this.unitMain.x;
                this.boxWorker.transform.localPositionX = this.unitWorker.x;
            }
            this.text.text = "传送时间花费: " + this.postUseTime + "ms\n"
                + "MainCode.delta: " + delta + "ms\n"
                + "WorkerCode.delta: " + this.workerFrameDelta + "ms\n";
        }
        onUpdate() {
            if (this.isStarted) {
                this.unitMain.update(Laya.timer.delta);
                this.boxMain.transform.localPositionX = this.unitMain.x;
                this.boxWorker.transform.localPositionX = this.unitWorker.x;
            }
            this.text.text = "传送时间花费: " + this.postUseTime + "ms\n"
                + "Laya.timer.delta: " + Laya.timer.delta + "ms\n"
                + "Worker.delta: " + this.workerFrameDelta + "ms\n";
        }
        onMessage(msg) {
            switch (msg.cmd) {
                case CmdType.Start:
                    console.log(Date.now() - this.t);
                    console.log(Date.now(), "MainCode onMessage >>", msg);
                    this.isStarted = true;
                    break;
                case CmdType.TickData:
                    this.unitWorker = msg.unitList[0];
                    this.postUseTime = Date.now() - msg.time;
                    this.workerFrameDelta = msg.delta;
                    break;
            }
        }
    }

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            var scene = Laya.stage.addChild(new Laya.Scene3D());
            var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 3, 3));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            var box = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1)));
            box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
            var material = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function (tex) {
                material.albedoTexture = tex;
            }));
            box.meshRenderer.material = material;
            new MainCode(scene);
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/GameUI.ts", GameUI);
        }
    }
    GameConfig.width = 1334;
    GameConfig.height = 750;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = true;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
