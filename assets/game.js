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
        enemy: {
            default: null,
            type: cc.Node
        },
        player: {
            default: null,
            type: cc.Node
        },
        pointer: {
            default: null,
            type: cc.Node
        },
        winLabel: {
            default: null,
            type: cc.Label
        },
        loseLabel: {
            default: null,
            type: cc.Label
        },
        timeLabel: {
            default: null,
            type: cc.Label
        },
        scoreLabel: {
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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    playAgain: function(){
        cc.director.loadScene("countdown");
    },

    start () {
        this.pointer.active = false;
        this.winLabel.node.active = false;
        this.loseLabel.node.active = false;
        this.scoreLabel.node.active = false;
        this.scoreExplainLabel.node.active = false;
        this.playAgainButton.node.active = false;
        com.isEnemyDead = false;
    },

    update (dt) {
        var tmpx = Math.abs(this.enemy.x - this.player.x);
        var tmpy = Math.abs(this.enemy.y - this.player.y);
        if(tmpx >= 480 || tmpy >= 320){
            this.pointer.active = true;

            var enemyPos = new cc.v2(this.enemy.x,this.enemy.y);
            var playerPos = new cc.v2(this.player.x,this.player.y);
            var tmp = enemyPos.sub(playerPos);
            var angle = Math.atan2((-tmp.y), (tmp.x));
            var theta = angle * (180 / Math.PI);
            this.pointer.angle = - theta;
        }
        else{
            this.pointer.active = false;
        }

        //cc.log(com.isEnemyDead)
        if(!com.isEnemyDead){
            var num = this.timeLabel.string - dt;
            num = num.toFixed(3);
            if(num <= 0){
                num = 0;
            }
            this.timeLabel.string = num;
        }
    },
});
