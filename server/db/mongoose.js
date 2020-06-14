const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/Covid',{ 
    useNewUrlParser: true,
    useCreateIndex : true
},function(err){
    if(err) throw err;
});
module.exports = {mongoose};
