var WorkerConfig = 
{
    // 是否是微信游戏
    IsWxgame: false,
}

if(this.worker)
{
    WorkerConfig.IsWxgame = true;
}

this.WorkerConfig = WorkerConfig;
var module = this.module | {};
module.exports = WorkerConfig;