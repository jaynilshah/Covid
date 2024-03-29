const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
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
    state : {
        type : String,
        required : true,
    },
    active: {
        type: Boolean,
        default : false,
    },
    recovered: {
        type: Boolean,
        default : false,
    },
    deceased: {
        type: Boolean,
        default : false,
    },
    symptoms: {
        type: String
    },
    password: {
        type: String,
        required: true,
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

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email']);

};

UserSchema.methods.changeState = function(state) {
    var user = this;
    this.active = state.active;
    this.recovered = state.recovered;
    this.deceased = state.deceased;
    return user.save().then(()=>{
        return user;
    });
};

UserSchema.methods.addSymptoms = function(symptoms) {
    var user = this;
    user.symptoms = user.symptoms.concat(symptoms);
    return user.save().then(()=>{
        return user;
    });
};

UserSchema.methods.generateAuthToken = function (){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(),access },"SecretKey").toString();
    
    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(()=>{
        return token;
    });
};


UserSchema.methods.removeToken = function(token){
    var user = this;

    return user.update({
        $pull:{
            tokens: {token}
        }
    })
}

UserSchema.statics.findByToken = function(token) {
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

UserSchema.statics.findByCredentials = function(email,password){
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
UserSchema.statics.findByEmail = function(email,password){
    var User = this;
    
    return User.findOne({email}).then((user)=>{
      
        if(!user)
            return Promise.reject('User not Found');
        
        return Promise.resolve(user);
    });
}

UserSchema.pre('save',function (next){
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

var User = mongoose.model('user',UserSchema);

module.exports = {
    User
}
