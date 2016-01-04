
var signOutModule = require('./signOut');

module.exports = function (app)	{
	app.get('/signOut', signOutModule.signOut);
};
