
// carousel.js
// Обработчик адаптивности
// Вносит изменения в особых случаях, когда css mediaquery не помогают

const
	desk = document.querySelectorAll(".desk"),				// контейнера для десктопа
	mob = document.querySelectorAll(".mob"),				// контейнера для мобильного
	details = document.querySelector(".details__items"),	// контейнера под карусель details

	mw_1222 = window.matchMedia('(max-width: 1222px)')		// медиа запрос при экране меньше 1222px

// отключение / включение контейнеров для десткропа / мобильного
const switchDeskMob = (event) => {
	if (event.matches) {													// если экран удовлетворяет медиа запросу, переданому в event, то
		desk.forEach(d => { d.setAttribute("style", "display: none;") })		// отключаем десктопные контейнеры
		mob.forEach(m => { m.removeAttribute("style") })						// включаем мобильные
	} else {																// в противном случае
		desk.forEach(d => { d.removeAttribute("style") })						// включаем десктопные
		mob.forEach(m => { m.setAttribute("style", "display: none;") })			// отключаем мобильные контейнеры
	}
}

// преобразуем секцию details в карусель только при экране меньше 1222px
const detailsItems = (event) => {
	if (event.matches) {								// если экран удовлетворяет медиа запросу, переданому в event, то
		details.classList.add("carousel__items")			// добавляем класс карусели
	} else {											// в противном случае
		details.classList.remove("carousel__items")			// удаляем класс карусели
	}
}

mw_1222.addEventListener('change', switchDeskMob); switchDeskMob(mw_1222) // ждём когда экран будет меньше 1222px и проверяем в первый раз, чтобы отключать / включать десктопные / мобильные контейнер
mw_1222.addEventListener('change', detailsItems); detailsItems(mw_1222) // ждём когда экран будет меньше 1222px и проверяем в первый раз, чтобы сделать details каруселью