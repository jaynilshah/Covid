const {User} = require('./../models/user');
const {Doctor} = require('./../models/doctor');


var authenticate = (req,res,next)=>{
    var token = req.header('x-auth');
    User.findByToken(token).then((user)=>{
        if(!user){
            // res.status(401).send('user not found'
            Doctor.findByToken(token).then((doc)=>{
                if(!doc){
                   return Promise.reject(); 
                }
                req.user = doc;
                req.token = token;
                next();
            })            
            return Promise.reject();
        }
        else{
            req.user = user;
            req.token= token;
            next();
        }
    }).catch((e)=>{
        res.status(401).send();
    });
}

module.exports ={
    authenticate
}