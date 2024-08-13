'use strict';

window.addEventListener('DOMContentLoaded', () => {

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