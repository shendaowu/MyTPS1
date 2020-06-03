// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        leftTimeLabel: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.leftTime = 3.9;
        this.isExecutedLoadScene = false;
    },

    update (dt) {
        if(this.leftTime <=0 && !this.isExecutedLoadScene){
            this.isExecutedLoadScene = true;
            cc.director.loadScene("Main");
        }
        this.leftTime -= dt;
        if(this.leftTime < 0){
            this.leftTime = 0;
        }
        this.leftTimeLabel.string = Math.floor(this.leftTime);
    },
});
