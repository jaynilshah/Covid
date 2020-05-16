const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');

var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


const port = 3000;
var app = express();
app.use(express.static('./public'));
app.use(bodyParser.json());

app.listen(port,()=>{
    console.log(`started on port ${port}`);
});

//register

app.post('/users',(req,res)=>{
    console.log('reg');
    var body = _.pick(req.body, ['email','password']);
    var user = new User(body);
    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(user);
    }).catch((e)=>{
        console.log(e);
        if(e)
        res.status(400).send(e);
    });

});


//login
app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    
    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        })
    })
    .catch((e)=>{
        res.status(400).send(e);
    });    
})
//Homepage
app.get('/users/me', authenticate , (req,res)=>{
    res.send(req.user);
});

app.get('/temporary',(req,res)=>{
    res.send({email:"Hello"});
})

//logout
app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }).catch((e)=>res.status(400));
})
