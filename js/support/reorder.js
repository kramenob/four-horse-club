
// Ротация элементов
// support/reorder.js



const
	support_content = document.querySelector(".support_content"),					// контейнер всей карусели
	parent_desk = document.querySelector(".support__item-lectionary"),					// контейнер всей карусели
	parent_mob = parent_desk.cloneNode(true),
	lectionary__title_old = parent_mob.querySelector(".lectionary__title"),
	lectionary__titles = parent_mob.querySelectorAll(".lectionary__title .h"),
	lectionary__figure = parent_mob.querySelector(".lectionary__figure")

parent_mob.classList.remove("desk")
parent_mob.classList.add("mob")

let
	line_counter = 1

lectionary__titles.forEach(title => {
	
	let lectionary__title = document.createElement("div")
	lectionary__title.classList.add("lectionary__title")
	lectionary__title.classList.add("lectionary__title_line-" + line_counter++)
	lectionary__title.appendChild(title)

	parent_mob.appendChild(lectionary__title)

});

lectionary__title_old.remove()
parent_mob.insertBefore(lectionary__figure, parent_mob.querySelector(".lectionary__title_line-2"))
support_content.insertBefore(parent_mob, support_content.querySelector(".support__item.support__item-session"))