
const
	desk = document.querySelectorAll(".desk"),
	mob = document.querySelectorAll(".mob"),
	details = document.querySelector(".details__items"),

	mw_1222 = window.matchMedia('(max-width: 1222px)')

const switchDeskMob = (event) => {
	if (event.matches) {
		desk.forEach(d => { d.setAttribute("style", "display: none;") });
		mob.forEach(m => { m.removeAttribute("style") });
	} else {
		desk.forEach(d => { d.removeAttribute("style") });
		mob.forEach(m => { m.setAttribute("style", "display: none;") });
	}
}

const detailsItemsCarousel = (event) => {
	if (event.matches) {
		details.classList.add("carousel__items")
	} else {
		details.classList.remove("carousel__items")
	}
}

mw_1222.addEventListener('change', switchDeskMob); switchDeskMob(mw_1222)
mw_1222.addEventListener('change', detailsItemsCarousel); detailsItemsCarousel(mw_1222)