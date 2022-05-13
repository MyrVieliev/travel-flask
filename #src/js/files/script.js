window.onload = function () {
	document.addEventListener('click', documentActions);
	// Actions (делегирование события click)
	function documentActions(e) {
		const targetElement = e.target;
		if (window.innerWidth > 768 && isMobile.any()) {
			if (targetElement.classList.contains('menu__arrow')) {
				targetElement.closest('.menu__item').classList.toggle('_hover');
			}
			if (targetElement.classList.contains('menu__ticket')) {
				targetElement.closest('.menu__item').classList.toggle('_hover');
			}
			if (
				!targetElement.closest('.menu__item') &&
				document.querySelectorAll('.menu__item._hover').length > 0
			) {
				_removeClasses(
					document.querySelectorAll('.menu__item._hover'),
					'_hover'
				);
			}
		}
		if (targetElement.classList.contains('search-form__icon')) {
			document.querySelector('.search-form').classList.toggle('_active');
		} else if (
			!targetElement.closest('.search-form') &&
			document.querySelector('.search-form._active')
		) {
			document.querySelector('.search-form').classList.remove('_active');
		}
		if (targetElement.classList.contains('catalog__more')) {
			getProducts(targetElement);
			e.preventDefault();
		}
		if (targetElement.classList.contains('actions-product__button')) {
			const productId = targetElement.closest('.item-product').dataset.pid;
			addToCart(targetElement, productId);
			e.preventDefault();
		}

		if (
			targetElement.classList.contains('cart-header__icon') ||
			targetElement.closest('.cart-header__icon')
		) {
			if (document.querySelector('.cart-list').children.length > 0) {
				document.querySelector('.cart-header').classList.toggle('_active');
			}
			e.preventDefault();
		} else if (
			!targetElement.closest('.cart-header') &&
			!targetElement.classList.contains('actions-product__button')
		) {
			document.querySelector('.cart-header').classList.remove('_active');
		}

		if (targetElement.classList.contains('cart-list__delete')) {
			const productId =
				targetElement.closest('.cart-list__item').dataset.cartPid;
			updateCart(targetElement, productId, false);
			e.preventDefault();
		}
	}

	// Header
	const headerElement = document.querySelector('.header');

	const callback = function (entries, observer) {
		if (entries[0].isIntersecting) {
			headerElement.classList.remove('_scroll');
		} else {
			headerElement.classList.add('_scroll');
		}
	};

	const headerObserver = new IntersectionObserver(callback);
	headerObserver.observe(headerElement);

	// Load More Products
	async function getProducts(button) {
		if (!button.classList.contains('_hold')) {
			button.classList.add('_hold');
			const file = 'json/products.json';
			let response = await fetch(file, {
				method: 'GET',
			});
			if (response.ok) {
				let result = await response.json();
				loadProducts(result);
				button.classList.remove('_hold');
				button.remove();
			} else {
				alert('Ошибка');
			}
		}
	}

	function loadProducts(data) {
		const productsItems = document.querySelector('.catalog__main');

		data.products.forEach(item => {
			const productId = item.id;
			const productUrl = item.url;
			const productImage = item.image;
			const productTitle = item.title;
			const productRating = item.rating;
			const productQuantity = item.quantity;
			const productPrice = item.price;
			const productOldPrice = item.priceOld;
			const productLabels = item.labels;

			let productTemplateStart = `<article data-pid="${productId}" class="catalog__item item-product">`;
			let productTemplateEnd = `</article>`;

			let productTemplateLabels = '';
			if (productLabels) {
				let productTemplateLabelsStart = `<div class="item-product__labels">`;
				let productTemplateLabelsEnd = `</div>`;
				let productTemplateLabelsContent = '';

				productLabels.forEach(labelItem => {
					productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
				});

				productTemplateLabels += productTemplateLabelsStart;
				productTemplateLabels += productTemplateLabelsContent;
				productTemplateLabels += productTemplateLabelsEnd;
			}

			let productTemplateImage = `
		<a href="${productUrl}" class="item-product__image _ibg">
			<img src="img/products/${productImage}" alt="${productTitle}">
		</a>
	`;

			let productTemplateBodyStart = `<div class="item-product__body">`;
			let productTemplateBodyEnd = `</div>`;

			let productTemplateContent = `
		<div class="item-product__content">
			<div class="item-product__title">${productTitle}</div>
		</div>
	`;

			let productRatingForm = `
			<div class="form">
				<div data-ajax="true" class="rating rating_set">
						<div class="rating__body">
							<div class="rating__active"></div>
							<div class="rating__items">
								<input
									type="radio"
									class="rating__item"
									value="1"
									name="rating"
								/>
								<input
									type="radio"
									class="rating__item"
									value="2"
									name="rating"
								/>
								<input
									type="radio"
									class="rating__item"
									value="3"
									name="rating"
								/>
								<input
									type="radio"
									class="rating__item"
									value="4"
									name="rating"
								/>
								<input
									type="radio"
									class="rating__item"
									value="5"
									name="rating"
								/>
							</div>
						</div>
						<div class="rating__disp">
							<div class="rating__value">${productRating}</div>
							<div class="rating__title">Ratings</div>
						</div>
				</div>
			</div>`;

			let productTemplatePrices = '';
			let productTemplatePricesQuantity = `
			<div class="quantity">
				<div class="quantity__button quantity__button_minus"></div>
				<div class="quantity__input">
					<input autocomplete="off" type="text"	name="form[]" value="1"/>
				</div>
				<div class="quantity__button quantity__button_plus"></div>
			</div>
			`;
			let productTemplatePricesStart = `<div class="item-product__prices">`;
			let productTemplatePricesCurrent = `<div class="item-product__price">Price: <span>${productPrice}</span></div>`;
			let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">${productOldPrice}</div>`;
			let productTemplatePricesEnd = `</div>`;

			productTemplatePrices = productTemplatePricesStart;
			productTemplatePrices +=
				productTemplatePricesQuantity + productTemplatePricesCurrent;
			if (productOldPrice) {
				productTemplatePrices += productTemplatePricesOld;
			}
			productTemplatePrices += productTemplatePricesEnd;

			let productTemplateActions = `
		<div class="item-product__actions actions-product">
			<div class="actions-product__body">
				<a href="" class="actions-product__button btn btn_main">Add to cart</a>
			</div>
		</div>
	`;

			let productTemplateBody = '';
			productTemplateBody += productTemplateBodyStart;
			productTemplateBody += productTemplateContent;
			productTemplateBody += productRatingForm;
			productTemplateBody += productTemplatePrices;
			productTemplateBody += productTemplateActions;
			productTemplateBody += productTemplateBodyEnd;

			let productTemplate = '';
			productTemplate += productTemplateStart;
			productTemplate += productTemplateLabels;
			productTemplate += productTemplateImage;
			productTemplate += productTemplateBody;
			productTemplate += productTemplateEnd;

			productsItems.insertAdjacentHTML('beforeend', productTemplate);
		});
	}

	// AddToCart
	function addToCart(productButton, productId) {
		if (!productButton.classList.contains('_hold')) {
			productButton.classList.add('_hold');
			productButton.classList.add('_fly');

			const cart = document.querySelector('.cart-header__icon');
			const product = document.querySelector(`[data-pid="${productId}"]`);
			const productImage = product.querySelector('.item-product__image');

			const productImageFly = productImage.cloneNode(true);

			const productImageFlyWidth = productImage.offsetWidth;
			const productImageFlyHeight = productImage.offsetHeight;
			const productImageFlyTop = productImage.getBoundingClientRect().top;
			const productImageFlyLeft = productImage.getBoundingClientRect().left;

			productImageFly.setAttribute('class', '_flyImage _ibg');
			productImageFly.style.cssText = `
			left: ${productImageFlyLeft}px;
			top: ${productImageFlyTop}px;
			width: ${productImageFlyWidth}px;
			height: ${productImageFlyHeight}px;
		`;

			document.body.append(productImageFly);

			const cartFlyLeft = cart.getBoundingClientRect().left;
			const cartFlyTop = cart.getBoundingClientRect().top;

			productImageFly.style.cssText = `
			left: ${cartFlyLeft}px;
			top: ${cartFlyTop}px;
			width: 0px;
			height: 0px;
			opacity:0;
		`;

			productImageFly.addEventListener('transitionend', function () {
				if (productButton.classList.contains('_fly')) {
					productImageFly.remove();
					updateCart(productButton, productId);
					productButton.classList.remove('_fly');
				}
			});
		}
	}

	function updateCart(productButton, productId, productAdd = true) {
		const cart = document.querySelector('.cart-header');
		const cartIcon = cart.querySelector('.cart-header__icon');
		const cartQuantity = cartIcon.querySelector('span');
		const cartProduct = document.querySelector(
			`[data-cart-pid="${productId}"]`
		);
		const cartList = document.querySelector('.cart-list');

		//Добавляем
		if (productAdd) {
			if (cartQuantity) {
				cartQuantity.innerHTML = ++cartQuantity.innerHTML;
			} else {
				cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
			}
			if (!cartProduct) {
				const product = document.querySelector(`[data-pid="${productId}"]`);
				const cartProductImage = product.querySelector(
					'.item-product__image'
				).innerHTML;
				const cartProductTitle = product.querySelector(
					'.item-product__title'
				).innerHTML;
				const cartProductContent = `
			<a href="" class="cart-list__image _ibg">${cartProductImage}</a>
			<div class="cart-list__body">
				<a href="" class="cart-list__title">${cartProductTitle}</a>
				<div class="cart-list__quantity">Quantity: <span>1</span></div>
				<a href="" class="cart-list__delete">Delete</a>
			</div>`;
				cartList.insertAdjacentHTML(
					'beforeend',
					`<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`
				);
			} else {
				const cartProductQuantity = cartProduct.querySelector(
					'.cart-list__quantity span'
				);
				cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
			}

			// После всех действий
			productButton.classList.remove('_hold');
		} else {
			const cartProductQuantity = cartProduct.querySelector(
				'.cart-list__quantity span'
			);
			cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
			if (!parseInt(cartProductQuantity.innerHTML)) {
				cartProduct.remove();
			}

			const cartQuantityValue = --cartQuantity.innerHTML;

			if (cartQuantityValue) {
				cartQuantity.innerHTML = cartQuantityValue;
			} else {
				cartQuantity.remove();
				cart.classList.remove('_active');
			}
		}
	}
};
