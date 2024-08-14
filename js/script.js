'use strict';

window.addEventListener('DOMContentLoaded', () => {
    // menu 
    const body = document.querySelector('.body'),
        menu = body.querySelector('.header__nav'),
        links = body.querySelector('.header__links-small'),
        menuItem = menu.querySelectorAll('.header__nav-item'),
        burger = body.querySelector('.header__burger');

    burger.addEventListener('click', () => {
        burger.classList.toggle('header__burger_active');
        menu.classList.toggle('header__nav_active');
        links.classList.toggle('header__links-small_active');
        body.classList.toggle('body_burger-open');
    });

    menuItem.forEach((item) => {
        item.addEventListener('click', () => {
            burger.classList.remove('header__burger_active');
            menu.classList.remove('header__nav_active');
            body.classList.remove('body_burger-open');
        });
    });

    body.addEventListener('click', (e) => {
        if (e.target.classList.contains('overlay')) {
            burger.classList.remove('header__burger_active');
            menu.classList.remove('header__nav_active');
            body.classList.remove('body_burger-open');
        }
    });

    // form
    // создать бот с помощь BotFather
    // добавить свой токен бота
    const TOKEN = "",
    // добавить свой айди бота
        CHAT_ID = "",
        URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`,
        form = document.querySelector('.form'),
        successMessage = document.querySelector('.form-message');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let message = `<b>Данные формы LaslesVPN</b>\n`;
        message += `<b>Surname: </b>${this.lastName.value}\n`;
        message += `<b>Email: </b>${this.email.value}\n`;
        message += `<b>Phone: </b>${this.phone.value}\n`;

        axios.post(URL_API, {
            chat_id: CHAT_ID,
            parse_mode: 'html',
            text: message
        })
        .then((res) => {
            this.lastName.value = '';
            this.email.value = '';
            this.phone.value = '';
            successMessage.textContent = 'Message sent';
            successMessage.style.display = 'block';
        })
        .catch((err) => {
            console.warn(err);
        })
    });

    // slider
    const slider = document.querySelector('.seventh-section__slider'),
        slides = slider.querySelectorAll('.seventh-section__slide'),
        prev = slider.querySelector('.seventh-section__arrow-prev'),
        next = slider.querySelector('.seventh-section__arrow-next'),
        sliderWrapper = slider.querySelector('.seventh-section__slider-wrapper'),
        sliderInner = slider.querySelector('.seventh-section__slider-inner');

    let slideIndex = 1,
        offset = 0,
        width;

    setParameters();
    setEvents();

    function setParameters() {
        if (window.matchMedia('(max-width: 767.98px)').matches) {
            width = deleteNotDigits(window.getComputedStyle(sliderWrapper).width);
            sliderInner.style.width = 100 * slides.length + '%';
            slides.forEach(slide => slide.style.width = width + 'px');
        } else if (window.matchMedia('(max-width: 1199.98px)').matches) {
            width = deleteNotDigits(window.getComputedStyle(sliderWrapper).width) / 2;
            sliderInner.style.width = (100 / 2) * slides.length + '%';
            slides.forEach(slide => slide.style.width = width + 'px');
        } else {
            width = deleteNotDigits(window.getComputedStyle(sliderWrapper).width) / 3;
            sliderInner.style.width = (100 / 3) * slides.length + '%';
            slides.forEach(slide => slide.style.width = width + 'px');
        }
    }

    function setEvents() {
        window.addEventListener('resize', debounce(setParameters));
    }

    function debounce(func, time = 100) {
        let timer;
        return function (event) {
            clearTimeout(timer);
            timer = setTimeout(func, time, event);
        };
    }

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }

    function translateXSliderInner() {
        sliderInner.style.transform = `translateX(-${offset}px)`;
    }

    const dotsWrapper = document.createElement('ul'),
        dots = [];
    dotsWrapper.classList.add('seventh-section__dots-wrapper');
    document.querySelector('.seventh-section__slider-nav').prepend(dotsWrapper);

    prev.addEventListener('click', () => {
        if (offset === 0) {
            offset = width * (slides.length - 1);
        } else {
            offset -= width;
        }

        if (slideIndex === 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        translateXSliderInner();
        styles(dots, 'seventh-section__dot_active');
        styles(slides, 'seventh-section__slide_active');
    });

    next.addEventListener('click', () => {
        if (offset === width * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += width;
        }

        if (slideIndex === slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        translateXSliderInner();
        styles(dots, 'seventh-section__dot_active');
        styles(slides, 'seventh-section__slide_active');
    });

    function styles(parent, activeClass) {
        parent.forEach(slide => slide.classList.remove(activeClass));
        parent[slideIndex - 1].classList.add(activeClass);
    }

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.classList.add('seventh-section__dot');
        dot.setAttribute('data-slide-to', i + 1);

        if (i + 1 === slideIndex) {
            dot.classList.add('seventh-section__dot_active');
        }

        dotsWrapper.append(dot);
        dots.push(dot);
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].setAttribute('data-slide-to', i + 1);

        if (i + 1 === slideIndex) {
            slides[i].classList.add('seventh-section__slide_active');
        }
    }

    function clickListen(parent, currentClass) {
        parent.forEach(item => {
            item.addEventListener('click', (e) => {
                let slideTo;
                if (currentClass === '.seventh-section__slide') {
                    const target = e.target.closest(currentClass);
                    slideTo = target.getAttribute('data-slide-to');
                } else {
                    slideTo = e.target.getAttribute('data-slide-to');
                }

                slideIndex = slideTo;
                offset = width * (slideTo - 1);

                translateXSliderInner();
                styles(dots, 'seventh-section__dot_active');
                styles(slides, 'seventh-section__slide_active');
            });
        });
    }

    clickListen(dots);
    clickListen(slides, '.seventh-section__slide');
});