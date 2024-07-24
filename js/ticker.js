
// Бегущая строка
// ticker.js

// перечень фраз бегущей строки
let ticker_phrases = [
	"Дело помощи утопающим — дело рук самих утопающих!",
	"Шахматы двигают вперед не только культуру, но и экономику!",
	"Лед тронулся, господа присяжные заседатели!"
]

// определяем все контейнеры с бегущей строкой на странице
let tickers = document.querySelectorAll(".ticker .ticker_viewport")

// создаём и вставляем контент бегущей строки
tickers.forEach(ticker_viewport => {

	// создаём контейнер для фраз бегущей строки
	let ticker_content = document.createElement("div")
	ticker_content.setAttribute("class", "ticker_content runner")

	// создаём контейнер для каждой фразы и помещаем его в контейнер для фраз бегущей строки
	ticker_phrases.forEach(phrase => {

		// создаём контейнер для фразы
		let ticker_phrase = document.createElement("span")
		ticker_phrase.setAttribute("class", "ticker__phrase")

		// помещаем текущую фразу в контейнер
		ticker_phrase.textContent = phrase

		// помещаем контейнер с фразой в контейнер для фраз бегущей стоки
		ticker_content.appendChild(ticker_phrase)

	});
	
	// помещаем контейнер с фразами в контейнер бегущей строки
	ticker_viewport.appendChild(ticker_content)

	// дублируем контейнер с содержимым бегущей строки для непрерывного цикла
	let ticker_content_clone = ticker_content.cloneNode(true)
	ticker_content_clone.setAttribute("aria-hidden", "true")
	ticker_viewport.appendChild(ticker_content_clone)

});