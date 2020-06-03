// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onCollisionEnter:function(other,self){
        //this.node.destroy();
        this.collishionWithEnemy = true;
    },

    // onLoad () {},
    onLoad: function () {
        //this.player = this.node.getParent().getChildByName("player");
        this.player = cc.find("Canvas/player");
        //cc.log(this.player);
        this.collishionWithEnemy = false;
    },

    start () {

    },

    update (dt) {
        var playerPos = this.player.getPosition();
        var dist = this.node.position.sub(playerPos).mag();
        if (dist > 1000){
            this.node.destroy();
        }
        if(this.collishionWithEnemy){
            this.node.destroy();
        }
    },
});
