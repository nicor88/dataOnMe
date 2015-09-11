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
        var data;
        if (!req.isAuthenticated()){
            data={
                logged:false
            };
            return res.json(data);
        }else{
            var username=req.params.username;
            User.findByUsername(username,function(err,data){
                if(err){
                    res.send('error');
                }else{
                    return res.json(data);
                }
            });
        }
    },
    updateUserData: function(req, res){

    },
    updatePassword: function(req, res){

    }
};