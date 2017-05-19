// JavaScript Document
function iscollide(aPos,b){//a is character, b is building
    var a = player.hero;
    var bPos = b.offset();
    
    var ax = aPos.left + (a.height()/2);
    var ay = aPos.top + a.width() - (a.width()/5);
    
    var bx = bPos.left + (b.height()/2);
    var by = bPos.top + (b.width()/2);
    
    var dis = getdis(ax, ay, bx, by);
    
    return dis < (a.height() + a.width() + b.height() + b.width())/6;
}

function getdis(ax, ay, bx, by){
    return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
}