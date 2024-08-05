
// Карусель
// carousel.js

// TODO:
//   1. Переопределение itemCurrent при изменении экрана
//   2. Увеличение / Уменьшение itemCurrent при одном перемещении элемента + / - 

class Carousel {
	constructor(carousel) {
		this.wrapper = carousel
		this.navigation = this.wrapper.querySelector(".navigation")
		this.navigationType = this.wrapper.classList.contains("carousel_navigation-dots") ? "dots" : this.wrapper.classList.contains("carousel_navigation-digitals") ? "digitals" : "default"
		this.navigationCountCurrent
		this.carousel = this.wrapper.querySelector(".carousel__items")
		this.carouselItems = [...this.carousel.children]
		this.itemWidth = this.carousel.querySelector(".carousel__item").offsetWidth

		this.isSwiping = false
		this.isAutoScroll = this.wrapper.classList.contains("carousel_autoscroll-true") ? true : false
		this.autoScrollDelay = 4000
		this.startX = 0
		this.scrollLeftLength = 0
		this.autoScrollTimeout = null
		this.cardPerView = Math.round(this.carousel.offsetWidth / this.itemWidth)

		this.init()
	}

	init() {
		this.setupNavigation()
		this.setupEventListeners()
		this.scrollToInitialPosition()
		this.autoScroll()
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

	setupNavigation() {
		switch (this.navigationType) {

			case "dots":

				this.navigation.appendChild(this.createButton("left"))

				let navigation__info_dots = document.createElement("div")
				navigation__info_dots.classList.add("navigation__info", "navigation__dots", "no-touch")
				navigation__info_dots.textContent = "- - - -"

				this.navigation.appendChild(navigation__info_dots)
				this.navigation.appendChild(this.createButton("right"))
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
							span.textContent = this.cardPerView;
							this.itemCurrent = span
							break
						case 1:
							span.classList.add("t-opacity_sixty") // Назначаем класс новому элементу span
							span.textContent = "/"
							break
						case 2:
							span.classList.add("navigation__count", "navigation__count--total") // Назначаем класс новому элементу span
							span.textContent = this.carouselItems.length;
							break
						default:
							break
					}
					navigation__info_digitals.appendChild(span) // Добавляем новый элемент span в контейнер
				}

				this.navigation.appendChild(navigation__info_digitals)
				this.navigation.appendChild(this.createButton("right"))

				
				

				this.duplicateItems()

				this.navigation.querySelectorAll("button").forEach(btn => {
					if (btn.id === "left") {
						this.moveLeft();
					} else {
						this.moveRight();
					}
				});

				break;

			default:
				console.log("У одной из carousel не указан тип навигации. Доступные классы: carousel_navigation-dots; carousel_navigation-digitals");
				break;

		}
	}

	setupEventListeners() {
		this.navigation.querySelectorAll("button").forEach(btn => {
			btn.addEventListener("click", () => {
				this.carousel.scrollLeft += btn.id === "left" ? -this.itemWidth : this.itemWidth;
			});
		});

		this.carousel.addEventListener("touchstart", this.swipeStart.bind(this));
		document.addEventListener("touchmove", this.swiping.bind(this));
		document.addEventListener("touchend", this.swipeStop.bind(this));
		this.carousel.addEventListener("scroll", this.infiniteScroll.bind(this));
		this.carousel.addEventListener("mouseover", () => clearTimeout(this.autoScrollTimeout));
		this.carousel.addEventListener("mouseout", this.autoScroll.bind(this));
	}

	swipeStart(e) {
		this.isSwiping = true;
		this.isAutoScroll = false;
		this.carousel.classList.add("swiping", "no-touch");

		this.startX = e.touches[0].pageX;
		this.scrollLeftLength = this.carousel.scrollLeft;
	}
	swiping(e) {
		if (!this.isSwiping) return;
		this.carousel.scrollLeft = this.scrollLeftLength - (e.touches[0].pageX - this.startX);
	}
	swipeStop() {
		this.isSwiping = false;
		this.carousel.classList.remove("swiping");
	}

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
			this.carousel.scrollLeft += this.itemWidth;
		}, this.autoScrollDelay);
	}

	createButton(side) {
		let button = document.createElement("button")
		button.id = side
		button.classList.add("button", "button_circle", (side === "left") ? "button_circle_back" : "button_circle_next")

		return button
	}
		
		
	
	moveLeft() {
        // Перемещение влево
        this.currentIndex = (this.currentIndex - 1 + this.itemTotal) % this.itemTotal;
        this.updateCurrentIndex();
    }
    moveRight() {
        // Перемещение вправо
        this.currentIndex = (this.currentIndex + 1) % this.itemTotal;
        this.updateCurrentIndex();
    }

	updateCurrentIndex() {
        this.itemCurrent.textContent = this.currentIndex;
    }
}

// Создание экземпляров карусели для каждого элемента на странице
document.querySelectorAll(".carousel").forEach(carousel => {
	new Carousel(carousel);
});