// JavaScript Document

$(document).ready(function() {
	game.init();
    game.start();
});

var game = {
    init : function(){
        tag.init();
        player.init();
        building.init();
    },
    
    start : function(){
        controller.enable();
    },
};

var controller = {
    timer: null,
    keymark : -1,
    enable : function(){
        
        $(document).keydown(function(event){controller.keydown(event)});
        $(document).keyup(function(event){controller.keyup(event)});
        
        
    },
    
    keydown: function(e){
        controller.keymark= eventcode(e);//only valid key can return an positive int
        //check the new position with all reactable object to trigger an event
        if(controller.keymark > 0 && !controller.timer){
            controller.timer = setInterval(this.update , 20);
        }
    },
    
    keyup: function(e){
        controller.keymark = eventcode(e);
        if(controller.keymark > 0 && controller.keymark <= 4 && controller.timer){
            controller.timerclean();
        }
        return;
    },
    
    timerclean: function(){
        clearInterval(controller.timer);
        controller.timer = null;
    },
    
    update: function(){
            //different code, different reactions
            if(controller.keymark > 0 && controller.keymark <= 4){
                //move part
                move(controller.keymark);
            }
            return;
        }
}


//traslate event to corresponding code
function eventcode(e){
    switch(e.which){
        //up
        case 87: 
        case 38:
            return 1;
        //down
        case 83: 
        case 40:
            return 2;
        //left
        case 65: 
        case 37:
            return 3;
        //right
        case 68: 
        case 39:
            return 4;
    };
    return -1;
}



//move part
function move(code){
    var newpos = null;
    switch(code){
        case 1: newpos = player.moveUp();break;
        case 2: newpos = player.moveDown();break;
        case 3: newpos = player.moveLeft();break;
        case 4: newpos = player.moveRight();break;
    }
    if(!reaction(newpos)){
        player.hero.offset(newpos);
    }
    return;
}

function reaction(newpos){
    
    var left = newpos.left;
    var top = newpos.top;
    
    var village_pos = $("#village_map").offset();
    var maxtop = village_pos.top;
    var maxbottom = village_pos.top + 416;
    var maxleft = village_pos.left;
    var maxright = village_pos.left + 1024;
    
    if(left <= maxleft || top <= maxtop || left >= maxright || top >= maxbottom) {
        return true;
    }
    if(building.react(newpos)) return true;
    else{
        return false;
    }
}






