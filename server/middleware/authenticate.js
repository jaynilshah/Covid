const {User} = require('./../models/user');
const {Doctor} = require('./../models/doctor');


var authenticate = (req,res,next)=>{
    var token = req.header('x-auth');
    
    
    var doc = null || req.header('doc');
        
        User.findByToken(token).then((user)=>{
            if(!user){
                // res.status(401).send('user not found'          
                return Promise.reject();
            }
            else{
                req.user = user;
                req.token= token;
                next();
            }
        }).catch((e)=>{
            Doctor.findByToken(token).then((user)=>{
                if(!user){
                    // res.status(401).send('user not found'          
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
            // res.status(401).send();
        });
    
    
}

module.exports ={
    authenticate
}