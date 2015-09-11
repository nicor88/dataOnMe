var User = require ('../models/user');
module.exports = {
    isAuth:  function(req, res){
        var data;
        if (!req.isAuthenticated()){
            data={
                logged:false
            };
            return res.json(data);
        }else{
            data={
                logged:true
            };
            return res.json(data);
        }
    },
    getUserData:function(req, res){

    },
    updateUserData: function(req, res){

    },
    updatePassword: function(req, res){

    }
};