var Car = require ('./models/car');
var Refuelling = require('./models/refuelling');

var carsAPI = require('./routes/cars');
var refuellingsAPI = require('./routes/refuellings');
var userAPI = require('./routes/user');
var utilitiesAPI = require('./routes/utilities');

module.exports = function(app, passport){
    //MAIN Routes
    app.get('/', utilitiesAPI.renderHome);
    app.get('/login', utilitiesAPI.login);
    app.post('/signin',utilitiesAPI.signin);
    app.get('/signup', utilitiesAPI.signup);
    app.post('/signup', utilitiesAPI.signupPost);
    app.get('/signout', utilitiesAPI.signout);
    app.get('/isAuth', userAPI.isAuth);
    //DEFAULT ROUTE
    app.use(utilitiesAPI.default);

    //Car CRUD
    app.get('/cars', carsAPI.getCars);
    app.get('/car/:carId', carsAPI.getCar);
    app.post('/insertCar', carsAPI.insertCar);
    app.post('/updatecar/:carId', carsAPI.updateCar);
    app.post('/removecar/:carId', carsAPI.removeCar);

    //Refuelling CRUD
    app.post('/insertrefuelling',refuellingsAPI.insertRefuelling);
    app.post('/updaterefuelling/:refuellingId', refuellingsAPI.updateRefuelling);
    app.get('/lastrefuelling/:carId',refuellingsAPI.getLastRefuelling);
    app.get('/lastrefuellings/:carId',refuellingsAPI.getLastRefuellings);
    app.get('/refuellings/:carId', refuellingsAPI.getRefuellingsByCarId);
    app.get('/refuellings/years/:carId', refuellingsAPI.getYears);
    app.get('/refuellings/monthData/:carId/:monthYear', refuellingsAPI.getMonthData);
    app.get('/refuellings/statistics/:carId/:year', refuellingsAPI.getMonthsStatistics);
};