module.exports = {
    'mailcheck':true,
    'activationLink':'http://localhost:5000/activation/',
    'gmail' : {
        service: 'Gmail',
        auth: {
            user: 'user@gmail.com',
            pass: 'password'
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