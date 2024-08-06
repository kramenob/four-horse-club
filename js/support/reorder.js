
// support/reorder.js
// Ротация элементов секции details
// Пересобирает DOM для мобильной версии.

const
	support_content = document.querySelector(".support_content"),						// контейнер содержимого
	parent_desk = document.querySelector(".support__item-lectionary"),					// версия для компьютеров
	parent_mob = parent_desk.cloneNode(true),											// версия для мобильных устройств
	lectionary__title_old = parent_mob.querySelector(".lectionary__title"),				// старый заголовок (для позиционированной вставки)
	lectionary__titles = parent_mob.querySelectorAll(".lectionary__title .h"),			// строки заголовка
	lectionary__figure = parent_mob.querySelector(".lectionary__figure")				// фигура

parent_mob.classList.remove("desk")	// убираем класс desk у клонированного контейнера
parent_mob.classList.add("mob")		// добавляем класс mob

let
	line_counter = 1 // счетчик строк для цикла

// преобразуем строки заголовка в самостоятельные блоки
lectionary__titles.forEach(title => {
	
	let lectionary__title = document.createElement("div")
	lectionary__title.classList.add("lectionary__title")
	lectionary__title.classList.add("lectionary__title_line-" + line_counter++)
	lectionary__title.appendChild(title)

	parent_mob.appendChild(lectionary__title)
})

lectionary__title_old.remove() // удаляем старый заголовок

parent_mob.insertBefore(lectionary__figure, parent_mob.querySelector(".lectionary__title_line-2"))				// вставляем картинку меж двух строк заголовка
support_content.insertBefore(parent_mob, support_content.querySelector(".support__item.support__item-session")) // вставляем весь этот блок перед блоком о сессии