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
    user:String,
    pass:String
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
	  res.header("Access-Control-Allow-Origin","https://employeemanagement.nandhagopalmadd.repl.co");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});
app.post('/login', (req, res) => {
    var body=JSON.parse(req.body.body)
    var mystr ;
    EmployeeModel.findOne({user:{$eq:body.user}},function(err,data){
        if(err){
            console.log("Error: "+err)
            res.send('Error!!!')
        }else{
           
          if(data!==null){
            var mykey = crypto.createDecipher('aes-128-cbc', body.user+"@#$%^&*()");
     mystr = mykey.update(data.pass, 'hex', 'utf8')
    mystr += mykey.final('utf8');
//    console.log(mystr);
if(body.pass===mystr){
    if(body.user=='Admin'){
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
   
    res.send("Hello")
})
app.get('/GetLastId',(req,res)=>{
   
    EmployeeModel.find({}).select({"_id":0,"EmpId":1}).then((data)=>{
      var arr=[]
        data.forEach(function(obj,ind){
            arr.push(obj.EmpId)
        })
        let m=Math.max(...arr)
        console.log(m)
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
                EmployeeCerts:data.EmployeeCerts,
                EmpQualification:data.EmpQualification,
                user:data.user
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
    //console.log(mongoose.connection.readyState);
    //console.log(req.body.pass)
    var mykey = crypto.createCipher('aes-128-cbc', req.body.user+"@#$%^&*()");
    var mystr = mykey.update(req.body.pass, 'utf8', 'hex')
    mystr += mykey.final('hex');
    this.password=mystr
    //console.log(this.password)
var newEmployee= new EmployeeModel({
    EmpId:req.body.EmpId,
    EmpName:req.body.EmpName,
    EmpDesignation:req.body.EmpDesignation,
    EmpMail:req.body.EmpMail,
    EmpContactNumber:req.body.EmpContactNumber,
    EmpAddress:req.body.EmpAddress,
    EmployeeCab:req.body.EmployeeCab,
    EmployeeDQ:req.body.EmployeeDQ,
    EmployeeCerts:req.body.EmployeeCerts,
    EmpQualification:req.body.EmpQualification,
    user:req.body.user,
    pass:this.password
})
newEmployee.save(function(err,data){
        if(err){
            console.log(err)
        }else{
            res.send("Data added successfully")
        }
})
})
var port=process.env.port||3000
app.listen(port, () => console.log('API is running on http://localhost:'+port+'...'));