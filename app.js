if (process.env.NODE_ENV !== 'production') {
	let dotenv = require('dotenv').config();
	let dotenvExpand = require('dotenv-expand');
	dotenvExpand.expand(dotenv);
}

// exporting packages
const path = require('path');
const passport = require('passport');
const routes = require('./routes/routes');
const orderRoutes = require('./routes/orderRoutes');
const mongoose = require('mongoose');
const express = require('express'); // exports function
const favicon = require('serve-favicon');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

// returning an express object
const app = express(); // returns object

// registering view engine
app.set('view engine', 'ejs');

// middlewares & static files
app.use(express.static('public'));
app.use(
	favicon(path.join(__dirname, 'public', 'images', 'icons', 'favicon.ico'))
);
app.use(flash());
app.use(
	session({
		secret: 'secret',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// connecting to mongodb & listenning for requests
const PORT = 8000;
mongoose
	.connect(process.env.dbURI || PORT, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		family: 4,
	})
	.then(() =>
		app.listen(process.env.dbURI || PORT, () => {
			console.log(
				'Diploma project has been started on port ' + process.env.dbURI ||
					PORT + '.'
			);
		})
	)
	.catch((error) => console.log(error));

// handling routes
app.use('/', routes);
app.use('/orders', orderRoutes);

// handling 404 page
app.use((request, response) => {
	response.status(404).render('404', { headTitle: '404' });
});
