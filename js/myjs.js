
var db = openDatabase("webSql", "1.0", "testdb",1024*100);
var uName = sessionStorage.getItem("uName");

    $(function(){


      if(sessionStorage.getItem("uName") == null){
          
         window.location.href = "registe.html";
      }

     //初始化content的高度，方便后来模块的高度设置
      height = $(window).height();
    d1 = $(".headercss").height();
    d2 = $(".footercss").height();
    
    $(".contentcss").css("height",height-d1-d2);
    $(".img1").css("height",$(".photoShow").height());

    $(".showImg").css("height",$(".showImg").width());
    $(window).resize(function(){
      height = $(window).height();
      d1 = $(".headercss").height();
      d2 = $(".footercss").height();
      
      $(".contentcss").css("height",height-d1-d2);
      $(".img1").css("height",$(".photoShow").height());

      $(".showImg").css("height",$(".showImg").width());
   //执行代码块

      });

    $("a").attr("target","_top");

    //点击相应的列表跳转到不同的页面
    $("#orderul").on("taphold","li",function(){
        deleteOrder(this,$(this).attr("orderID"));
    });

    $("#orderul").on("click","li",function(){
        sessionStorage.setItem("orderID",$(this).attr("orderID"));
        window.location.href="movieDetail/orderDetail.html";
    });

    $("#wantMul").on("taphold","li",function(){
        deleteWantMovie(this,$(this).attr("mID"));
    });

    $("#wantMul").on("click","li",function(){
        sessionStorage.setItem("mID",$(this).attr("mID"));
        window.location.href="movieDetail/Detail.html";
    });

    $("#watchedul").on("taphold","li",function(){
        deleteWatchedMovie(this,$(this).attr("mID"));
    });

    $("#watchedul").on("click","li",function(){
        sessionStorage.setItem("mID",$(this).attr("mID"));
        window.location.href="movieDetail/Detail.html";
    });
  
    //页面初始化
    initorder();
    initwant();
    initwatched();
    

 });
function initorder(){
   //我的订单初始化
  db.transaction(function(tx){
     var selectStr ="select mName,cName,date,beginTime,orderList.price as price,orderID " 
                   +"from schedule,movie,cinema,orderList "
                   +"where schedule.schID = orderList.schID AND schedule.cID = cinema.cID AND "
                   +"movie.mID = schedule.mID AND orderList.uName = '"+uName+"'";
      //从数据库中读出相应的数据后添加到页面中
      tx.executeSql(selectStr,[],function(tx,results){     
          var len = results.rows.length;

          for(var i=0;i<len;i++){
            var result = results.rows.item(i);
            var str="<li orderID='"+result.orderID+"'><a><img src='data/movie/"+result.mName+"/photos/index.jpg'>"
                   +"<h4 class='mName'>"+result.mName+"</h4>"
                   +"<p class='cName'>影院:"+result.cName+"</p>"
                   +"<p class='mTime'>数量:"+result.date+" "+result.beginTime+"</p>"
                   +"<p class='mPrice'>总价:"+result.price+"</p></a></li>";

            $("#orderul").append(str);

          }
          $("#myOrders").page();
          $("#orderul").listview("refresh");


      },function(tx,error){
        console.log(error);
      
    });
    },function(tx,error){

  });
}

function initwant(){
     //我想看的电影
   db.transaction(function(tx){
     var selectStr ="select mName,director,details,score,movie.mID " 
                   +"from movie,wantMovies "
                   +"where wantMovies.uName = '"+uName+"' AND movie.mID = wantMovies.mID" ;

      tx.executeSql(selectStr,[],function(tx,results){    
          console.log(results); 
          var len = results.rows.length;

          for(var i=0;i<len;i++){
            var result = results.rows.item(i);
            var str="<li mID='"+result.mID+"'><a><img src='data/movie/"+result.mName+"/photos/index.jpg'>"
                   +"<h4 class='mName'>"+result.mName+"</h4>"
                   +"<p class='mdirector'>导演:"+result.director+"</p>"
                   +"<p class='mscore'>评分:"+result.score+"</p>"
                   +"<p class='mdetails'>简介:"+result.details+"</p></a></li>";

            $("#wantMul").append(str);

          }
           $("#want_movies").page();
          $("#wantMul").listview("refresh");


      },function(tx,error){
        console.log(error);
      
    });
    },function(tx,error){

  });
}

function initwatched(){

//我看过的电影
  db.transaction(function(tx){
     var selectStr ="select mName,director,details,score,movie.mID " 
                   +"from movie,watchedMovies "
                   +"where watchedMovies.uName = ? AND movie.mID = watchedMovies.mID " ;

      tx.executeSql(selectStr,[uName],function(tx,results){    
          console.log(results); 
          var len = results.rows.length;

          for(var i=0;i<len;i++){
            var result = results.rows.item(i);
            var str="<li mID='"+result.mID+"'><a><img src='data/movie/"+result.mName+"/photos/index.jpg'>"
                   +"<h4 class='mName'>"+result.mName+"</h4>"
                   +"<p class='mdirector'>导演:"+result.director+"</p>"
                   +"<p class='mscore'>评分:"+result.score+"</p>"
                   +"<p class='mdetails'>简介:"+result.details+"</p></a></li>";

            $("#watchedul").append(str);

          }
          $("#watched_movies").page();
          $("#watchedul").listview("refresh");


      },function(tx,error){
        console.log(error);
      
    });
    },function(tx,error){

  });   
}


//长按电影列表能够删除相应的订单或者删除不想看的电影等
//以弹窗的方式显示
function deleteOrder(thisli,oID) {
    var popupDialogId = 'popupDialog';
    $('<div data-role="popup" id="' + popupDialogId + '" data-confirmed="no" data-transition="pop" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="min-width:216px;max-width:500px;"> \
                    \
                    <div role="main" class="ui-content">\
                        <h3 class="ui-title" style="color:#000; text-align:center;margin-bottom:15px">确认删除订单吗？</h3>\
                        <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionConfirm" data-rel="back" style="width: 33%;border-radius: 5px;height: 30px;line-height: 30px;padding: 0;font-size: .9em;margin: 0 0 0 12%;font-weight: 100; color:#009999">确定</a>\
                        <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionCancel" data-rel="back" data-transition="flow" style="color:#5bb0ba; width: 33%;border-radius: 5px;height: 30px;line-height: 30px;padding: 0;font-size: .9em;margin: 0 0 0 5%;font-weight: 100;color: #009999;text-shadow: none;">取消</a>\
                    </div>\
                </div>')
        .appendTo($.mobile.pageContainer);
    var popupDialogObj = $('#' + popupDialogId);
    popupDialogObj.trigger('create');
    popupDialogObj.popup({
        afterclose: function (event, ui) {
            popupDialogObj.find(".optionConfirm").first().off('click');
            var isConfirmed = popupDialogObj.attr('data-confirmed') === 'yes' ? true : false;
            $(event.target).remove();
            if (isConfirmed) {//确定删除后从数据库中移除并且将页面中相应的元素移除
                db.transaction(function(tx){
                    tx.executeSql("delete from orderList where orderList.orderID = '"+oID+"'",[],function(tx,results){     
                       
                        $(thisli).remove(); 
                    },function(tx,error){
                      console.log(error);
                    
                  });
                  },function(tx,error){

                });

            }
        }
    });
    popupDialogObj.popup('open');  
    popupDialogObj.find(".optionConfirm").first().on('click', function () {
        popupDialogObj.attr('data-confirmed', 'yes');
    });
}

function deleteWantMovie(thisli,mID) {
    var popupDialogId = 'popupDialog';
    $('<div data-role="popup" id="' + popupDialogId + '" data-confirmed="no" data-transition="pop" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="min-width:216px;max-width:500px;"> \
                    \
                    <div role="main" class="ui-content">\
                        <h3 class="ui-title" style="color:#000; text-align:center;margin-bottom:15px">已经不喜欢它了吗？</h3>\
                        <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionConfirm" data-rel="back" style="width: 33%;border-radius: 5px;height: 30px;line-height: 30px;padding: 0;font-size: .9em;margin: 0 0 0 12%;font-weight: 100; color:#009999">确定</a>\
                        <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionCancel" data-rel="back" data-transition="flow" style="color:#5bb0ba; width: 33%;border-radius: 5px;height: 30px;line-height: 30px;padding: 0;font-size: .9em;margin: 0 0 0 5%;font-weight: 100;color: #009999;text-shadow: none;">取消</a>\
                    </div>\
                </div>')
        .appendTo($.mobile.pageContainer);
    var popupDialogObj = $('#' + popupDialogId);
    popupDialogObj.trigger('create');
    popupDialogObj.popup({
        afterclose: function (event, ui) {
            popupDialogObj.find(".optionConfirm").first().off('click');
            var isConfirmed = popupDialogObj.attr('data-confirmed') === 'yes' ? true : false;
            $(event.target).remove();
            if (isConfirmed) {
                db.transaction(function(tx){
                    tx.executeSql("delete from wantMovies where mID = '"+mID+"' AND uName = '"+uName+"'",[],function(tx,results){     
                       
                        $(thisli).remove(); 
                    },function(tx,error){
                      console.log(error);
                    
                  });
                  },function(tx,error){

                });

            }
        }
    });
    popupDialogObj.popup('open');
    popupDialogObj.find(".optionConfirm").first().on('click', function () {
        popupDialogObj.attr('data-confirmed', 'yes');
    });
}

function deleteWatchedMovie(thisli,mID) {
    var popupDialogId = 'popupDialog';
    $('<div data-role="popup" id="' + popupDialogId + '" data-confirmed="no" data-transition="pop" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="min-width:216px;max-width:500px;"> \
                    \
                    <div role="main" class="ui-content">\
                        <h3 class="ui-title" style="color:#000; text-align:center;margin-bottom:15px">确认移出它吗?</h3>\
                        <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionConfirm" data-rel="back" style="width: 33%;border-radius: 5px;height: 30px;line-height: 30px;padding: 0;font-size: .9em;margin: 0 0 0 12%;font-weight: 100; color:#009999">确定</a>\
                        <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionCancel" data-rel="back" data-transition="flow" style="color:#5bb0ba; width: 33%;border-radius: 5px;height: 30px;line-height: 30px;padding: 0;font-size: .9em;margin: 0 0 0 5%;font-weight: 100;color: #009999;text-shadow: none;">取消</a>\
                    </div>\
                </div>')
        .appendTo($.mobile.pageContainer);
    var popupDialogObj = $('#' + popupDialogId);
    popupDialogObj.trigger('create');
    popupDialogObj.popup({
        afterclose: function (event, ui) {
            popupDialogObj.find(".optionConfirm").first().off('click');
            var isConfirmed = popupDialogObj.attr('data-confirmed') === 'yes' ? true : false;
            $(event.target).remove();
            if (isConfirmed) {
                db.transaction(function(tx){
                    tx.executeSql("delete from watchedMovies where mID = '"+mID+"' AND uName = '"+uName+"'",[],function(tx,results){     
                       
                        $(thisli).remove(); 
                    },function(tx,error){
                      console.log(error);
                    
                  });
                  },function(tx,error){

                });

            }
        }
    });
    popupDialogObj.popup('open');
    popupDialogObj.find(".optionConfirm").first().on('click', function () {
        popupDialogObj.attr('data-confirmed', 'yes');
    });
}
