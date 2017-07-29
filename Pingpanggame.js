/**
 * Created by Administrator on 2017/5/6.
 */

var KEY = {
    UP:38,// playerB向上
    DOWN:40,//playerB向下
    W:87, //playerA向上
    S:83, //playerA向下
};
/*
//键盘按键移动1，不能多输入，（不能同时控制两个滑块移动）
$(function(){
    //监听按键事件
    $(document).keydown(function(e){
        switch (e.which){
            case KEY.UP:
                var top = parseInt($("#paddleB").css("top"));
                $("#paddleB").css("top",top-5);
                break;
            case KEY.DOWN:
                var top = parseInt($("#paddleB").css("top"));
                $("#paddleB").css("top",top+5);
                break;
            case KEY.W:
                var top = parseInt($("#paddleA").css("top"));
                $("#paddleA").css("top",top-5);
                break;
            case KEY.S:
                var top = parseInt($("#paddleA").css("top"));
                $("#paddleA").css("top",top+5);
                break;
        }
    });
});*/
var pingpong = {
    scoreA :0, //玩家A的比分
    scoreB :0,  //玩家B的比分
    key :false, //游戏开关
    winScore:10
}; //存储全局变量的对象
pingpong.pressedkeys = [];
//创建ball对象
pingpong.ball = {
    speed: 5,
    x: 190,
    y: 90,
    directionX: 1,
    directionY: 1
};
$(function(){
    //记下pressedkeys数组里某键的的状态是按下还是放开
    $(document).keydown(function(e){
        pingpong.pressedkeys[e.which] = true;
    });
    $(document).keyup(function(e){
        pingpong.pressedkeys[e.which] = false;
    });
});
$(function(){
    init();
});
//球拍、球位置初始化
function  init(){
    $("#paddleB").css("top","65px");
    $("#paddleA").css("top","65px");
    $("#ball").css({
        "left" : "190px",
        "top" : "90px"
    })
}
//游戏主循环
function gameloop(){
    moveball();
    movePaddles();

}
/*
* Bug描述：游戏正常进行时，再每点击一次鼠标就会使setInterval函数叠加一次，以致乒乓球运动速度指数级加快。
* */
$("#start").click(function(){
    //设置interval每隔30ms调用一次gameloop
    pingpong.key = true;
    if(pingpong.key){
        pingpong.timer = setInterval(gameloop,30);
    }
});
//移动球拍
function movePaddles(){
    //使用自定义定时器不断检测是否有按键按下
    if(pingpong.pressedkeys[KEY.UP]){
        var top = parseInt($("#paddleB").css("top"));
        if(top>0){
            $("#paddleB").css("top",top-5);
        }else {
            $("#paddleB").css("top", 0);
        }
    }
    if(pingpong.pressedkeys[KEY.DOWN]){
        var top = parseInt($("#paddleB").css("top"));
        if(top<130){
            $("#paddleB").css("top",top+5);
        }else{
            $("#paddleB").css("top",130);
        }
    }
    if(pingpong.pressedkeys[KEY.W]){
        var top = parseInt($("#paddleA").css("top"));
        if(top>0){
            $("#paddleA").css("top",top-5);
        }else {
            $("#paddleA").css("top", 0);
        }
    }
    if(pingpong.pressedkeys[KEY.S]){
        var top = parseInt($("#paddleA").css("top"));
        if(top<130){
            $("#paddleA").css("top",top+5);
        }else{
            $("#paddleA").css("top",130);
        }
    }
}

//移动球
function moveball(){
    //调用变量
    var pgHeight = parseInt($("#playground").height());
    var pgwidth = parseInt($("#playground").width());
    var ball = pingpong.ball;


    /*
    * 解决Bug:该Bug导致--->Bug描述：游戏正常进行时，再每点击一次鼠标就会使setInterval函数叠加一次，以致乒乓球运动速度指数级加快。
    * 线设置start按钮disabled为true，在两个“出界判断”中，若球出界游戏可重新开始时，再将start按钮disabled设置为false
    * */
    $("#start").attr("disabled",true);



    //球未出界时动态改变球的位置
    if(pingpong.key){
        ball.x += ball.speed * ball.directionX;
        ball.y += ball.speed * ball.directionY;
    }
    $("#ball").css({
        "left" : ball.x,
        "top" : ball.y
    });

    //检测球拍
    //检测左边球拍
    var paddleAX = parseInt($("#paddleA").css("left")) + parseInt($("#paddleA").css("width"));
    var paddleAYBottom = parseInt($("#paddleA").css("top")) + parseInt($("#paddleA").css("height"));
    var paddleAYTop = parseInt($("#paddleA").css("top"));
    if(ball.x + ball.speed * ball.directionX <paddleAX){
        if(ball.y + ball.speed * ball.directionY <=paddleAYBottom &&ball.y +ball.speed*ball.directionY>=paddleAYTop){
            ball.directionX = 1;
        }
    }
    //检测右边球拍
    var paddleBX = parseInt($("#paddleB").css("left"));
    var paddleBYBottom = parseInt($("#paddleB").css("top")) + parseInt($("#paddleB").css("height"));
    var paddleBYTop = parseInt($("#paddleB").css("top"));
    if(ball.x + ball.speed * ball.directionX >=paddleBX){
        if(ball.y + ball.speed * ball.directionY <=paddleBYBottom &&ball.y +ball.speed*ball.directionY>=paddleBYTop){
            ball.directionX = -1;
        }
    }



    //检测球台边缘

    //检测底边
    if(ball.y +ball.speed * ball.directionY >pgHeight){
        ball.directionY = -1;
    }
    //检测顶边
    if(ball.y + ball.speed * ball.directionY <0){
        ball.directionY = 1;
    }
/*
左右边界作为判断输赢的标准
    //检测右边
    if(ball.x +ball.directionX * ball.speed >pgwidth){
        ball.directionX = -1;
    }
    //检测左边
    if(ball.x +ball.directionX * ball.speed <0){
        ball.directionX = 1;
    }*/
    //检测左边
    if(ball.x+ball.speed*ball.directionX<0){
        //玩家A丢分
        pingpong.scoreB++;
        console.log("B:"+pingpong.scoreB);
        $("#scoreB").html(pingpong.scoreB);
        //重置乒乓球位置
        init();
        ball.x = parseInt($("#ball").css("left"));
        ball.y =parseInt($("#ball").css("top"));
        ball.directionX = -1;
        //重新开始
        pingpong.key = false;
        this.clearInterval(pingpong.timer);
        $("#start").attr("disabled",false); //将start按钮设置为可点击状态
        //判断游戏结束
        if(pingpong.scoreB == pingpong.winScore){
            //显示赢球div
            $("#winner").html("Player B");
            $("#win").css("display","block");
            $("#start").attr("disabled",true);
        }

    }
    //检测右边
    if(ball.x+ball.speed*ball.directionX>pgwidth){
        //玩家B丢分
        pingpong.scoreA++;
        console.log("A:"+pingpong.scoreA);
        $("#scoreA").html(pingpong.scoreA);
        //重置乒乓球、球拍位置
        init();
        ball.x = parseInt($("#ball").css("left"));
        ball.y =parseInt($("#ball").css("top"));
        ball.directionX = 1;
        //重新开始
        pingpong.key = false;
        this.clearInterval(pingpong.timer) ;
        $("#start").attr("disabled",false); //将start按钮设置为可点击状态
        //判断游戏结束
        if(pingpong.scoreA == pingpong.winScore){
            //显示赢球div
            $("#winner").html("Player A");
            $("#win").css("display","block");
            $("#start").attr("disabled",true);
        }
    }
    $("#winbtn").click(function(){
        $("#scoreA").html("0");
        $("#scoreB").html("0");
        $("#win").css("display","none");
        $("#start").attr("disabled",false);
    })

}
