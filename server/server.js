const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
var { User } = require('./models/user');
var { Doctor } = require('./models/doctor');
var { authenticate } = require('./middleware/authenticate');
const { mongoose } = require('./db/mongoose.js');
const cors = require('cors');
const port = 3000;
var app = express();
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static('./public'));
app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`started on port ${port}`);
});

app.post('/users', (req, res) => {
    console.log('reg');
    var body = _.pick(req.body, ['email', 'password', 'state', 'symptoms', 'name']);

    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        console.log(e);
        if (e)
            res.status(400).send(e);
    });

});

app.post('/doctors', (req, res) => {
    var body = _.pick(req.body, ['email', 'password', 'name']);
    var doctor = new Doctor(body);
    doctor.save().then(() => {
        return doctor.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(doctor);
    }).catch((e) => {
        console.log(e);
        if (e)
            res.status(400).send(e);
    });

});


//login
app.post('/usersLogin', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.send({ token, email: user.email, name: user.name });
        })
    })
        .catch((e) => {
            res.status(400).send(e);
        });
})
app.post('/doctorsLogin', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    Doctor.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.send({ token, email: user.email, name: user.name });
        })
    })
        .catch((e) => {
            res.status(400).send(e);
        });
})

//updatePatient
app.post('/updatePatient', authenticate, (req, res) => {
    
    User.findByEmail(req.body.email).then((user) => {
        var state = { active: req.active, recovered: req.recovered, deceased: req.deceased };
        user.changeState(req.body.state);
        console.log(user);
        res.status(200).send({});
    })
        .catch((e) => {
            res.status(404).send(e);
        })
})
//getPatientList
app.post('/patientList', authenticate, (req, res) => {
    var ans = [];
    var x = req.body.search;
    User.find(x).then((users) => {

        users.forEach(element => {
            var temp = {
                'name': element.name,
                'email': element.email,
                'state': element.state,
                'symptoms': element.symptoms,
                'active': element.active,
                'recovered': element.recovered,
                'deceased': element.deceased
            }
            ans.push(temp);
            
        });
        res.status(200).send(ans);
    })
        .catch((err) => {
            res.status(404).send(err);
        })
    
})
//StateList
app.get('/stateList',(req,res)=>{
    var map = stateMap();

    User.find().then((users) => {
        users.forEach(el => {
            var x = map.get(`${el.state}`);
            if(el.recovered){
                x.recovered += 1;
            }
            else if(el.active){
                x.active+= 1;
            }
            else if(el.deceased){
                x.deceased+=1;
            }
        });
        res.status(200).send([...map]);
    })
    .catch((err) => {
        res.status(404).send(err);
    })

})

//Homepage
app.get('/usersme', authenticate, (req, res) => {
    var cont = { 'name': req.user.name, 'symptoms': req.user.symptoms, 'email': req.user.email, 'state': req.user.state, 'active': req.user.active, 'recovered': req.user.recovered, 'deceased': req.user.deceased }
    res.send(cont);
});

app.get('/doctorsme', authenticate, (req, res) => {
    var cont = { 'name': req.user.name, 'email': req.user.email }
    res.send(cont);
});

app.get('/temporary', (req, res) => {
    res.send({ email: "Hello" });
})

//logout
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch((e) => res.status(400));
})

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch((e) => res.status(400));
})




//Utility Function

function stateMap(){
    var states = [
        { id:'1' , value: 'Andaman and Nicobar'},
        { id:'2',    value : 'Andhra Pradesh'    },
        { id:'3', value : 'Arunachal Pradesh' },
        { id:'4', value : 'Assam' },
        { id:'5', value : 'Bihar' },
        { id:'6' , value: 'Chandigarh'},
        { id:'7', value : 'Chhattisgarh' },
        { id:'8' , value: 'Daman and Diu'},
        { id:'9' , value: 'Dadar and Nagar Haveli'},
        { id:'10' , value: 'Delhi'},
        { id:'11', value : 'Goa' },
        { id:'12', value : 'Gujarat' },
        { id:'13', value : 'Haryana' },
        { id:'14', value : 'Himachal Pradesh' },
        { id:'15' , value: 'Jammu and Kashmir'},
        { id:'16', value : 'Jharkhand' },
        { id:'17', value : 'Karnataka' },
        { id:'18', value : 'Kerala' },
        { id:'19' , value: 'Ladakh'},
        { id:'20' , value: 'Lakshadweep'},
        { id:'21', value : 'Madhya Pradesh' },
        { id:'22', value : 'Maharashtra' },
        { id:'23', value : 'Manipur' },
        { id:'24', value : 'Meghalaya' },
        { id:'25', value : 'Mizoram' },
        { id:'26', value : 'Nagaland' },
        { id:'27', value : 'Odisha' },
        { id:'28' , value: 'Puducherry'},
        { id:'29', value : 'Punjab' },
        { id:'30', value : 'Rajasthan' },
        { id:'31', value : 'Sikkim' },
        { id:'32', value : 'TamilNadu' },
        { id:'33', value : 'Telangana' },
        { id:'34', value : 'Tripura' },
        { id:'35', value : 'Uttar Pradesh' },
        { id:'36', value : 'Uttarakhand' },
        { id:'37', value : 'West Bengal' }
      ];
    var map = new Map();
    states.forEach((el)=>{
        map.set(`${el.value}`,{'active':0,'recovered':0, 'deceased' : 0, 'id' : el.id});
    })
    
    return map;
}
