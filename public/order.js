let deleteBtnOrder = document.querySelectorAll(".delete-button-order");

for (let i = 0; i < deleteBtnOrder.length; i++) {
	deleteBtnOrder[i].addEventListener("click", () => {
		let endpoint = `/orders/${deleteBtnOrder[i].dataset.delete}`;
		fetch(endpoint, { method: "DELETE" })
			.then((response) => response.json())
			.then((data) => (window.location.href = data.redirect))
			.catch((error) => console.log(error));
	});
}
