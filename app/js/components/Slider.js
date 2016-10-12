var Page = require('../core/Page');

module.exports = Page.extend({
  sensitivity: 25,
  activeSlide: 0,
  slidesCount: 0,
  animClass: 'is-animating',
  selectedClass: 'selected',

  constructor: function(container, pagination) {
    this.constructor.__super__.constructor.apply(this, [container, null]);

    this.pagination = pagination;
    this.slidesCount = container.children.length;
    this.container.style.width = 100 * this.slidesCount + '%';

    for (var i = 0; i < this.slidesCount; i++) {
      var el = document.createElement('div');
      this.pagination.appendChild(el);
    }

    this.pagination.children[0].classList.add(this.selectedClass);

    var sliderManager = new Hammer.Manager(container);
    sliderManager.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    sliderManager.on('pan', this.handlePan.bind(this));
  },

  handlePan: function(e) {
    var percentage = 100 / this.slidesCount * e.deltaX / window.innerWidth;
    var percentageCalculated = percentage - 100 / this.slidesCount * this.activeSlide;

    this.container.style.transform = 'translateX( ' + percentageCalculated + '% )';

    if (e.isFinal) {
      if (e.velocityX > 1) {
        this.switchSlide(this.activeSlide - 1);
      } else if (e.velocityX < -1) {
        this.switchSlide(this.activeSlide + 1);
      } else {
        if (percentage <= -(this.sensitivity / this.slidesCount)) {
          this.switchSlide(this.activeSlide + 1);
        } else if (percentage >= (this.sensitivity / this.slidesCount)) {
          this.switchSlide(this.activeSlide - 1);
        } else {
          this.switchSlide(this.activeSlide);
        }
      }
    }
  },

  switchSlide: function(slide) {
    if (slide < 0) {
      this.activeSlide = 0;
    } else if (slide > this.slidesCount - 1) {
      this.activeSlide = this.slidesCount - 1;
    } else {
      this.activeSlide = slide;
    }

    this.container.classList.add(this.animClass);
    var percentage = -(100 / this.slidesCount) * this.activeSlide;
    this.container.style.transform = 'translateX( ' + percentage + '% )';

    clearTimeout(this.timer);
    this.timer = setTimeout(function() {
      this.container.classList.remove(this.animClass);
    }.bind(this), 400);

    for (var i = 0; i < this.slidesCount; i++) {
      var el = this.pagination.children[i];
      var method = i === this.activeSlide ? 'add' : 'remove';
      el.classList[method](this.selectedClass);
    }

    this.trigger('switch:slide', this.activeSlide);
  }
});
