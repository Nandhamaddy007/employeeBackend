const express = require('express');
const cors = require('cors')
const bodyParser=require('body-parser')
const mongoose=require('mongoose');
var crypto=require('crypto')
const app = express();

var EmployeeSchema=new mongoose.Schema({
    EmpId:Number,
    EmpName:String,
    EmpDesignation:String,
    EmpMail:String,
    EmpContactNumber:Number,
    EmpAddress:String,
    EmployeeCab:Boolean,
    EmployeeDQ:Number,
    EmployeeCerts:String,
    EmpQualification:String,
    EmpDOB:String,
    User:String,
    Pass:String
})
var EmployeeModel= mongoose.model('EmployeeDetails',EmployeeSchema)
var loc='mongodb+srv://nandhagopal:NandhaAdmin01!@mydb.4lyfk.gcp.mongodb.net/EmployeeDatabase?retryWrites=true&w=majority'


    mongoose.connect(loc, { useNewUrlParser : true, 
        useUnifiedTopology: true }, function(error) {
            if (error) {
                console.log("Error! " + error);
               
            }
            
       
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(function(req, res, next) {
  let repl='https://employeemanagement.nandhagopalmadd.repl.co'
  let heroku="https://employeemanagementfront.herokuapp.com"
  let sand='https://3cgul.csb.app'
  let git='https://nandhamaddy007.github.io'
	  //res.header("Access-Control-Allow-Origin",heroku);
    res.header("Access-Control-Allow-Origin","*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});
app.post('/login', (req, res) => {
    var body=JSON.parse(req.body.body)
    console.log(body)
    var mystr ;
    EmployeeModel.findOne({User:{$eq:body.User}},function(err,data){
        if(err){
            console.log("Error: "+err)
            res.send('Error!!!')
        }else{
           console.log(data)
          if(data!==null){
            var mykey = crypto.createDecipher('aes-128-cbc', body.User+"@#$%^&*()");
     mystr = mykey.update(data.Pass, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    console.log("passwd:"+mystr);
if(body.Pass===mystr){
    if(body.User=='Admin'){
        res.send({token:"Admin",code:"good"})
    }else{
        res.send({token:"Employee",code:"good"})
    }
}else{
    res.send({msg:"Password is incorrect...",code:"bad"})
}
}else{
    res.send({msg:"incorrect username...!!!",code:"bad"})
}  
           
        }
    })        
    
    
});
app.get('/',(req,res)=>{
   
    res.send("Hello world")
})
app.get('/GetLastId',(req,res)=>{
   
    EmployeeModel.find({}).select({"_id":0,"EmpId":1}).then((data)=>{
      var arr=[]
        data.forEach(function(obj,ind){
            arr.push(obj.EmpId)
        })
        let m=Math.max(...arr)
        //console.log(m)
            res.send({"last":m})
    })
    
})
app.get('/Getdata',(req,res)=>{
   
    EmployeeModel.find({}).select({"_id":0,"EmpId":1,"EmpName":1,"EmpDesignation":1,"EmployeeDQ":1}).then((data)=>{
        
            res.send(data)
    })
    
})
app.get('/Getdata/:id',(req,res)=>{
  
   EmployeeModel.findOne({"EmpId":{$eq:req.params.id}},function(err,data){
       if(err){
           console.log(err)
           res.send('Error!!!')
       }else{
           if(data!==null){               
           res.send(
            {EmpId:data.EmpId,
                EmpName:data.EmpName,
                EmpDesignation:data.EmpDesignation,
                EmpMail:data.EmpMail,
                EmpContactNumber:data.EmpContactNumber,
                EmpAddress:data.EmpAddress,
                EmployeeCab:data.EmployeeCab,
                EmployeeDQ:data.EmployeeDQ,
                EmpDOB:data.EmpDOB,
                EmployeeCerts:data.EmployeeCerts,
                EmpQualification:data.EmpQualification,
                User:data.user
                }
           )
           }else{
               res.send("404 not found...")
           }
           
       }
   })
})


app.delete('/DeleteEmployee/:id',(req,res)=>{
    EmployeeModel.findOneAndRemove({"EmpId":{$eq:req.params.id}},function(err,data){
        if(err){
            console.log(err)
        }else{
            res.send("Data edeleted successfully...")
        }
    })
})

app.post('/AddEmployee',(req,res)=>{
    //console.log(req.body)
    req.body=JSON.parse(req.body.body)
    //console.log(req.body)
    var mykey = crypto.createCipher('aes-128-cbc', req.body.User+"@#$%^&*()");
    var mystr = mykey.update(req.body.Pass, 'utf8', 'hex')
    mystr += mykey.final('hex');
    this.password=mystr
    //console.log(this.password)
var newEmployee= new EmployeeModel({
    EmpId:req.body.EmpId,
    EmpName:req.body.EmpName,
    EmpDesignation:req.body.EmpDesignation,
    EmpMail:req.body.EmpMail,
    EmpDOB:req.body.EmpDOB,
    EmpContactNumber:req.body.EmpContactNumber,
    EmpAddress:req.body.EmpAddress,
    EmployeeCab:req.body.EmployeeCab,
    EmployeeDQ:req.body.EmployeeDQ,
    EmployeeCerts:req.body.EmployeeCerts,
    EmpQualification:req.body.EmpQualification,
    User:req.body.User,
    Pass:this.password
})
newEmployee.save(function(err,data){
        if(err){
            console.log(err)
        }else{
            res.send("Data added successfully")
        }
})
})
var port=process.env.port||3001
app.listen(port, () => console.log('API is running on http://localhost:'+port+'...'));