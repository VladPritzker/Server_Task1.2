window.addEventListener('DOMContentLoaded', function () {
    
    async function getResource(url) {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }
    getResource('http://localhost:3000/menu') // мы берем данные с сервера 
        .then(data => createCard(data)); // 
    function createCard(data) {
        data.forEach(({
            img,
            altimg,
            title,
            descr,
            price
        }) => { // с каждого обьекта который мы взяли с сервера мы деструктуризируем данные
            const element = document.createElement('div'); // создаем новый елемент div
            price = price * 27; // переводем грн в usd 
            element.classList.add("menu__item"); // добавляем класс menu__item 

            element.innerHTML = ` 
            <img src=${img} alt=${altimg}>
            <h3 class="menu__item-subtitle">${title}</h3>
            <div class="menu__item-descr">${descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${price}</span> грн/день</div>
            </div>
        `; // создали новую верстку в которую подаставили данные с сервера 
            document.querySelector(".menu .container").append(element); // втсавили наши данные в елемент на стр 
        });
    }
});