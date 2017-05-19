// JavaScript Document
var tag = {
    init: function(){
        $("a").prop("target", "_blank");
        
        tag_build.init();
        tag_build.play(10);
        tag_build.play(6);
        tag_build.play(3);
        $(".build_tag").hover(function(){
            $(this).animate({top: "-=5px"}, "200");
        },function(){
            $(this).animate({top: "+=5px"}, "200");
        });
        
        
    }
}

var tag_build = {
    tag: null,
    init: function(){
        this.tag = $(".build_tag");
    },
    
    play: function(dis){
        this.moveup(dis);
        this.movedown(dis);
    },
    moveup: function(dis){
        this.tag.animate({top: "-="+dis+"px"}, "200");
    },
    movedown: function(dis){
        this.tag.animate({top: "+="+dis+"px"}, "200");
    },
    after: function(){
        $(".build_tag").hover(this.moveup(5), this.movedown(5));
    }
}

function lowervolume(){
    $("#bgm")[0].volume = 0.01;
}