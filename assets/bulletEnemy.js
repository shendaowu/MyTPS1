// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        enemy: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onCollisionEnter:function(other,self){
        //this.node.destroy();
        this.collishionWithPlayer = true;
    },

    // onLoad () {},
    onLoad: function () {
        this.enemy = cc.find("Canvas/enemy");
        this.collishionWithPlayer = false;
    },

    start () {

    },

    update (dt) {
        var enemyPos = this.enemy.getPosition();
        var dist = this.node.position.sub(enemyPos).mag();
        if (dist > 1000){
            this.node.destroy();
        }
        if(this.collishionWithPlayer){
            this.node.destroy();
        }
    },
});
