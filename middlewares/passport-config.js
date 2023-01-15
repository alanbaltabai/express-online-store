const LocalStrategy = require("passport-local").Strategy;

function initializePassport(passport, getUserByUsername, getUserById) {
	const authenticateUser = async (username, password, done) => {
		const user = await getUserByUsername(username);
		if (user == null) {
			return done(null, false, {
				message: "Администратора с такими данными не существует.",
			});
		}

		try {
			if (password === user.password) {
				return done(null, user);
			} else {
				return done(null, false, {
					message: "Администратора с такими данными не существует.",
				});
			}
		} catch (error) {
			return done(error);
		}
	};

	passport.use(
		new LocalStrategy(
			{ usernameField: "username", passwordField: "password" },
			authenticateUser
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		return done(null, await getUserById(id));
	});
}

module.exports = { initializePassport };
