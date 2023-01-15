// data variables: data-category, data-product, data-delete, data-count, data-add

// Declaring variables
let date = new Date();
let year = date.getFullYear();
let searchInput = document.querySelector("#search-input");
let cartLink = document.querySelector(".cart-link");
let count = Number(cartLink.dataset.count);

let categoryLinks = document.querySelectorAll(".category-link");
let productLinks = document.querySelectorAll(".product-link");
let productContents = document.querySelectorAll(".product-content");

let smallImages = document.querySelectorAll(".small-image");
let bigImage = document.querySelector(".big-image");

let descriptionSection = document.querySelector(".description-section");
let inCartMessage = document.querySelector(".in-cart-message");
let productTitle = document.querySelector(".title");
let productPrice = document.querySelector(".price");
let deleteProductAdmin = document.querySelectorAll(".delete-product");
let addCartBtn = document.querySelectorAll(".add-cart-button");
let buyBtn = document.querySelectorAll(".buy-button");

let productsContainerShip = document.querySelector(".products-in-cart");
let selectElements = document.querySelectorAll(".count");
let removeCartItemButtons =
	document.getElementsByClassName("delete-button-cart");
let sumCheck = document.querySelector(".sum");
let totalCheck = document.querySelector(".total");
let confirmBtn = document.querySelectorAll(".confirm-button");

let wrapper = document.querySelector(".wrapper");
let wrapperCheckoutPage = document.querySelector(".wrapper-checkout-page");
let formName = document.querySelector("#form-name");
let formTelephone = document.querySelector("#form-telephone");
let formAddress = document.querySelector("#form-address");
let formMail = document.querySelector("#form-mail");
let formPayment = document.getElementsByName("payment");
let formTextarea = document.querySelector("#form-comment");
let checkoutBtn = document.querySelectorAll(".checkout-button");

function updateCheck() {
	let cartProductContainers =
		document.querySelectorAll(
			".product-in-cart"
		); /* the number of product containers in cart */
	let sum = 0;
	for (
		let i = 0, cartProductContainersLength = cartProductContainers.length;
		i < cartProductContainersLength;
		i++
	) {
		let price = parseFloat(
			cartProductContainers[i]
				.querySelector(".price-in-cart")
				.innerText.replace("тг", "")
		);
		let quantity = cartProductContainers[i].querySelector(".count").value;
		sum = sum + price * quantity;
	}
	sumCheck.innerText = sum + "тг";
	totalCheck.innerText = sum + 1000 + "тг";
}

// Placing current year in copyright in footer
document.getElementById("year").textContent = "2012 - " + year;

// Category sort in main page
for (
	let i = 0, categoryLinksLength = categoryLinks.length;
	i < categoryLinksLength;
	i++
) {
	categoryLinks[i].addEventListener("click", (e) => {
		for (let j = 0; j < categoryLinksLength; j++) {
			categoryLinks[j].classList.remove("active");
		}

		e.target.classList.add("active");

		for (
			let j = 0, productLinksLength = productLinks.length;
			j < productLinksLength;
			j++
		) {
			let clickedCategoryDataAttribute = e.target.getAttribute("data-category");
			let productDataAttribute = productLinks[j].getAttribute("data-product");

			if (
				clickedCategoryDataAttribute === productDataAttribute ||
				clickedCategoryDataAttribute === "all"
			) {
				productLinks[j].style.transform = "scale(1)";
				setTimeout(() => {
					productLinks[j].style.display = "block";
				}, 500);
			} else {
				productLinks[j].style.transform = "scale(0)";
				setTimeout(() => {
					productLinks[j].style.display = "none";
				}, 500);
			}
		}
	});
}

// Searchbar
searchInput.addEventListener("keyup", (e) => {
	let typedWords = e.target.value.toLowerCase();
	for (
		let i = 0, productContentsLength = productContents.length;
		i < productContentsLength;
		i++
	) {
		let productContent = productContents[i].textContent.toLowerCase();
		// if strings does not match indexOf returns -1
		if (productContent.indexOf(typedWords) != -1) {
			productLinks[i].style.display = "block";
		} else {
			productLinks[i].style.display = "none";
		}
	}
});

// Images changing in product page
for (
	let i = 0, smallImagesLength = smallImages.length;
	i < smallImagesLength;
	i++
) {
	smallImages[i].addEventListener("click", (e) => {
		for (let j = 0; j < smallImagesLength; j++) {
			smallImages[j].classList.remove("active-image");
		}

		e.target.classList.add("active-image");
		bigImage.src = e.target.src;
	});
}

// Adding the product to cart, changing the count of products next to a cart icon, changing button to message
for (let i = 0; i < addCartBtn.length; i++) {
	addCartBtn[i].addEventListener("click", () => {
		let productTitleValue = productTitle.innerText;
		let productPriceValue = productPrice.innerText.replace("тг", "");
		let bigImageSrc = bigImage.src.replace("http://localhost:3000/", "");
		fetch("/cart", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				productTitleValue,
				productPriceValue,
				bigImageSrc,
			}),
		})
			.then((response) => {
				response.json().then(() => {
					window.location.reload();
				});
			})
			.catch((error) => {
				console.log(error);
			});

		setTimeout(() => {
			addCartBtn[i].style.display = "none";
		}, 700);
	});
}

// Buy button handler in Product page
for (let i = 0; i < buyBtn.length; i++) {
	buyBtn[i].addEventListener("click", () => {
		let productTitleValue = productTitle.innerText;
		let productPriceValue = productPrice.innerText.replace("тг", "");
		let bigImageSrc = bigImage.src.replace("http://localhost:3000/", "");

		fetch("/cart", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				productTitleValue,
				productPriceValue,
				bigImageSrc,
				isBuyBtn: "IT IS BUY BUTTON",
			}),
		})
			.then((response) => {
				response.json().then((data) => {
					window.location.href = data.redirect;
				});
			})
			.catch((error) => {
				console.log(error);
			});
	});
}

// Deleting the product from database in product page (admin)
for (let i = 0; i < deleteProductAdmin.length; i++) {
	deleteProductAdmin[i].addEventListener("click", () => {
		let endpoint = `/${deleteProductAdmin[i].dataset.delete}`;

		fetch(endpoint, { method: "DELETE" })
			.then((response) => response.json())
			.then((data) => (window.location.href = data.redirect))
			.catch((error) => console.log(error));
	});
}

// React to quantity of items changed in cart page
for (
	let i = 0, selectElementsLength = selectElements.length;
	i < selectElementsLength;
	i++
) {
	selectElements[i].addEventListener("change", updateCheck);
}

// Removing items from cart in cart page
for (
	let i = 0, removeCartItemButtonsLength = removeCartItemButtons.length;
	i < removeCartItemButtonsLength;
	i++
) {
	removeCartItemButtons[i].addEventListener("click", (event) => {
		let parentOfTitleAndCount =
			event.target.parentElement.previousElementSibling;
		let titleInCartValue =
			parentOfTitleAndCount.querySelector(".title-in-cart").innerText;
		console.log(titleInCartValue);

		fetch("/cart", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title: titleInCartValue,
			}),
		})
			.then((response) => response.json())
			.then(() => window.location.reload())
			.catch((error) => console.log(error));

		setTimeout(() => {
			event.target.parentElement.parentElement.parentElement.remove();
			updateCheck();
		}, 700);
	});
}

// Confirming the check in cart page
for (let i = 0; i < confirmBtn.length; i++) {
	confirmBtn[i].addEventListener("click", (event) => {
		let productTitlesArray = [];
		let productQuantitiesArray = [];
		for (let i = 0; i < productsContainerShip.children.length; i++) {
			productTitlesArray.push(
				productsContainerShip.children[i].children[1].children[0].children[0]
					.innerText
			);
			productQuantitiesArray.push(
				productsContainerShip.children[i].children[1].children[0].children[1]
					.value
			);
		}

		let sumValue = sumCheck.innerText.replace("тг", "");
		let totalValue = totalCheck.innerText.replace("тг", "");
		const options = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				productTitlesArray,
				productQuantitiesArray,
				sumValue,
				totalValue,
			}),
		};

		fetch("/checkout", options)
			.then((response) => {
				response.json().then((responseData) => {
					window.location.href = responseData.redirect;
				});
			})
			.catch((error) => {
				console.log(error);
			});
	});
}

// Confirming the order in checkout page
for (let i = 0; i < checkoutBtn.length; i++) {
	checkoutBtn[i].addEventListener("click", () => {
		let formNameValue = formName.value;
		let formTelephoneValue = formTelephone.value;
		let formAddressValue = formAddress.value;
		let formMailValue = formMail.value;
		let formPaymentValue;
		formPayment.forEach((radio) => {
			if (radio.checked) {
				formPaymentValue = radio.value;
			}
		});
		let formTextareaValue = formTextarea.value;
		let hour = date.getHours(); // returns the hour (0 to 23) of a date.
		let minute = date.getMinutes(); // returns the minutes (0 to 59) of a date.
		let day = date.getDate(); // returns the day of the month (1 to 31) of a date.
		let month = date.getMonth() + 1; // returns the month (0 to 11) of a date.

		if (hour < 10) {
			hour = "0" + hour;
		}

		if (minute < 10) {
			minute = "0" + minute;
		}

		if (day < 10) {
			day = "0" + day;
		}

		if (month < 10) {
			month = "0" + month;
		}

		let createdAt = hour + ":" + minute + "/" + day + "-" + month + "-" + year;
		const options = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				formNameValue,
				formTelephoneValue,
				formAddressValue,
				formMailValue,
				formPaymentValue,
				formTextareaValue,
				createdAt,
			}),
		};

		/* fetch("/madmin", options)
			.then((response) => {
				response.json().then(() => {});
			})
			.catch((error) => {
				console.log(error);
			}); */

		if (formPaymentValue === "Оплата наличными") {
			fetch("/madmin", options)
				.then((response) => {
					response.json().then((responseData) => {
						window.location.href = responseData.redirect;
					});
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			fetch("/create-checkout-session", options)
				.then((response) => {
					response.json().then((responseData) => {
						window.location.href = responseData.redirect;
					});
				})
				.catch((error) => console.log(error));
		}
	});
}

if (count !== 0) {
	count++;
	cartLink.classList.add("zero");
}
