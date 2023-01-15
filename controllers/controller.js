const passport = require("passport");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { initializePassport } = require("../middlewares/passport-config");
const { Admin } = require("../models/admin");
const { Product } = require("../models/product");
const { Cart } = require("../models/cart");
const { Check } = require("../models/check");
const { Order } = require("../models/order");

initializePassport(
	passport,
	async (username) => {
		const adminFound = await Admin.findOne({ username });
		return adminFound;
	},
	async (id) => {
		const adminFound = await Admin.findOne({ _id: id });
		return adminFound;
	}
);

const admin_get = (request, response) => {
	Order.find()
		.sort({ createdAt: -1 })
		.then((result) => {
			response.render("madmin", {
				orders: result,
				headTitle: "Админ",
			});
		})
		.catch((error) => {
			console.log(error);
		});
};

const checkout2 = (request, response) => {
	response.render("checkout2", { headTitle: "Удачная покупка" });
};

const admin_post = async (request, response) => {
	const checks = await Check.find();
	const order = new Order({
		name: request.body.formNameValue,
		telephone: request.body.formTelephoneValue,
		address: request.body.formAddressValue,
		mail: request.body.formMailValue,
		payment: request.body.formPaymentValue,
		comment: request.body.formTextareaValue,
		check: checks[checks.length - 1]._id,
		createdAt: request.body.createdAt,
	});

	if (request.body.formPaymentValue === "Оплата наличными") {
		order
			.save()
			.then(() => {
				response.json({ redirect: "/checkout2" });
			})
			.catch((error) => {
				console.log(error);
			});

		Cart.deleteMany({})
			.then(() => {})
			.catch((error) => {
				console.log(error);
			});
	}
};

const checkout_session = async (request, response) => {
	try {
		const checks = await Check.find();
		const productTitlesArray = checks[checks.length - 1].productTitlesArray;
		const productQuantitiesArray =
			checks[checks.length - 1].productQuantitiesArray;

		let result = [];
		for (let i = 0; i < productTitlesArray.length; i++) {
			const product = await Product.findOne({ title: productTitlesArray[i] });
			result.push({
				name: productTitlesArray[i],
				quantity: productQuantitiesArray[i],
				price: product.price,
			});
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			line_items: result.map((item) => {
				return {
					price_data: {
						currency: "kzt",
						product_data: {
							name: item.name,
						},
						unit_amount: parseFloat(item.price) * 100,
					},
					quantity: item.quantity,
				};
			}),
			success_url: `${process.env.SERVER_URL}/checkout2`,
			cancel_url: `${process.env.SERVER_URL}/checkout`,
		});

		response.json({ redirect: session.url });

		const order = new Order({
			name: request.body.formNameValue,
			telephone: request.body.formTelephoneValue,
			address: request.body.formAddressValue,
			mail: request.body.formMailValue,
			payment: request.body.formPaymentValue,
			comment: request.body.formTextareaValue,
			check: checks[checks.length - 1]._id,
			createdAt: request.body.createdAt,
		});

		if (request.body.formPaymentValue === "Оплата картой") {
			order
				.save()
				.then(() => {
					response.json({});
				})
				.catch((error) => {
					console.log(error);
				});

			Cart.deleteMany({})
				.then(() => {})
				.catch((error) => {
					console.log(error);
				});
		}
	} catch (error) {
		console.log(error);
	}
};

const log_admin_get = (request, response) => {
	response.render("logadmin", { headTitle: "Логин" });
};

const log_admin_post = passport.authenticate("local", {
	successRedirect: "/madmin",
	failureRedirect: "/logadmin",
	failureFlash: true,
});

const admin_delete = (request, response) => {
	request.logOut();
	response.redirect("/");
};

const product_create_get = (request, response) => {
	response.render("create", { headTitle: "Добавить продукт" });
};

const product_create_post = async (request, response) => {
	const products = await Product.find();
	let found = false;
	for (let i = 0; i < products.length; i++) {
		if (products[i].title === request.body.title) {
			found = true;
			response.redirect("/");
			break;
		}
	}

	if (found === false) {
		let productImages = [];
		for (let i = 0; i < request.files.length; i++) {
			productImages[i] = request.files[i].filename;
		}
		const product = new Product({
			title: request.body.title,
			category: request.body.category,
			price: request.body.price,
			images: productImages,
		});

		product
			.save()
			.then(() => {
				response.redirect("/");
			})
			.catch((error) => {
				response.render("create", { errorMessage: error });
			});
	}
};

const cart = (request, response) => {
	Cart.find()
		.then((result) => {
			response.render("cart", { items: result, headTitle: "Корзина" });
		})
		.catch((error) => {
			console.log(error);
		});
};

const cart_product_delete = (request, response) => {
	const title = request.body.title;
	Cart.deleteOne({ title })
		.then(() => {
			response.json({});
		})
		.catch((error) => {
			console.log(error);
		});
};

const product_add_cart = async (request, response) => {
	const product = await Product.findOne({
		title: request.body.productTitleValue,
	});
	if (request.body.productPriceValue !== product.price) {
		request.body.productPriceValue = product.price;
	}
	const items = await Cart.find();
	const item = new Cart({
		title: request.body.productTitleValue,
		price: request.body.productPriceValue,
		image: request.body.bigImageSrc,
	});
	const saveAndRedirect = () => {
		item
			.save()
			.then(() => {
				response.json({ redirect: "/cart" });
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const saveAndStay = () => {
		item
			.save()
			.then(() => {
				response.json({});
			})
			.catch((error) => {
				console.log(error);
			});
	};
	// if cart is not empty
	if (items.length !== 0) {
		// if buy button pressed
		if (request.body.isBuyBtn === "IT IS BUY BUTTON") {
			// if item is in cart
			let inCart = false;
			for (let i = 0; i < items.length; i++) {
				if (items[i].title === request.body.productTitleValue) {
					inCart = true;
					response.json({ redirect: "/cart" });
					break;
				}
			} // if item is not in cart
			if (inCart !== true) {
				saveAndRedirect();
			}
		} // if not buy button pressed
		else if (request.body.isBuyBtn !== "IT IS BUY BUTTON") {
			saveAndStay();
		}
	} // if cart is empty
	else if (items.length === 0) {
		// if buy button pressed
		if (request.body.isBuyBtn === "IT IS BUY BUTTON") {
			saveAndRedirect();
		} //  if not buy button pressed
		else {
			saveAndStay();
		}
	}
};

const product_get = async (request, response) => {
	const cartArray = await Cart.find();
	const products = await Product.find();
	let found = false;
	for (let i = 0; i < products.length; i++) {
		if (products[i].title === request.params.title) {
			found = true;
			response.render("product", {
				product: products[i],
				viewProductDeleteBtn: request.isAuthenticated(),
				items: cartArray,
				headTitle: request.params.title,
			});
			break;
		}
	}
	if (found !== true) {
		response.status(404).render("404", { headTitle: "Страница не найдена" });
	}
};

const product_delete = (request, response) => {
	const title = request.params.title;
	Product.deleteOne({ title })
		.then(() => {
			response.json({ redirect: "/" });
		})
		.catch((error) => {
			console.log(error);
		});

	Cart.deleteOne({ title })
		.then()
		.catch((error) => {
			console.log(error);
		});
};

const checkout = async (request, response) => {
	const cartArray = await Cart.find();
	Check.find()
		.then((result) => {
			response.render("checkout", {
				checks: result,
				items: cartArray,
				headTitle: "Покупка",
			});
		})
		.catch((error) => {
			console.log(error);
		});
};

const checkout_post = async (request, response) => {
	let sumValue = 0,
		totalValue = 0;

	for (let i = 0; i < request.body.productTitlesArray.length; i++) {
		const product = await Product.findOne({
			title: request.body.productTitlesArray[i],
		});
		sumValue =
			sumValue + product.price * request.body.productQuantitiesArray[i];
	}
	totalValue = sumValue + 1000;

	const check = new Check({
		sumValue,
		totalValue,
		productTitlesArray: request.body.productTitlesArray,
		productQuantitiesArray: request.body.productQuantitiesArray,
	});

	check
		.save()
		.then(() => {
			response.json({ redirect: "/checkout" });
		})
		.catch((error) => {
			console.log(error);
		});
};

const order_get = (request, response) => {
	Order.findOne({ _id: request.params._id })
		.populate("check")
		.then((result) => {
			response.render("orders/order", { order: result, headTitle: "Заказ" });
		})
		.catch((error) => {
			console.log(error);
		});
};

const order_delete = async (request, response) => {
	const order = await Order.findOne({ _id: request.params._id });
	Order.deleteOne({ _id: request.params._id })
		.then(() => {
			response.json({ redirect: "/madmin" });
		})
		.catch((error) => {
			console.log(error);
		});

	Check.deleteOne({ _id: order.check })
		.then(() => {})
		.catch((error) => {
			console.log(error);
		});
};

const index = async (request, response) => {
	const cartArray = await Cart.find();
	Product.find()
		.then((result) => {
			response.render("index", {
				products: result,
				categoriesArray: [],
				items: cartArray,
				headTitle: "Главная",
			});
		})
		.catch((error) => {
			console.log(error);
		});
};

module.exports = {
	admin_get,
	admin_post,
	checkout_session,
	log_admin_get,
	log_admin_post,
	admin_delete,
	product_get,
	product_create_get,
	product_create_post,
	product_delete,
	cart,
	cart_product_delete,
	product_add_cart,
	checkout,
	checkout_post,
	checkout2,
	order_get,
	order_delete,
	index,
};
