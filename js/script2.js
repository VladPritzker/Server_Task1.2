window.addEventListener('DOMContentLoaded', function () {

    // Tabs

    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {

        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function (event) {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2022-06-11';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor((t / (1000 * 60 * 60 * 24))),
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / (1000 * 60 * 60) % 24));

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }



    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') { // 1) если мы кликаем за экраном 2) или мы кликаем на крестик  то у нас закрывается модельное окно 
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);
    // Изменил значение, чтобы не отвлекало

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для создание карточек меню

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        ".menu .container"
    ).render();

    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => { // мы перебераем данные которые мы заполняем в форме 
        postData(item); // мы отправляем наш post запрос после каждого заполнения формы 
    });

    function postData(form) { // from это аргумент 
        form.addEventListener('submit', (e) => { // при нажатии enter на аргумент мы будем вызывать вункцию post 
            e.preventDefault(); // мы отменяем стандартное поведение браузера что бы при нажатии он не перезагружался 

            let statusMessage = document.createElement('img'); // мы создали div
            statusMessage.src = message.loading;// мы вставляем картинку в нашу переменную
            // statusMessage.classList.add('status'); // мы вставили в div class status 
            statusMessage.style.css = `
            display: block;
            margin: 0 auto;
            `;  // мы вставили в div текст c message.loading
            // statusMessage.textContent = message.loading; // мы вставили в div текст c message.loading
            form.insertAdjacentElement('afterend', statusMessage); //  afterend мы вставляем спинер после формы (по центру)> метод insertAdjacentElement; 
            // form.append(statusMessage); // мы вставили в аргумент form тест c statusMessage 

            const request = new XMLHttpRequest(); // создаем новый запрос 
            request.open('POST', 'server.php'); //что бы настроить наш запрос; POST это тип запроса; server.php это куда мы его отправляем  ((((((((Очень важно что в HTML Inpute который мы отправляем на сервер всегда должен иметь атрибут name='name'))))))))*(^(*&^(*&^(*&^(*&)))))
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8'); // тип данных для post  ((((((при связке XMLHttpRequest + formDAta нам заголовок устанавливать не нужно (удалить setReqeustHeader) потому что данные не попадут на сервер ))))))!!!!!!!!!!!,%,.:%,:.,:%:,%№:%№%№"%№:":%№")))
            const formData = new FormData(form); // мы передаем те данные которые пользователь введет в inpute (обычная форма не JSON) и передадим их на сервер (в аргумент form)

            const object = {};
            formData.forEach(function (value, key) {
                object[key] = value; // мы превращаем наши данные которые пользователь ввел в форму в обьект
            });
            const json = JSON.stringify(object);// мы привращаем наш обьект в json file 

            request.send(json); //Мы отправляем запрос с той формой которая была зполнина 

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    showThanksModal(message.success);
                    // statusMessage.textContent = message.success; // при положительном результате мы вводим в поле текст с message.success
                    form.reset();
                    setTimeout(() => {
                        statusMessage.remove(); // при негативном результате мы вводим в поле текст с message.failure
                    }, 2000);
                } else {
                    showThanksModal(message.failure);
                    // statusMessage.textContent = message.failure;
                }
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog'); // мы создаем переменную и втавляем в нее елемент с классом modal__dialog 

        prevModalDialog.classList.add('hide');// Мы убераем этот елемент ( что бы убедиться что его нет на стр)
        openModal();  //  мы показываем елемент 

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');  // то есть мы одни modal__dialog зменяем другим 
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;// в  class="model__close" data-close>х</div> x это спец симол который являеться крестиком для закрывания окна 
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove(); // мы убераем нашу форму через 4 секунды 
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal(); // закрываем модельное окно 
        }, 4000);
    }
    

});