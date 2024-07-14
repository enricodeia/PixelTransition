<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" integrity="sha512-7eHRwcbYkK4d9g/6tD/mhkf++eoTHwpNM9woBxtPUBWm67zeAfFC+HrdoE2GanKeocly/VxeLvIqwvCdk7qScg==" crossorigin="anonymous" referrerpolicy="no-referrer" defer></script>

<script>
document.addEventListener("DOMContentLoaded", function() {
    // Cell class definition
    class Cell {
        constructor(row, column) {
            this.DOM = { el: document.createElement('div') };
            gsap.set(this.DOM.el, { willChange: 'opacity, transform' });
            this.row = row;
            this.column = column;
        }
    }

    // Overlay class definition
    class Overlay {
        constructor(DOM_el, customOptions) {
            this.DOM = { el: DOM_el };
            this.options = { rows: 10, columns: 10, ...customOptions };
            this.DOM.el.style.setProperty('--columns', this.options.columns);
            this.cells = new Array(this.options.rows).fill(null).map((_, i) => 
                new Array(this.options.columns).fill(null).map((_, j) => {
                    const cell = new Cell(i, j);
                    this.DOM.el.appendChild(cell.DOM.el);
                    return cell;
                })
            );
        }

        show(customConfig = {}) {
            return new Promise(resolve => {
                const config = { transformOrigin: '50% 50%', duration: 0.5, ease: 'none', stagger: { grid: [this.options.rows, this.options.columns], from: 0, each: 0.05, ease: 'none' }, ...customConfig };
                gsap.set(this.DOM.el, { opacity: 1 });
                gsap.fromTo(this.cells.flat().map(cell => cell.DOM.el), { scaleY: 0, opacity: 0, transformOrigin: config.transformOrigin }, { ...config, scaleY: 1.03, opacity: 1, onComplete: resolve });
            });
        }

        hide(customConfig = {}) {
            return new Promise(resolve => {
                const config = { transformOrigin: '50% 50%', duration: 0.5, ease: 'none', stagger: { grid: [this.options.rows, this.options.columns], from: 0, each: 0.05, ease: 'none' }, ...customConfig };
                gsap.fromTo(this.cells.flat().map(cell => cell.DOM.el), { transformOrigin: config.transformOrigin }, { ...config, scaleY: 0, opacity: 0, onComplete: resolve });
            });
        }
    }

    const intro = document.querySelector('.content');

    const overlayEl = document.querySelector('.overlay');
    const images = [...document.querySelectorAll('.prev_button, .next_button, .logo_link')];
    const contentElements = [...document.querySelectorAll('.content')];
    const overlay = new Overlay(overlayEl, { rows: 20, columns: 4 });

    console.log("images: ", images);
    console.log("content: ", contentElements);

    let isAnimating = false;

    images.forEach((image, position) => {
        image.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            gsap.to(intro, { duration: 0.2, ease: 'power2.in', startAt: { filter: 'brightness(100%) saturate(100%)' }, filter: 'brightness(800%) saturate(600%)' });
            overlay.show({ transformOrigin: '50% 100%', duration: 0.3, ease: 'power1.in', stagger: { grid: [overlay.options.rows, overlay.options.columns], from: 'start', each: 0.02 } })
            .then(() => {
                intro.classList.add('intro--closed');
                contentElements[position].classList.add('content--open');
                overlay.hide({ transformOrigin: '50% 0%', duration: 0.3, ease: 'power3', stagger: { grid: [overlay.options.rows, overlay.options.columns], from: 'start', each: 0.02 } }).then(() => isAnimating = false);
                gsap.fromTo(contentElements[position].querySelector('.content__img'), { filter: 'brightness(800%) saturate(600%)' }, { duration: 0.8, ease: 'power4', filter: 'brightness(100%) saturate(100%)' });
            });
        });
    });

    contentElements.forEach((content) => {
        const backButton = content.querySelector('.logo_link');
        if (backButton) {
            backButton.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;
                gsap.to(content.querySelector('.content__img'), { duration: 0.7, ease: 'power2.in', filter: 'brightness(800%) saturate(600%)' });
                overlay.show({ transformOrigin: '50% 0%', duration: 0.3, ease: 'power1.in', stagger: { grid: [overlay.options.rows, overlay.options.columns], from: 'end', each: 0.02 } })
                .then(() => {
                    intro.classList.remove('intro--closed');
                    content.classList.remove('content--open');
                    overlay.hide({ transformOrigin: '50% 100%', duration: 0.3, ease: 'power3', stagger: { grid: [overlay.options.rows, overlay.options.columns], from: 'end', each: 0.02 } }).then(() => isAnimating = false);
                    gsap.to(intro, { duration: 0.8, ease: 'power4', filter: 'brightness(100%) saturate(100%)' });
                });
            });
        }
    });

    // Add event listeners for .prev_button and .next_button
    const prevButton = document.querySelector('.prev_button');
    const nextButton = document.querySelector('.next_button');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            // Add your animation logic here for prev_button
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // Add your animation logic here for next_button
        });
    }

});
</script>