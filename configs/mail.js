module.exports = {
    'mailcheck':true,
    'activationLinkLocal':'http://localhost:5000/activation/',
    'gmail' : {
        service: 'Gmail',
        auth: {
            user: 'mail@gmail.com',
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