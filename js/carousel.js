
// Карусель
// carousel.js

class Carousel {
	constructor(carousel) {
		this.wrapper = carousel
		this.navigation = this.wrapper.querySelector(".navigation")
		this.navigationType = this.wrapper.classList.contains("carousel_navigation-dots") ? "dots" : this.wrapper.classList.contains("carousel_navigation-digitals") ? "digitals" : "default"
		this.navigationCountCurrent
		this.carousel = this.wrapper.querySelector(".carousel__items")
		this.carouselItems = [...this.carousel.children]
		this.itemWidth = this.carousel.querySelector(".carousel__item").offsetWidth
		this.totalCount = this.carouselItems.length

		this.isSwiping = false
		this.isAutoScroll = this.wrapper.classList.contains("carousel_autoscroll-true") ? true : false
		this.autoScrollDelay = 4000
		this.startX = 0
		this.scrollLeftLength = 0
		this.autoScrollTimeout = null
		this.cardPerView = Math.round(this.carousel.offsetWidth / this.itemWidth)
		this.itemCurrent = this.cardPerView
		this.currentIndex = this.cardPerView

		this.mediaQueryForCardPerView_Two = window.matchMedia('(max-width: 1060px)')
		this.mediaQueryForCardPerView_One = window.matchMedia('(max-width: 720px)')

		this.init()
	}

	init() {
		this.setupNavigation()
		this.detectCurrentSlides(this.carouselItems)
		this.setupEventListeners()
		this.autoScroll()
	}

	detectCurrentSlides(targetItems) {
		switch (this.navigationType) {
			case "dots":
				for (let i = 0; i < this.cardPerView && i < targetItems.length; i++) {
					const item = targetItems[i]
					item.classList.add("current")

					console.log(item)
				}
				break
			default:
				break
		}
	}

	duplicateItems() {
		this.carouselItems.slice(-this.cardPerView).reverse().forEach(card => {
			this.carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
		});
		this.carouselItems.slice(0, this.cardPerView).forEach(card => {
			this.carousel.insertAdjacentHTML("beforeend", card.outerHTML);
		});
	}

	scrollToInitialPosition() {
		this.carousel.classList.add("no-transition");
		this.carousel.scrollLeft = this.carousel.offsetWidth;
		this.carousel.classList.remove("no-transition");
	}

	disableArrows(slides, prevButton, nextButton, targetIndex) {
		if (targetIndex === 0) {
			prevButton.classList.add("disabled");
			nextButton.classList.remove("disabled");
		} else if (targetIndex === slides.length - 1) {
			prevButton.classList.remove("disabled");
			nextButton.classList.add("disabled");
		} else {
			prevButton.classList.remove("disabled");
			nextButton.classList.remove("disabled");
		}
	}

	updateSlides(currentSlide, targetSlide) {
		currentSlide.classList.remove("current");
		targetSlide.classList.add("current");
	};
	updateDots(currentDot, targetDot) {
		currentDot.classList.remove("current");
		targetDot.classList.add("current");
	};

	setupNavigation() {
		switch (this.navigationType) {

			case "dots":

				this.navigation.appendChild(this.createButton("left", true))

				let navigation__info_dots = document.createElement("div")
				navigation__info_dots.classList.add("navigation__info", "navigation__dots", "no-touch")

				for (let i = 0; i < this.totalCount; i++) {

					let dot = document.createElement("button")
					dot.classList.add("button", "navigation__dot")
					i ? 0 : dot.classList.add("current")

					navigation__info_dots.appendChild(dot)
				}

				this.navigation.appendChild(navigation__info_dots)
				this.navigation.appendChild(this.createButton("right"))
				
				this.navigation.querySelectorAll("button").forEach(btn => {
					btn.addEventListener("click", () => {
						if (btn.id === "left") {
							this.carousel.scrollLeft -= this.itemWidth;

							let prevButton = this.wrapper.querySelector(".button_circle_back")
							let nextButton = this.wrapper.querySelector(".button_circle_next")

							let currentSlide = document.querySelector(".carousel_navigation-dots .carousel__item.current");
							let prevSlide = currentSlide.previousElementSibling;
							let currentDot = document.querySelector(".navigation__dot.current");
							let prevDot = currentDot.previousElementSibling;
							let prevIndex = this.carouselItems.findIndex((slide) => slide === prevSlide);
							this.updateDots(currentDot, prevDot);
							this.updateSlides(currentSlide, prevSlide)
							this.disableArrows(this.carouselItems, prevButton, nextButton, prevIndex);


						} else if (btn.id === "right") {
							this.carousel.scrollLeft += this.itemWidth;

							let prevButton = this.wrapper.querySelector(".button_circle_back")
							let nextButton = this.wrapper.querySelector(".button_circle_next")

							let currentSlide = document.querySelector(".carousel_navigation-dots .carousel__item.current");
							let nextSlide = currentSlide.nextElementSibling;
							let currentDot = document.querySelector(".navigation__dot.current");
							let nextDot = currentDot.nextElementSibling;
							let nextIndex = this.carouselItems.findIndex((slide) => slide === nextSlide);
							this.updateDots(currentDot, nextDot);
							this.updateSlides(currentSlide, nextSlide)
							this.disableArrows(this.carouselItems, prevButton, nextButton, nextIndex);

							

						}
					});
				});
				break;
				

			case "digitals":

				this.navigation.appendChild(this.createButton("left"))

				let navigation__info_digitals = document.createElement("div")
				navigation__info_digitals.classList.add("navigation__info", "navigation__dots", "no-touch")

				for (let i = 0; i < 3; i++) {

					let span = document.createElement("span") // Создаем новый элемент span
					span.classList.add("t", "t--size_s") // Назначаем класс новому элементу span

					switch (i) {
						case 0:
							span.classList.add("navigation__count", "navigation__count--current") // Назначаем класс новому элементу span
							span.textContent = this.itemCurrent
							break
						case 1:
							span.classList.add("t-opacity_sixty") // Назначаем класс новому элементу span
							span.textContent = "/"
							break
						case 2:
							span.classList.add("navigation__count", "navigation__count--total") // Назначаем класс новому элементу span
							span.textContent = this.totalCount
							break
						default:
							break
					}
					navigation__info_digitals.appendChild(span) // Добавляем новый элемент span в контейнер
				}

				this.navigation.appendChild(navigation__info_digitals)
				this.navigation.appendChild(this.createButton("right"))


				this.navigation.querySelectorAll("button").forEach(btn => {
					btn.addEventListener("click", () => {
						if (btn.id === "left") {
							this.carousel.scrollLeft -= this.itemWidth;
							this.moveLeft();
						} else {
							this.carousel.scrollLeft += this.itemWidth;
							this.moveRight();
						}
					});
				});

				this.carousel.addEventListener("scroll", this.infiniteScroll.bind(this));

				this.duplicateItems()
				this.scrollToInitialPosition()
				break;

			default:
				console.log("У одной из carousel не указан тип навигации. Доступные классы: carousel_navigation-dots; carousel_navigation-digitals");
				break;

		}
	}

	setupEventListeners() {
		// this.carousel.addEventListener("touchstart", this.swipeStart.bind(this));
		// document.addEventListener("touchmove", this.swiping.bind(this));
		// document.addEventListener("touchend", this.swipeStop.bind(this));
		this.carousel.addEventListener("mouseover", () => clearTimeout(this.autoScrollTimeout));
		this.carousel.addEventListener("mouseout", this.autoScroll.bind(this));
	}

	// swipeStart(e) {
	// 	this.isSwiping = true;
	// 	this.isAutoScroll = false;
	// 	this.carousel.classList.add("swiping", "no-touch");

	// 	this.startX = e.touches[0].pageX;
	// 	this.scrollLeftLength = this.carousel.scrollLeft;
	// }
	// swiping(e) {
	// 	if (!this.isSwiping) return;
	// 	this.carousel.scrollLeft = this.scrollLeftLength - (e.touches[0].pageX - this.startX);
	// }
	// swipeStop() {
	// 	this.isSwiping = false;
	// 	this.carousel.classList.remove("swiping");
	// }

	infiniteScroll() {
		if (this.carousel.scrollLeft === 0) {
			this.carousel.classList.add("no-transition");
			this.carousel.scrollLeft = this.carousel.scrollWidth - (2 * this.carousel.offsetWidth);
			this.carousel.classList.remove("no-transition");
		} else if (Math.ceil(this.carousel.scrollLeft) === this.carousel.scrollWidth - this.carousel.offsetWidth) {
			this.carousel.classList.add("no-transition");
			this.carousel.scrollLeft = this.carousel.offsetWidth;
			this.carousel.classList.remove("no-transition");
		}

		clearTimeout(this.autoScrollTimeout);
		if (!this.wrapper.matches(":hover")) this.autoScroll();
	}

	autoScroll() {
		if (!this.isAutoScroll) return;
		this.autoScrollTimeout = setTimeout(() => {
			this.carousel.scrollLeft += this.itemWidth
			this.moveRight()
		}, this.autoScrollDelay);
	}

	createButton(side, disabled) {
		let button = document.createElement("button")
		button.id = side
		button.classList.add("button", "button_circle", (side === "left") ? "button_circle_back" : "button_circle_next", disabled && "disabled")

		return button
	}
	
	moveLeft() {
		this.carousel.scrollLeft -= this.itemWidth;
		
		// Перемещаем индекс влево
		this.currentIndex = (this.currentIndex - 1);
		
		// Если индекс становится меньше 1, установите его на totalCount
		if (this.currentIndex < 1) {
			this.currentIndex = this.totalCount;
		}
		
		this.updateCurrentIndex();
	}
	
	moveRight() {
		this.carousel.scrollLeft += this.itemWidth;
		
		// Перемещаем индекс вправо
		this.currentIndex = (this.currentIndex + 1);
		
		// Если индекс превышает totalCount, установите его на 1
		if (this.currentIndex > this.totalCount) {
			this.currentIndex = 1;
		}
		
		this.updateCurrentIndex();
	}

	updateCurrentIndex() {
				document.querySelector(".navigation__count--current").textContent = this.currentIndex;
		}
}

// Создание экземпляров карусели для каждого элемента на странице
document.querySelectorAll(".carousel").forEach(carousel => {
	new Carousel(carousel);
});