
// ticker/ticker.js
// БЕГУЩАЯ СТРОКА :: section ticker
// Из перечня фраз делает блок бегущей строки. Доступно переиспользование.

// перечень фраз бегущей строки
let ticker_items = [
	"Дело помощи утопающим — дело рук самих утопающих!",
	"Шахматы двигают вперед не только культуру, но и экономику!",
	"Лед тронулся, господа присяжные заседатели!"
]

// создаём и вставляем контент бегущей строки
document.querySelectorAll(".ticker").forEach(ticker => { // определяем все контейнеры с бегущей строкой на странице

	// создаём контейнер для вьюпорта
	let ticker_viewport = document.createElement("div")
	ticker_viewport.setAttribute("class", "ticker_viewport")

	// создаём контейнер для фраз бегущей строки
	let ticker_content = document.createElement("div")
	ticker_content.setAttribute("class", "ticker_content")

	// создаём контейнер для каждой фразы и помещаем его в контейнер для фраз бегущей строки
	ticker_items.forEach(item => {

		// создаём контейнер для фразы
		let ticker_item = document.createElement("span")
		ticker_item.setAttribute("class", "ticker__item")

		// помещаем текущую фразу в контейнер
		ticker_item.textContent = item

		// помещаем контейнер с фразой в контейнер для фраз бегущей стоки
		ticker_content.appendChild(ticker_item)

	});
	
	// помещаем контейнер с фразами в контейнер бегущей строки
	ticker_viewport.appendChild(ticker_content)
	ticker.appendChild(ticker_viewport)

	// дублируем контейнер с содержимым бегущей строки для зацикленности
	let ticker_content_clone = ticker_content.cloneNode(true)
	ticker_content_clone.setAttribute("aria-hidden", "true")
	ticker_viewport.appendChild(ticker_content_clone)

});