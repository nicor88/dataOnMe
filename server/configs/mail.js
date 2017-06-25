module.exports = {
    'mailcheck':true,
    'activationLink':'http://localhost:5000/activation/',
    'gmail' : {
        service: 'Gmail',
        auth: {
            user: 'user@gmail.com', //TODO use env variable to load here
            pass: 'password' //TODO use env variable to load here
        }
    },
    'registrationMailEnglish':{
        from: '', // sender address
        to:'', // list of receivers
        subject: 'Activation Mail', // Subject line
        text: '', // plaintext body
        html: '' // html body
    }
};