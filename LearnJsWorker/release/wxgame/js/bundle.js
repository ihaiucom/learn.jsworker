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

    class MWorker {
        static Create(scriptPath, name = "worker") {
            var worker;
            if (Laya.Browser.onMiniGame) {
              worker = wx.createWorker(scriptPath);
            }
            else {
                worker = new Worker(scriptPath);
            }
          console.log(worker);
            
            return new MWorker(worker, name);
        }
        constructor(worker, name = "worker") {
            this.worker = worker;
            this.name = name;
        }
        onMessage(callback) {
            if (Laya.Browser.onMiniGame) {
                this.worker.onMessage((result) => {
                    console.log(this.name, "onMessage", result);
                });
            }
            else {
                this.worker.onmessage = (event) => {
                    console.log(this.name, "onMessage", event);
                };
            }
        }
      postMessage(data, transferList = undefined) {
            if (Laya.Browser.onMiniGame) {
              this.worker.postMessage(data);
            }
            else {
              this.worker.postMessage(data, transferList);
            }
        }
        terminate() {
            this.worker.terminate();
        }
    }

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

    var CmdType = {
        Start: "Start",
        TickData: "TickData",
    };
    class MainCode {
        constructor(scene) {
          this.worker = MWorker.Create("workers/workercode.js", "MainCode");
          console.log(this.worker);
          window['mainCode'] = this;
          window['worker'] = this.worker;
            this.worker.onMessage(this.onMessage.bind(this));
            var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
            scene.addChild(box);
            this.boxMain = box;
            var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
            scene.addChild(box);
            this.boxWorker = box;
            this.unitMain = new UnitData();
            this.unitWorker = new UnitData();
            Laya.timer.frameLoop(1, this, this.onUpdate);

            setTimeout(()=>{

              console.log("发送消息");
              this.worker.postMessage({ cmd: CmdType.Start });
              var buff = new ArrayBuffer(100);
              this.worker.postMessage({ cmd: CmdType.TickData, buff: buff }, [buff]);
            }, 500);
        }
        onUpdate() {
            this.unitMain.update(Laya.timer.delta);
            this.boxMain.transform.localPositionX = this.unitMain.x;
            this.boxWorker.transform.localPositionX = this.unitWorker.x;
        }
        onMessage() {
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
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
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
