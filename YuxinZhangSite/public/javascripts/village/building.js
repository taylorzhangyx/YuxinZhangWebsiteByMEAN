// JavaScript Document
var building = {
    b_list: [],
    b_link: [],

    init: function(){
        this.b_list[0] = $("#build_resume");
        this.b_link[0] = "/file/yuxin_resume.pdf";

        this.b_list[1] = $("#build_project");
        this.b_link[1] = "/#profile";

        this.b_list[2] = $("#build_game");
        this.b_link[2] = "https://taylorzhangyx.github.io/Leetcodes/";

        this.b_list[3] = $("#linkedin");
        this.b_link[3] = "https://www.linkedin.com/in/yuxin-zhang-5248b7b5";

        this.b_list[4] = $("#facebook");
        this.b_link[4] = "https://www.facebook.com/yuxin.zhang.9406";

        this.b_list[5] = $("#github");
        this.b_link[5] = "https://github.com/taylorzhangyx";
    },

    react: function(pos){
        for(i = 0; i < this.b_list.length; i++){
           if(iscollide(pos, this.b_list[i])){
               controller.timerclean();
               window.open(this.b_link[i]);
               return true;
           }
        }
        return false;
    }
};
