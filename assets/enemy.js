// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var com = require('common');
cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        enemyLifeDisplay: {
            default: null,
            type: cc.Label
        },
        playerLifeDisplay: {
            default: null,
            type: cc.Label
        },
        player: {
            default: null,
            type: cc.Node
        },
        enemyBulletContainer: {
            default: null,
            type: cc.Node
        },
        winLabel: {
            default: null,
            type: cc.Label
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        timeLabel: {
            default: null,
            type: cc.Label
        },
        scoreExplainLabel: {
            default: null,
            type: cc.Label
        },
        playAgainButton: {
            default: null,
            type: cc.Button
        },
    },

    onCollisionEnter: function(other,self){
        this.enemyLifeDisplay.string--;
        if(this.enemyLifeDisplay.string <= 0){
            this.enemyLifeDisplay.string = 0;
            this.winLabel.node.active = true;
            cc.Tween.stopAllByTarget(this.node);
            this.isMoving = true;
            com.isEnemyDead = true;

            var score = Number(this.playerLifeDisplay.string) * 10 + Math.pow(Number(this.timeLabel.string),2);
            score = Math.floor(score);
            score = "分数：" + String(score);
            this.scoreLabel.string = score;
            this.scoreLabel.node.active = true;
            this.scoreExplainLabel.node.active = true;
            this.playAgainButton.node.active = true;

            this.node.active = false;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.enemyLifeDisplay.string = 1000;
        this.isMoving = false;
        com.isEnemyDead = false;
    },

    start () {

    },

    fireBullet: function(arg){
        for( var i = 1; i <= arg ; i += 1 ){
            // 使用给定的模板在场景中生成一个新节点
            var newBullet = cc.instantiate(this.bulletPrefab);
            // 将新增的节点添加到 Canvas 节点下面
            //this.node.getParent().addChild(newBullet);
            //玩家子弹和敌人子弹各添加到不同的节点下面好像可以导致 draw call 合并，会让游戏更顺畅。
            //如果全都添加到 Canvas 节点下面的话 draw call 会飙升，游戏会变卡。
            //具体的细节请参考这个帖子：
            //https://forum.cocos.org/t/drawcall/43273
            this.enemyBulletContainer.addChild(newBullet);
            // 将子弹起点设置为 player 所在位置
            newBullet.setPosition(cc.v2(this.node.x,this.node.y));
            // 子弹的 Anchor 修改了。
            newBullet.angle = this.node.angle;
            cc.tween(newBullet)
                .by(6, { position: cc.v2(3000*this.myCos(this.node.angle),3000*this.mySin(this.node.angle))})
                .start();
        }
    },

    randMove: function(){
        var angle = Math.random()*360;
        cc.tween(this.node)
                .by(1, { position: cc.v2(200*this.myCos(angle),200*this.mySin(angle))})
                .call(() => { this.isMoving = false; })
                .start();
    },

    myCos: function(value){
        return Math.cos(value * Math.PI / 180);
    },

    mySin: function(value){
        return Math.sin(value * Math.PI / 180);
    },

    moveToCenter: function(){
        cc.tween(this.node)
                .to(4, { position: cc.v2(0,0)})
                .call(() => { this.isMoving = false; })
                .start();
    },

    update (dt) {
        this.playerPos = new cc.v2(this.player.x,this.player.y);

        var enemyPos = new cc.v2(this.node.x,this.node.y);
        var tmp = this.playerPos.sub(enemyPos);
        var angle = Math.atan2((-tmp.y), (tmp.x));
        var theta = angle * (180 / Math.PI);
        this.node.angle = - theta;

        var distToCenter = this.node.position.mag();
        if(distToCenter > 800 && !this.isMoving){
            cc.Tween.stopAllByTarget(this.node);
            this.isMoving = true;
            this.moveToCenter();
        }

        if(!this.isMoving){
            this.isMoving = true;
            this.randMove();
        }

        if(!com.isEnemyDead){
            this.fireBullet(1);
        }
    },
});
