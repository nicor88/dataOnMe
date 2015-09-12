module.exports = {
    generateEnglishRegistrationMail: function(username,activationlink){
        var body=" Dear "+username+", <br>"
        body +="we are really happy that you registered on DataOnMe, click on the following linkt to activate your account:<br>";
        body +="<a href='"+activationlink +"'>Activation link </a> <br> Thanks by DataOnMe"
        return body;
    }
};