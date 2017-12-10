/**
 * Created by Administrator on 2017/5/7.
 */
//复制16张纸牌
$(function(){
   matchingGame.deck.sort(shuffle);//洗牌
   for(var i=0;i<15;i++){
       $(".card:first-child").clone().appendTo("#cards");
   }
    //初始化每张纸牌的位置
    $("#cards").children().each(function(index){
        //让纸牌以4*4的形式对齐
        $(this).css({
            "left": ($(this).width()+35) *(index %4) +25,
            "top": ($(this).height() +10)* Math.floor(index/4)+10
        });
        //从已洗过的纸牌中获取图案
        var pattern = matchingGame.deck.pop();
        //应用纸牌的背景图案，并使其可见
        $(this).find(".back").addClass(pattern);
        //把图案数据嵌入到DOM元素中
        $(this).attr("data-pattern",pattern);
        //监听每张纸牌div元素的单击事件
        $(this).click(selectCard);
    });
});
var matchingGame = {};
matchingGame.deck = [
    'cardAK' , 'cardAK',
    'cardAQ' , 'cardAQ',
    'cardBK' , 'cardBK',
    'cardBQ' , 'cardBQ',
    'cardCK' , 'cardCK',
    'cardCQ' , 'cardCQ',
    'cardDK' , 'cardDK',
    'cardDQ' , 'cardDQ'
];
function shuffle(){
    return 0.5-Math.random();
}

function selectCard(){
    //如果已经翻开两张纸牌，
    if($(".card-flipped").size()>1){
        return;
    }
    $(this).addClass("card-flipped");
    //0.7s后，检测两张已经翻开的牌的图案
    if($(".card-flipped").size() == 2){
        setTimeout(checkPattern,700);
    }
}

function checkPattern(){
    if(isMatchPattern()){
        $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
        $(".card-removed").bind("webkitTransitionEnd",removeTookCards);

    }else{
        $(".card-flipped").removeClass("card-flipped");
    }
}

function  isMatchPattern(){
    var cards = $(".card-flipped");
    var pattern =  $(cards[0]).data("pattern");
    var anotherPattern = $(cards[1]).data("pattern");
    return (pattern === anotherPattern);
}

function removeTookCards(){
    $(".card-removed").remove();
}











