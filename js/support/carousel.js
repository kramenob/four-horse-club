
// Карусель
// carousel.js

// TODO:
//   1. Переопределение itemCurrent при изменении экрана
//   2. Увеличение / Уменьшение itemCurrent при одном перемещении элемента + / - 

const
	wrapper = document.querySelector(".carousel"),					// контейнер всей карусели
	navigation = document.querySelector(".carousel .navigation"),	// контейнер навигации
	carousel = document.querySelector(".carousel__items"),					// контейнер элементов карусели
	carouselItems = [...carousel.children],						// элементы карусели
	itemWidth = carousel.querySelector(".carousel__item").offsetWidth,	// ширина одного элемента карусели
	itemTotal = navigation.querySelector(".navigation__count--total").textContent = carouselItems.length; // контейнер общего количества элементов

let
	isSwiping = false,		// свитч свайпа (изначально выкл.)
	isAutoScroll = true,	// свитч автоматической прокрутки (изначально вкл.)
	autoScrollDelay = 4000,	// задержка автоматического скролла
	startX,					// начальная точка свайпинга
	scrollLeftLength,		// итоговая длина перемещения
	autoScrollTimeout,		// интервал автоматического скролла
	cardPerView = Math.round(carousel.offsetWidth / itemWidth), // количество видимых элементов на экране
	itemCurrent = navigation.querySelector(".navigation__count--current"); itemCurrent.textContent = cardPerView // контейнер текущего элемента

// дублируем последние элементы для зацикленной прокрутки (в количестве видимых элементов на экране)
carouselItems.slice(-cardPerView).reverse().forEach(card => {
	carousel.insertAdjacentHTML("afterbegin", card.outerHTML) // вставляем их последовательно друг за другом
})
// дублируем первый элемент для зацикленной прокрутки
carouselItems.slice(0, cardPerView).forEach(card => {
	carousel.insertAdjacentHTML("beforeend", card.outerHTML)
})

// @Firefox :: прокручиваем контейнер с элементами для сокрытия дублированных в начало элементов
carousel.classList.add("no-transition") // отключаем плавную прокрутку (см. css)
carousel.scrollLeft = carousel.offsetWidth
carousel.classList.remove("no-transition") // возвращаем плавную прокрутку (см. css)

// добавляем кнопкам обработчики событий
navigation.querySelectorAll("button").forEach(btn => {
	btn.addEventListener("click", () => {
		carousel.scrollLeft += btn.id == "left" ? -itemWidth : itemWidth // определяем направление кнопкам (если id "left", то сколлить будем в минус (влево))
	})
})

// свайп функции
const swipeStart = (e) => {
	isSwiping = true						// включаем свайпинг
	isAutoScroll = false					// отключаем автоматический скроллинг
	carousel.classList.add("swiping", "no-touch")		// добавляем класс "swiping" контейнеру карусели
	
	startX = e.touches[0].pageX				// определяем начальную точку пальца пользователя
	scrollLeftLength = carousel.scrollLeft	// определяем итоговую длину пермещения
}
const swiping = (e) => {
	if(!isSwiping) return													// пропускаем это, если свайпинг отключён (isSwiping = false)
	carousel.scrollLeft = scrollLeftLength - (e.touches[0].pageX - startX)	// перемещаем карусель в соответсвие с стартовой и конечной точкой пальца
}
const swipeStop = () => {
	isSwiping = false						// свайп отключаем
	carousel.classList.remove("swiping")	// удаляем с контейнера карусели вспомогательный класс свайпа "swiping"
}

// зацикленная прокрутка
const infiniteScroll = () => {
	if (carousel.scrollLeft === 0) {																// если карусель в начале - скроллим до конца
		carousel.classList.add("no-transition")															// отключаем плавную прокрутку (см. css)
		carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth)							// определяем длину прокрутки вперёд
		carousel.classList.remove("no-transition")														// возвращаем плавную прокрутку (см. css)
	} else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {	// если карусель в конце - скроллим до начала
		carousel.classList.add("no-transition")															// отключаем плавную прокрутку (см. css)
		carousel.scrollLeft = carousel.offsetWidth														// определяем длину прокрутки назад
		carousel.classList.remove("no-transition")														// возвращаем плавную прокрутку (см. css)
	}

	clearTimeout(autoScrollTimeout)				// очищаем таймаут для отключения автопрокрутки
	if(!wrapper.matches(":hover")) autoScroll()	// если курсора на карусели нет, то она в автопрокрутке
}

// функция автоматической прокрутки
const autoScroll = () => {
	if(!isAutoScroll) return // пропускаем это, если автоматическая прокрутка отключена (isAutoScroll = false)
	autoScrollTimeout = setTimeout(() => carousel.scrollLeft += itemWidth, autoScrollDelay) // автоматически прокручиваем карусель с интервалом в autoScrollDelay
}

// ожидаем действий (обработчики событий)
carousel.addEventListener("touchstart", swipeStart)	// свайп :: клик мыши в области карусели
document.addEventListener("touchmove",  swiping)	// свайп :: перемещение зажатой мыши
document.addEventListener("touchend",   swipeStop)	// свайп :: отклик мыши

carousel.addEventListener("scroll", infiniteScroll)	// зацикленная прокрутка

carousel.addEventListener("mouseover", () => clearTimeout(autoScrollTimeout))	// автопрокрутка :: мышь в области карусели - остановить автопрокрутку, отключив таймаут
carousel.addEventListener("mouseout", autoScroll)								// автопрокрутка :: мышь вне области карусели - запустить автопрокрутку