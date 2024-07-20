
// Дублируем контейнер с содержимым бегущей строки для цикличности 
document.querySelector(".ticker_content").appendChild(document.querySelector(".ticker_content_runner").cloneNode(true))
