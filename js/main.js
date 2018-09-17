
// JavaScript Document

    var db = openDatabase("webSql", "1.0", "testdb",1024*100);
    sessionStorage.setItem("Nowhref","index1.html");
    $(function(){
      //初始化content
      initContent();

    /*将数据导入数据库*/
   
  /*
     判断浏览器是否支持websql
     如果支持的话，建数据库和表，并将json数据导入到相应的表中
  */
  
  if(window.openDatabase){ 

        initPage();
     }else{
        console.log("浏览器不支持DataBase"); 
     }
     $("a").attr("target","_top");

     $("#hotMovieList").on("click","a",function(){
		   var mID = $(this).attr("mID");
		   sessionStorage.setItem("mID",mID);
		   window.location.href = "movieDetail/Detail.html";
     });

     $("#recommend").on("click",".reclist",function(){
		   var mID = $(this).attr("mID");
		   sessionStorage.setItem("mID",mID);
		   window.location.href = "movieDetail/Detail.html";
     });

     $(".img1").click(function(){
     	 var mName = $(this).attr("src").slice(11,-22);
     	db.transaction(function(tx){
            tx.executeSql("select * from movie where mName = '"+mName+"'",[],function(tx,results){  
                 var mID = results.rows.item(0).mID;
                 sessionStorage.setItem("mID",mID);
                 window.location.href = "movieDetail/Detail.html";
            },function(tx,error){
              });
    });
 
     });


 });

function initContent(){
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
}

function initPage(){
  var imglist = [];
     db.transaction(function(tx){
        tx.executeSql('select * from movie',[],function(tx,result){
             var len = result.rows.length,i;
             var results = result.rows;
             var recommendMovie = 0;
             var imglen = 0;

             for(i = 0; i < len; i++){

          var score = results.item(i).score;

                  if(result.rows.item(i).is_show == "True" ){
                    //轮播图片查找
                    if(imglen < 5){
                      imglist[imglen++] = "data/movie/"+results.item(i).mName+"/photos/horizontal.jpg";
                  
                    }

                    //精品推荐
                    if(recommendMovie　< 3 && score >6 ){
                                recommendMovie++;

                                
                    var str="<div class='reclist' mID='"+results.item(i).mID+"' style='background:url(data/movie/"+results.item(i).mName+"/photos/index.jpg) no-repeat;background-size:100% 100%;'>"
                            +"<div class='mScore'>"
                            +"<p>"+score+"</p>"
                            +"</div></div>";     

                    $("#recommend").append(str);    
              
                    }

                  //热门电影
                    var hot="<li> <a href='' target='_top' mID='"+results.item(i).mID+"'> <img src='data/movie/"+results.item(i).mName+"/photos/index.jpg' >"
                          +"<h4>"+results.item(i).mName+"</h4>"
                          +"<h3>"+score+"</h3>"
                          +"<p>导演："+results.item(i).director+"</p>"
                          +"<p>主演："+results.item(i).actors+"</p>"
                          +"<p>简介："+results.item(i).details+"</p>"
                        +"</li>";
                $("#hotMovieList").append(hot);




                  }else{
                    //即将上映
            }


            
             }
             $('#hotMovieList').listview('refresh');
         $('#comingsoon').listview('refresh');

        });

        
           //轮播设置     
           
         var mySet;  
         
         $(".photoShow").on("swipeleft",function(){
              clearInterval(mySet);
              fn();
               mySet = setInterval(fn,2000);
         });
           
         //prev处理
         $(".photoShow").on("swiperight",function(){
           //1.获取当前选中的元素
               clearInterval(mySet);
               var index = $("input[type='radio']:checked").val();  //input：基本选择其当中的元素选择器 
          
           
               if(index == 0){
                  index = imglist.length-1;
               }else{
                 index--;
                 }
                change(index);
                 mySet = setInterval(fn,2000);
           });

          $("input[type='radio']").mouseover(function(){
            
              $(this).prop("checked",true);
              //具有 true 和 false 两个属性的属性，如 checked, selected 或者 disabled 使用prop(),其他的使用attr()     
           
              var index = $("input[type='radio']:checked").val();  
              $(".img1").attr("src",imglist[index]);
            
          });
         
          //定时刷新

        //setInderval(fn,time)
        // fn:调用的处理函数  time：间隔时间（毫秒为单位）

        mySet = setInterval(fn,2000);
        function fn(){
           var index = $("input[type='radio']:checked").val();
           
          index =(parseInt(index) + 1)%imglist.length; 
         
          //3.修改image的src
          change(index);
        }
        function change(index){
             $(".img1").attr("src",imglist[index]);
          
          $($("input[type='radio']")[index]).prop("checked",true);
        }
            

     });
}