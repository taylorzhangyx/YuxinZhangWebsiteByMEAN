// JavaScript Document
var player = {
    hero : null,
    step_len : 16,
    /*get player*/
    init: function (){
        this.hero = $("#character");
    },
    
    /*moving functions*/
    moveUp : function () {
        var newpos = new Object();
        var curpos = this.hero.offset();
        newpos.left = curpos.left;
        newpos.top = curpos.top - this.step_len;
        return newpos;
    },
    moveDown : function(){
        var newpos = new Object();
        var curpos = this.hero.offset();
        newpos.left = curpos.left;
        newpos.top = curpos.top + this.step_len;
        return newpos;
    },
    moveLeft : function(){
        var newpos = new Object();
        var curpos = this.hero.offset();
        newpos.left = curpos.left  - this.step_len;
        newpos.top = curpos.top;
        return newpos;
    },
    moveRight : function(){
        var newpos = new Object();
        var curpos = this.hero.offset();
        newpos.left = curpos.left  + this.step_len;
        newpos.top = curpos.top;
        return newpos;
    }
};