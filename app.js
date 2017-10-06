
 var Express = require('express');
 var multer = require('multer');
 var bodyParser = require('body-parser');
 var fs = require('fs');
 var app = Express();
 var json2xls = require('json2xls');
 app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});




 var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./upload_file");
     },
     filename: function(req, file, callback) {
         callback(null, "input_file.xls");
     }
 });
  var upload = multer({
     storage: Storage
 }).array("file", 1);

 app.get("/", function(req, res) {
     res.sendFile(__dirname + "/index.html");
 });

 app.get("/get_excel", function(req,res){
     
   /* fs.readFile("upload_file/input_file.xls", function(err,data){
        if(err) throw err
        //console.log("data",data)
        res.send(data.toString());
    })*/
     res.sendFile(__dirname+"/upload_file/input_file.xls");
 });
 app.post("/file_upload", function(req, res) {
     upload(req, res, function(err) {
         if (err) {
           console.log(err)
            
             return res.end("Something went wrong!");
         }
          res.writeHead(200, { 'Content-Type': 'text/html' });
             res.write("success akshay")
         return res.end("File uploaded sucessfully!.");
     });
 });

app.post("/save_JSON",function(req,res){
    var body ='';
    req.on('data',function(data){
        body += data;
        
    }).on('end',function(){
        fs.readFile('./userData.json',function(err,data){
            if(err) throw err;
            fs.writeFile('./userData.json',body,function(error){
                if(err) throw err;
                res.end("File saved successfully!")
            })
        })
    })

});

app.get("/gen_excel",function(req,res){
    fs.readFile("./userdata.json",function(err,data){
       
       
            if(err) throw err;
            var userData = JSON.parse(data);
            for(var i=0;i<userData.length;i++){
                var json = userData[i];
                var xls = json2xls(json);
                var filename = "userdata/"+userData[i].EMPLOYEE_CODE+".xlsx";
                console.log(userData[i].EMPLOYEE_CODE)
               fs.writeFileSync(filename, json2xls(json), 'binary');
            }
        })
  
})

app.get("/user_data",function(req,res){
    console.log("received req!.")
})
 app.listen(3000, function(a) {
     console.log("Listening to port 3000");
 });