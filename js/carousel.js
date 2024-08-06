
// carousel.js
// Карусель

// Находит карусели на странице по классу "carousel" и создаёт карусель.
// Вспомогательные классы:
//     .carousel_navigation-dots :: навиция будет точками
//     .carousel_navigation-digitals :: навиция будет цифрами
//     .carousel_autoscroll-true :: включит автоматическую прокрутку

// Теги: #костыль, #заметка

class Carousel {
	constructor(carousel) {

		// интервал автоматической прокрутки (1000 = 1 секунда)
		this.autoScrollDelay = 4000

		this.wrapper = carousel																			// контейнер всей карусели
		this.navigation = this.wrapper.querySelector(".navigation")										// контейнер навигации
		this.navigationType = this.wrapper.classList.contains("carousel_navigation-dots") ? "dots" : this.wrapper.classList.contains("carousel_navigation-digitals") ? "digitals" : "default" // тип навигации (точки, цифры, ...)
		this.carousel = this.wrapper.querySelector(".carousel__items")									// контейнер элементов карусели
		this.carouselItems = [...this.carousel.children]												// список html элементов карусели
		this.itemWidth = this.carousel.querySelector(".carousel__item").offsetWidth						// ширина одного элемента карусели
		this.totalCount = this.carouselItems.length														// сумарное количество элементов
		this.isSwiping = false																			// свитч свайпа (изначально выкл.)
		this.isAutoScroll = this.wrapper.classList.contains("carousel_autoscroll-true") ? true : false	// свитч автоматической прокрутки
		this.startX = 0																					// начальная точка свайпинга
		this.scrollLeftLength = 0																		// итоговая длина перемещения
		this.autoScrollTimeout = null																	// интервал автоматического скролла
		this.cardPerView = Math.round(this.carousel.offsetWidth / this.itemWidth)						// количество видимых элементов на экране
		this.itemCurrent = this.cardPerView																// текущее видимое количество элементов
		this.currentIndex = this.cardPerView															// стартовый индекс элемнтов

		// запуск функций по умолчанию
		this.init()

	}

	// функции по умолчанию
	init() {
		this.setupNavigation()							// создаём навигацию
		this.detectCurrentSlides(this.carouselItems)	// определяем текущие видимые элементы
		this.setupEventListeners()						// создаём обработчиков событий
		this.autoScroll()								// запускаем автоматический скролл (если включен)
	}

	// определение текущих видимых элементов в DOM
	detectCurrentSlides(targetItems) {
		switch (this.navigationType) {													// для типов навигации
			case "dots":																	// точки
				for (let i = 0; i < this.cardPerView && i < targetItems.length; i++) {			// для первых элементов в количестве видимых на экране
					targetItems[i].classList.add("current")										// назначаем класс "current"
				}
				break
			default:
				break
		}
	}

	// дублирование элементов для зацикленности
	duplicateItems() {
		this.carouselItems.slice(-this.cardPerView).reverse().forEach(card => { // дублируем элементы в количестве текущих видимых из конца списка
			this.carousel.insertAdjacentHTML("afterbegin", card.outerHTML) // и вставляем их в начало
		})
		this.carouselItems.slice(0, this.cardPerView).forEach(card => { // дублируем элементы в количестве текущих видимых из начала списка
			this.carousel.insertAdjacentHTML("beforeend", card.outerHTML) // и вставляем их в конец
		})
	}

	// прокрутка к исходному положению после дублирования
	scrollToInitialPosition() {
		this.carousel.classList.add("no-transition") // убираем возможность эфектов (см. css)
		this.carousel.scrollLeft = this.carousel.offsetWidth // скроллим
		this.carousel.classList.remove("no-transition") // возвращаем возможность эфектов (см. css)
	}

	// отключение кнопок навигации
	disableButtons(slides, prevButton, nextButton, targetIndex) {
		if (targetIndex === 0) {							// если текущий элемент - первый, то:
			prevButton.classList.add("disabled")				// отключаем кнопку "назад"
			nextButton.classList.remove("disabled")				// как минимум, включаем кнопку "вперед"
		} else if (targetIndex === slides.length - 1) {		// если текущий элемент - последний, то:
			prevButton.classList.remove("disabled")				// как минимум, включаем кнопку "назад"
			nextButton.classList.add("disabled")				// отключаем кнопку "вперед"
		} else {											// в остальных случаях:
			prevButton.classList.remove("disabled")				// включаем и кнопку "назад"
			nextButton.classList.remove("disabled")				// включаем и кнопку "вперед"
		}
	}

	// переключение меж текущими элементами
	updateCurrent(current, target) {
		current.classList.remove("current") // убираем класс с текущего элемента
		target.classList.add("current") // назначаем класс целевому элементу
	}

	// создание навигации
	setupNavigation() {
		switch (this.navigationType) { // для типов навигации

			case "dots": // точки

				// добавим кнопку "назад" (отключим сразу)
				this.navigation.appendChild(this.createButton("left", true))

				// создадим контейнер для точек
				let navigation__info_dots = document.createElement("div")
				navigation__info_dots.classList.add("navigation__info", "navigation__dots", "no-touch")

				// создадим точки в количестве элементов карусели
				for (let i = 0; i < this.totalCount; i++) {
					let dot = document.createElement("button")
					dot.classList.add("button", "navigation__dot")
					i ? 0 : dot.classList.add("current") // первую точку определим текущей (#костыль)
					navigation__info_dots.appendChild(dot)
				}

				// вставим точки в основной контейнер навигации 
				this.navigation.appendChild(navigation__info_dots)

				// добавим кнопку "вперед"
				this.navigation.appendChild(this.createButton("right"))
				
				// добавим обработчики событий кнопкам
				this.navigation.querySelectorAll("button").forEach(btn => {
					let prevButton = this.wrapper.querySelector(".button_circle_back") // определим кнопку "назад"
					let nextButton = this.wrapper.querySelector(".button_circle_next") // определим кнопку "вперед"
					btn.addEventListener("click", () => {																	// по клику
						if (btn.id === "left") {																				// на кнопку "назад":
							this.carousel.scrollLeft -= this.itemWidth																// пролистаем на один элемент назад
							let currentSlide = document.querySelector(".carousel_navigation-dots .carousel__item.current")			// переопределим текущий элемент
							let prevSlide = currentSlide.previousElementSibling														// переопределим предшествующий элемент
							let currentDot = document.querySelector(".navigation__dot.current")										// переопределим текущую точку
							let prevDot = currentDot.previousElementSibling															// переопределим предшествующию точку
							let prevIndex = this.carouselItems.findIndex((slide) => slide === prevSlide)							// переопределим индекс предшествующего элемента
							this.updateCurrent(currentDot, prevDot)																	// обновим точки на UI
							this.updateCurrent(currentSlide, prevSlide)																// обновим элементы
							this.disableButtons(this.carouselItems, prevButton, nextButton, prevIndex)								// перепроверим кнопки
						} else if (btn.id === "right") {																		// на кнопку "вперед":
							this.carousel.scrollLeft += this.itemWidth																// пролистаем на один элемент вперед
							let currentSlide = document.querySelector(".carousel_navigation-dots .carousel__item.current")			// переопределим текущий элемент
							let nextSlide = currentSlide.nextElementSibling															// переопределим последующий элемент
							let currentDot = document.querySelector(".navigation__dot.current")										// переопределим текущую точку
							let nextDot = currentDot.nextElementSibling																// переопределим последующую точку
							let nextIndex = this.carouselItems.findIndex((slide) => slide === nextSlide)							// переопределим индекс последующего элемента
							this.updateCurrent(currentDot, nextDot)																	// обновим точки на UI
							this.updateCurrent(currentSlide, nextSlide)																// обновим элементы
							this.disableButtons(this.carouselItems, prevButton, nextButton, nextIndex)								// перепроверим кнопки
						}
					})
				})
				break

			case "digitals": // цифры

				// добавим кнопку "назад"
				this.navigation.appendChild(this.createButton("left")) // 

				// создадим контейнер для цифр
				let navigation__info_digitals = document.createElement("div")
				navigation__info_digitals.classList.add("navigation__info", "navigation__dots", "no-touch")

				// создадим контейнеры цифрам (цифра текущего слайда, слэш, цифра всего элементов)
				for (let i = 0; i < 3; i++) {

					// создадим контейнер
					let span = document.createElement("span")
					span.classList.add("t", "t--size_s")

					// доработаем контейнеры индивидуально
					switch (i) {
						case 0: // первый контейнер (текущий элемент)...
							span.classList.add("navigation__count", "navigation__count--current") // назначим классы
							span.textContent = this.itemCurrent // вставим цифру
							break
						case 1: // второй контейнер (слэш)...
							span.classList.add("t-opacity_sixty") // назначим класс
							span.textContent = "/" // вставим слэш
							break
						case 2: // третий контейнер (всего элементов)...
							span.classList.add("navigation__count", "navigation__count--total") // назначим классы
							span.textContent = this.totalCount // вставим цифру
							break
						default:
							break
					}

					navigation__info_digitals.appendChild(span)
				}

				// вставим цифры в основной контейнер навигации
				this.navigation.appendChild(navigation__info_digitals)

				// добавим кнопку "вперед"
				this.navigation.appendChild(this.createButton("right"))

				// добавим обработчики событий кнопкам
				this.navigation.querySelectorAll("button").forEach(btn => { // 
					btn.addEventListener("click", () => {// по клику
						if (btn.id === "left") {// на кнопку "назад":
							this.carousel.scrollLeft -= this.itemWidth // пролистаем на один элемент назад
							this.decreaseCurrentCount() // уменьшим цифру текущего элемента
						} else if (btn.id === "right") { // на кнопку "вперед":
							this.carousel.scrollLeft += this.itemWidth // пролистаем на один элемент вперед
							this.increaseCurrentCount() // увеоичим цифру текущего элемента
						}
					})
				})

				this.carousel.addEventListener("scroll", this.infiniteScroll.bind(this)) // закливаем прокрутку

				this.duplicateItems() // дублируем элементы
				this.scrollToInitialPosition() // возвращаем в исходное положение
				break

			default: // для остального
				console.log("У одной из carousel не указан тип навигации. Доступные классы: carousel_navigation-dots; carousel_navigation-digitals") // сообщение оставим
				break
		}
	}

	// настроим обработчики событий
	setupEventListeners() {
		// для десктопа
		this.carousel.addEventListener("mouseover", () => clearTimeout(this.autoScrollTimeout)) // когда мышь в зоне карусели - отключаем автоматический скроллинг
		this.carousel.addEventListener("mouseout", () => this.autoScroll()) // когда мышь вне зоны карусели - запускаем автоматический скроллинг
		
		// для мобильных
		// this.carousel.addEventListener("touchstart", this.swipeStart.bind(this)) // свайп :: тапнули в области карусели
		// document.addEventListener("touchmove", this.swiping.bind(this)) // свайп :: драгджим пальцем
		// document.addEventListener("touchend", this.swipeStop.bind(this)) // свайп :: убрали палец
		
		this.carousel.addEventListener("touchstart", () => clearTimeout(this.autoScrollTimeout)) // когда палец тапнули в зоне карусели - отключаем автоматический скроллинг
		this.carousel.addEventListener("touchend", () => this.autoScroll()) // когда палец убрали - запускаем автоматический скроллинг (#заметка :: работает через жопу, найти решение лучше)
	}

	// свайп функции
	// swipeStart(e) {																				// начало свайпа
	// 	this.isSwiping = true																		// включаем свайпинг
	// 	this.isAutoScroll = false																	// отключаем автоматический скроллинг
	// 	this.carousel.classList.add("swiping", "no-touch")											// добавляем класс "swiping" контейнеру карусели
	// 	this.startX = e.touches[0].pageX															// определяем начальную точку пальца пользователя
	// 	this.scrollLeftLength = this.carousel.scrollLeft											// определяем итоговую длину пермещения
	// }
	// swiping(e) {																				// сам свайп
	// 	if (!this.isSwiping) return																	// пропускаем это, если свайпинг отключён (isSwiping = false)
	// 	this.carousel.scrollLeft = this.scrollLeftLength - (e.touches[0].pageX - this.startX)		// перемещаем карусель в соответсвие с стартовой и конечной точкой пальца
	// }
	// swipeStop() {																				// конец свайпа
	// 	this.isSwiping = false																		// свайп отключаем
	// 	this.carousel.classList.remove("swiping")													// удаляем с контейнера карусели вспомогательный класс свайпа "swiping"
	// }

	// зацикленная прокрутка
	infiniteScroll() {
		if (this.carousel.scrollLeft === 0) {																			// если карусель вначале - скроллим до конца
			this.carousel.classList.add("no-transition")																	// отключаем плавную прокрутку (см. css)
			this.carousel.scrollLeft = this.carousel.scrollWidth - (2 * this.carousel.offsetWidth)							// определяем длину прокрутки вперёд
			this.carousel.classList.remove("no-transition")																	// возвращаем плавную прокрутку (см. css)
		} else if (Math.ceil(this.carousel.scrollLeft) === this.carousel.scrollWidth - this.carousel.offsetWidth) {		// если карусель вконце - скроллим до начала
			this.carousel.classList.add("no-transition")																	// отключаем плавную прокрутку (см. css)
			this.carousel.scrollLeft = this.carousel.offsetWidth															// определяем длину прокрутки назад
			this.carousel.classList.remove("no-transition")																	// возвращаем плавную прокрутку (см. css)
		}

		clearTimeout(this.autoScrollTimeout)					// очищаем таймаут для отключения автопрокрутки
		if (!this.wrapper.matches(":hover")) this.autoScroll()	// если курсора на карусели нет, то она в автопрокрутке
	}

	// автоматический скролл
	autoScroll() {
		if (!this.isAutoScroll) return // пропускаем, если isAutoScroll = false
		this.autoScrollTimeout = setTimeout(() => { // автоматически прокручиваем карусель с интервалом в autoScrollDelay
			this.carousel.scrollLeft += this.itemWidth // пролистаем на один элемент вперед
			this.increaseCurrentCount() // увеличиваем цифру текущего элемента (#костыль, #заметка :: стоит установить связь между элементов и счётчиком)
		}, this.autoScrollDelay)
	}

	// создание кнопки (сторона=[left или right], отлючённость=[true или ничего])
	createButton(side, disabled) {
		let button = document.createElement("button")
		button.id = side
		button.classList.add("button", "button_circle", (side === "left") ? "button_circle_back" : "button_circle_next", disabled && "disabled")
		return button
	}

	// уменьшение цифры текущего элемента
	decreaseCurrentCount() {
		this.carousel.scrollLeft -= this.itemWidth // пролистаем на один элемент назад
		this.currentIndex = (this.currentIndex - 1) // уменьшаем текущий индекс
		if (this.currentIndex < 1) { // если индекс меньше 0, то
			this.currentIndex = this.totalCount // возвращаем его до всего элементов
		}
		this.updateCurrentIndex() // обновляем значение текущего элемента в DOM
		this.autoScroll() // принудительно запускаем автоскролл повторно, для мобильных тыков пальцем (#костыль)
	}

	// увеличение цифры текущего элемента
	increaseCurrentCount() {
		this.carousel.scrollLeft += this.itemWidth // пролистаем на один элемент вперед
		this.currentIndex = (this.currentIndex + 1) // увелицим текущий индекс
		if (this.currentIndex > this.totalCount) { // если индекс доходит до крайнего элемента
			this.currentIndex = 1 // возвращаем его до 1
		}
		this.updateCurrentIndex() // обновляем значение текущего элемента в DOM
		this.autoScroll() // принудительно запускаем автоскролл повторно, для мобильных тыков пальцем (#костыль)
	}

	// обновление цифры текущего элемента
	updateCurrentIndex() {
		document.querySelector(".navigation__count--current").textContent = this.currentIndex // вписываем текущий индекс в контейнер
	}
}

// создаем карусель для каждого блока с соответствующим классом
document.querySelectorAll(".carousel").forEach(carousel => {
	new Carousel(carousel)
})