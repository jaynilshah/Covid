const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var DoctorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator : validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access:{
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }]

}

);

DoctorSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email']);

};



DoctorSchema.methods.generateAuthToken = function (){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(),access },"SecretKey").toString();
    
    user.tokens = user.tokens.concat([{access,token}]);
    console.log(token);
    return user.save().then(()=>{
        return token;
    });
};


DoctorSchema.methods.removeToken = function(token){
    var user = this;

    return user.update({
        $pull:{
            tokens: {token}
        }
    })
}

DoctorSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token,"SecretKey");
        
    }catch(e){
        // return new Promise((resolve,reject)=>{
        //     reject();
        // }
     
            return Promise.reject();
        
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token' : token,
        'tokens.access': 'auth'
    });
};

DoctorSchema.statics.findByCredentials = function(email,password){
    var User = this;
    
    return User.findOne({email}).then((user)=>{
      
        if(!user)
            return Promise.reject('User not Found');
        
        return new Promise((resolve,reject)=>{
            
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res)
                    resolve(user);
                else
                    reject(err);
                
            })

        })
    });
}

DoctorSchema.pre('save',function (next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            });
        });

    }else{
        next();
    }   
});

var Doctor = mongoose.model('doctor',DoctorSchema);

module.exports = {
    Doctor
}
