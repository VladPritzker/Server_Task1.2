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
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 300000);
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

    // getResource('http://localhost:3000/menu')
    //     .then(data => { // мы берем все данные с этого запроса
    //         data.forEach(({img, altimg, title, descr, price}) => {  // вынимаем с каждого обьекта отдельные елементы 
    //             new MenuCard(img, altimg, title, descr, price, ".menu .container").render(); // потом создаем новую карту в которую мы встваляем елемнты с обьекта с сервера
    //             // .menu . container - это то куда мы будем втавлять наши елементы 
    //         });
    //     });

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => { // вынимаем с каждого обьекта отдельные елементы 
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            }); // потом создаем новую к
        });


    // getResource('http://localhost:3000/menu') // мы берем данные с сервера 
    //     .then(data => createCard(data)); // 

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => { // с каждого обьекта который мы взяли с сервера мы деструктуризируем данные
    //         const element = document.createElement('div'); // создаем новый елемент div
    //         price = price * 27; // переводем грн в usd 
    //         element.classList.add("menu__item"); // добавляем класс menu__item 

    //         element.innerHTML = ` 
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;// создали новую верстку в которую подаставили данные с сервера 
    //         document.querySelector(".menu .container").append(element); // втсавили наши данные в елемент на стр 
    //     });
    // }

    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    async function getResource(url) {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }



    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    // // Slider

    let offset = 0;
    let slideIndex = 1;

    const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        width = window.getComputedStyle(slidesWrapper).width,
        slidesField = document.querySelector('.offer__slider-inner');

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent =  `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent =  slideIndex;
    }
    
    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '2s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    next.addEventListener('click', () => {
        if (offset == (+width.slice(0, width.length - 2) * (slides.length - 1))) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2); 
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slides.length < 10) {
            current.textContent =  `0${slideIndex}`;
        } else {
            current.textContent =  slideIndex;
        }
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        if (slides.length < 10) {
            current.textContent =  `0${slideIndex}`;
        } else {
            current.textContent =  slideIndex;
        }
    });
    // const slides = document.querySelectorAll('.offer__slide'),
    //     prev = document.querySelector('.offer__slider-prev'),
    //     next = document.querySelector('.offer__slider-next'),
    //     total = this.document.querySelector('#total'),
    //     current = this.document.querySelector('#current'),
    //     sliderWrapper = document.querySelector('.offer__slider-wrapper'),
    //     slidesField = document.querySelector('.offer__slider-inner'),
    //     width = window.getComputedStyle(sliderWrapper).width; // мы берем все css стили с sliderWrapper а иммено width 

    // let slideIndex = 1;
    // let offset = 0; // отступ 


    // // 2 example of the slider
    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    //     current.textContent = `0${slideIndex}`;
    // }
    // if (slides.lenth > 10) {
    //     total.textContent = `${slides.length}`;
    //     current.textContent = slideIndex;
    // }
    // slidesField.style.width = 100 * slides.length + '%'; // мы берем все елементы в slidesField и тоесть наша ширена 
    // // будет равна всем елементам в обьекте 
    // // но наши слайды могут быть разной шерены по жтому нудно задать им всем одинаковую ширену 

    // slidesField.style.display = 'flex'; // что бы все наши елементы сояли по горищзонтали
    // slidesField.style.transition = '0.5s all'; // скорость с которой у нас будет трансформироваться елемент 
    // sliderWrapper.style.overflow = 'hidden'; //  мы скрываем все елементы которые не попадают в зону видимости 

    // slides.forEach(slide => {
    //     slide.style.width = width; // мы берем все слайды и задаем им ширину с css
    // });

    // next.addEventListener('click', () => {
    //     if (offset == +width.slice(0, width.length - 2) * (slides - 1)) { //(-1 потому что изначально мы уже видим один слайд) если наш отступ равен количеству слайдов - 1 тогда (конец)
    //         //  + мы превращаем width (500px) в число 
    //         // slice мы показываем число начиная с - о от конца отнимаем последние 2 числа, было 500px стало 500
    //         offset = 0; // это значит что мы с вами волествли до конца и вернулись в начало
    //     } else {
    //         offset += +width.slice(0, width.length - 2); // что бы при нажатии на стрелочку у нас 
    //     }
    //     slidesField.style.transform = `translateX(-${offset})`; // подставляем на сколько мы будем сдвигаться влево или в право в будущем 
    //     if (slideIndex == slides.lenth){
    //         slideIndex = 1;
    //     }else{
    //         slideIndex++; 
    //     }

    //     if(slides.length < 10){
    //         current.textContent = `0${slideIndex}`;
    //     }else{
    //         current.textContent = slideIndex;
    //     }
    // });

    // prev.addEventListener('click', () => {
    //     if (offset == 0) { //(-1 потому что изначально мы уже видим один слайд) если наш отступ равен количеству слайдов - 1 тогда (конец)
    //         // если мы находимся на первом слайде и нажали на кнопку назад
    //         offset = +width.slice(0, width.length - 2) * (slides - 1); // то мы попадаем на последний слайд 
    //     } else {
    //         offset -= +width.slice(0, width.length - 2); // если мы не не на порвом слайде то мы перемещаемся на предыдущий 
    //     }
    //     slidesField.style.transform = `translateX(-${offset})`; // подставляем на сколько мы будем сдвигаться влево или в право в будущем 
    //     if (slideIndex == 1){ // если мы находимся на первом слайде и нажали назад то мы попадаем в конец 
    //         slideIndex = slides.lenth;
    //     }else{
    //         slideIndex--;  //
    //     }

    //     if(slides.length < 10){
    //         current.textContent = `0${slideIndex}`;
    //     }else{
    //         current.textContent = slideIndex;
    //     }
    // });



    // 1 example of the slider 
    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    // }
    // if (slides.lenth > 10) {
    //     total.textContent = `${slides.length}`;
    // }

    // showSlides(slideIndex); // мы вызвали наш слайдер и потом он проходит через весь код который есть снузу 

    // function showSlides(n) { // это slide index
    //     if (n > slides.length) // slides.length это количество фоток в елесенте 
    //     {
    //         slideIndex = 1;
    //     } //если slide index > slides.length тогда мы переносим на первое фото 
    //     if (n < 1) // если slideIndex > 1  
    //     {
    //         slideIndex = slides.length;
    //     } // тогда мы переходем на последний елемент в слайдерах

    //     slides.forEach(item => item.style.display = 'none'); // мы скрываем все слайды что бы потом показывать определенный слайд в зависимости от индекса 
    //     slides[slideIndex - 1].style.display = 'block'; // так как slideIndex = 1 то что бы показывать первый елемент [0] нам нужно отнять 1
    //     if (slides.length < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     }
    //     if (slides.lenth > 10) {
    //         current.textContent = `${slideIndex}`;
    //     }
    // }

    // function plusSlides(n) {
    //     showSlides(slideIndex += n); // если n = 1 тогда мы добавляем 1 если -1 тогда отнимаем 1
    // }

    // prev.addEventListener('click', () => {
    //     plusSlides(-1); // при нажатии на кнопку след к индексу будет отниматься 1

    // });


    // next.addEventListener('click', () => {
    //     plusSlides(1); // при нажатии на кнопку след к индексу будет добавляться 1 
    // });

});