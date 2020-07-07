const faker = require('faker');
const { mongoose } = require('../db/mongoose.js');
var { User } = require('./user');
var { Doctor } = require('./doctor');

//Uncomment below for doctor

// for(let i=0;i<10;i++){
//     var body = {
//         name : faker.name.findName(),
//         email : faker.internet.email(),
//         password : "123456"
//     }
    
//     console.log(body);
//     var doc = new Doctor(body);
//     doc.save().then(()=>{
//         console.log("successful");
//     })
//     .catch((e)=>{
//         console.log(e);
//     })
    
// }



// uncomment below for user

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

var symp = [
    "Allergies",
    "Colds and Flu",
    "Conjunctivitis",
    "Diarrhea",
    "Headaches",
    "Mononucleosis",
    "Stomach Aches",
    "Hypertension",
    "Hyperlipidemia",
    "Diabetes",
    "Back pain",
    "Anxiety",
    "Obesity",
    "Allergic rhinitis",
    "Reflux esophagitis",
    "Respiratory problems",
    "Hypothyroidism",
    "Visual refractive errors",
    "General medical exam",
    "Osteoarthritis",
    "Fibromyalgia / myositis",
    "Malaise and fatigue",
    "Pain in joint",
    "Acute laryngopharyngitis",
    "Acute maxillary sinusitis",
    "Major depressive disorder",
    "Acute bronchitis",
    "Asthma",
    "Depressive disorder",
    "Nail fungus",
    "Coronary atherosclerosis",
    "Urinary tract infection"
    ]

// for(let i=0;i<100;i++){
//     var x = Math.random();
//     var active = false;
//     var recovered = false;
//     var deceased = false;
//     if(x <=0.5)active = true;
//     else if(x<=0.9)recovered = true;
//     else deceased = true;

//     var body = {
//         name : faker.name.findName(),
//         email : faker.internet.email(),
//         password : '123456',
//         state : states[Math.floor(Math.random()*37)].value,
//         active,
//         recovered,
//         deceased,
//         symptoms : symp[Math.floor(Math.random()*symp.length)]
//     }
//     var use = new User(body);
//     use.save().then(()=>{
//         console.log("success");
//     })
//     .catch((e)=>{
//         console.log("err");
//     })
// }


