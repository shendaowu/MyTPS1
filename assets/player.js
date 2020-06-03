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
        moveSpeed: 0,
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        enemy: {
            default: null,
            type: cc.Node
        },
        camera: {
            default: null,
            type: cc.Node
        },
        playerBulletContainer: {
            default: null,
            type: cc.Node
        },
        playerLifeDisplay: {
            default: null,
            type: cc.Label
        },
        loseLabel: {
            default: null,
            type: cc.Label
        },
        playAgainButton: {
            default: null,
            type: cc.Button
        },
    },

    onCollisionEnter:function(other,self){
        this.playerLifeDisplay.string--;
        if(this.playerLifeDisplay.string <= 0){
            this.playerLifeDisplay.string = 0;
            this.loseLabel.node.active = true;
            this.playAgainButton.node.active = true;
            this.node.active = false;
            this.enemy.active = false;
            com.isEnemyDead = true;//敌人怎么都是死看起来有点不太公平，不过该代码太麻烦了。下次注意吧。
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onKeyDown: function (event) {
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.macro.KEY.w:
                this.movUp = true;
                break;
            case cc.macro.KEY.s:
                this.movDown = true;
                break;
            case cc.macro.KEY.a:
                this.movLeft = true;
                break;
            case cc.macro.KEY.d:
                this.movRight = true;
                break;
        }
    },

    onKeyUp: function (event) {
        // unset a flag when key released
        switch(event.keyCode) {
            case cc.macro.KEY.w:
                this.movUp = false;
                break;
            case cc.macro.KEY.s:
                this.movDown = false;
                break;
            case cc.macro.KEY.a:
                this.movLeft = false;
                break;
            case cc.macro.KEY.d:
                this.movRight = false;
                break;
        }
    },

    onMouseMove: function (event) {
        this.mousePos = new cc.v2(event.getLocationX(),event.getLocationY());
        var adjust = new cc.v2(480,320);
        this.mousePos = this.mousePos.sub(adjust);
        this.mousePos = this.camera.getComponent(cc.Camera).getScreenToWorldPoint(this.mousePos);

        var playerPos = new cc.v2(this.node.x,this.node.y);
        var tmp = this.mousePos.sub(playerPos);
        var angle = Math.atan2((-tmp.y), (tmp.x));
        var theta = angle * (180 / Math.PI);
        this.node.angle = - theta;
    },

    onMouseDown: function (event) {
        this.mouseDownLeft = true;
    },

    onMouseUp: function (event) {
        this.mouseDownLeft = false;
        //this.fireBullet(1);
    },

    // arg: 发射子弹个数.
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
            this.playerBulletContainer.addChild(newBullet);
            // 将子弹起点设置为 player 所在位置
            newBullet.setPosition(cc.v2(this.node.x,this.node.y));
            // 子弹的 Anchor 修改了。
            newBullet.angle = this.node.angle;
            cc.tween(newBullet)
                .by(6, { position: cc.v2(3000*this.myCos(this.node.angle),3000*this.mySin(this.node.angle))})
                .start();
        }
    },

    myCos: function(value){
        return Math.cos(value * Math.PI / 180);
    },

    mySin: function(value){
        return Math.sin(value * Math.PI / 180);
    },

    // onLoad () {},
    onLoad: function () {

        this.movUp = false;
        this.movDown = false;
        this.movLeft = false;
        this.movRight = false;

        this.mouseDownLeft = false;

        this.mousePos = new cc.v2(0,0);

        this.playerLifeDisplay.string = 200;

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.backgroundNode = cc.find("Canvas/background");
        this.backgroundNode.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.canvasNode = cc.find("Canvas");
        this.canvasNode.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
        this.canvasNode.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    },

    onDestroy: function () {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.backgroundNode.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.canvasNode.off(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
        this.canvasNode.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    },

    start () {
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    v22theta: function(value){
        var angle = Math.atan2((-value.y), (value.x));
        var theta = angle * (180 / Math.PI);
        return theta;
    },

    // update (dt) {},
    update: function (dt) {
        if(this.movUp){
            this.node.y += this.moveSpeed * dt;
        }
        if(this.movDown){
            this.node.y -= this.moveSpeed * dt;
        }
        if(this.movLeft){
            this.node.x -= this.moveSpeed * dt;
        }
        if(this.movRight){
            this.node.x += this.moveSpeed * dt;
        }

        if(this.mouseDownLeft){
            this.fireBullet(1);
        }

        this.camera.x = this.node.x;
        this.camera.y = this.node.y;
    },
});
