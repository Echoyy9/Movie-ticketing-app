var http = require('http');
var fs = require('fs');

var server = http.createServer();

var handlerequest = function(request,respone){
    var url = request.url;
   // respone.writeHead(200,{'Content-Type':'text/html'});
   if(url=='/'){
       respone.writeHead(200,{'Content-Type':'text/html'});
        var ns = fs.readFile('./index.html', function(err, data) {
            if (err) {
                console.error(err);
                return;
            }
            respone.end(data);
        });
        //respone.end();
   }else if(url != '/'){
       var surl = '.'+url;
       var type = surl.substr(surl.lastIndexOf(".")+1,surl.length)
       respone.writeHead(200,{'Content-type':"text/"+type});
      // respone.writeHead(200,{'Content-Type':'text/css'});
       var ns = fs.readFile(surl, function(err, data) {
           if (err) {
               console.error(err);
               return;
           }
           respone.end(data);
       });
   }
}
server.on('request',handlerequest);

server.listen(3000,function(){
    console.log("runing...");
})