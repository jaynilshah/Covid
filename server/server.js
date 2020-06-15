const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
var {User} = require('./models/user');
var {Doctor} = require('./models/doctor');
var {authenticate} = require('./middleware/authenticate');
const {mongoose} = require('./db/mongoose.js');
const cors = require('cors');
const port = 3000;
var app = express();
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(express.static('./public'));
app.use(bodyParser.json());
app.listen(port,()=>{
    console.log(`started on port ${port}`);
});

app.post('/users',(req,res)=>{
    console.log('reg');
    var body = _.pick(req.body, ['email','password','state','symptoms','name']);
    
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

app.post('/doctors',(req,res)=>{
    var body = _.pick(req.body, ['email','password','name']);
    var doctor = new Doctor(body);
    doctor.save().then(()=>{
        return doctor.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(doctor);
    }).catch((e)=>{
        console.log(e);
        if(e)
        res.status(400).send(e);
    });
    
});


//login
app.post('/usersLogin',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.send({token,email:user.email,name: user.name});
        })
    })
    .catch((e)=>{
        res.status(400).send(e);
    });    
})
app.post('/doctorsLogin',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    Doctor.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.send({token,email:user.email,name: user.name});
        })
    })
    .catch((e)=>{
        res.status(400).send(e);
    });    
})
//Homepage
app.get('/usersme', authenticate , (req,res)=>{
    var cont = {'name' : req.user.name , 'symptoms' : req.user.symptoms, 'email' : req.user.email , 'state' : req.user.state, 'active': req.user.active, 'recovered' : req.user.recovered , 'deceased' : req.user.deceased }
    res.send(cont);
});

app.get('/doctorsme', authenticate , (req,res)=>{
    var cont = {'name' : req.user.name , 'email' : req.user.email }
    res.send(cont);
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

app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }).catch((e)=>res.status(400));
})
