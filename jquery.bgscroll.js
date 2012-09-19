(function($, win) {

  jQuery.fn.bgScroll = function(options) {
    options = $.extend({}, jQuery.fn.bgScroll.defaults, options);

    var Widget = function($container) {
      var that = this;

      if (options.bodyChild) {
        $container.appendTo('body');
      }

      $container.css(options.containerCss);

      var imgSrc = $container.data('img-src') ? $container.data('img-src') : options.image;

      $('<img/>').appendTo($container).hide().load(function() {

        that.$image = $(this);
        that.orgWidth = $(this).width();
        that.orgHeight = $(this).height();
        that.imageRatio = that.orgWidth / that.orgHeight;
        that.currentStep = options.startStep;
        that.minDiffBottom = options.steps * options.stepMinHeight;
        that.isAnimating = false;

        that.update();
        that.$image.fadeIn();
        $(win).on('resize', $.proxy(that.update, that));

      }).attr('src', imgSrc).css('position', 'absolute');

      $container.on('bgscroll.next', $.proxy(this.next, this));
      $container.on('bgscroll.prev', $.proxy(this.prev, this));
      $container.on('bgscroll.step', $.proxy(this.step, this));

    };

    Widget.prototype.prev = function() {
      if (this.currentStep <= 1) {
        return;
      }
      this.gotoStep(this.currentStep-1);
    };

    Widget.prototype.next = function() {
      if (this.currentStep >= options.steps) {
        return;
      }
      this.gotoStep(this.currentStep+1);
    };

    Widget.prototype.step = function(e, step) {
      this.gotoStep(step);
    };

    Widget.prototype.gotoStep = function(step) {
      var that = this;

      if (typeof this.$image === 'undefined') {
        return;
      }

      if (this.isAnimating) {
        return;
      } else {
        this.isAnimating = true;
      }

      this.$image.animate({top: (step * this.currentStepDistance) + 'px'}, options.animationTime, function() {
        that.isAnimating = false;
      });

      this.currentStep = step;
    };

    Widget.prototype.update = function() {

      if (this.isAnimating) {
        return this;
      }

      var winWidth = $(win).width(),
          winHeight = $(win).height(),
          widthRatio = winWidth / this.orgWidth,
          heightRatio = (winHeight+this.minDiffBottom) / this.orgHeight,
          scaleRatio = widthRatio > heightRatio ? widthRatio : heightRatio,
          imageWidth = scaleRatio * this.orgWidth,
          imageHeight = scaleRatio * this.orgHeight,
          diffBottom = winHeight - imageHeight,
          absoluteStepDistance = diffBottom / options.steps;

      if (imageWidth > winWidth) {
        var diff = winWidth - imageWidth,
            margin = diff / 2;

        this.$image.css({'left': margin});
      } else {
        this.$image.css({'left': 0});
      }

      this.$image.css({'top': absoluteStepDistance*(this.currentStep-1) + 'px'});
      this.$image.width( imageWidth );
      this.$image.height( imageHeight );

      this.currentStepDistance = absoluteStepDistance;

      return this;
    };

    return this.each(function() {
      new Widget($(this));
    });
  };

  jQuery.fn.bgScroll.defaults = {
    'image': 'background.jpg',
    'steps': 3,
    'startStep': 1,
    'stepMinHeight': 50,
    'bodyChild': true,
    'animationTime': 800,
    'containerCss': {
      'width': '100%',
      'height': '100%',
      'top': '0',
      'left': '0',
      'position': 'fixed',
      'overflow': 'hidden',
      'z-index': '-1'
    }
  };

})(jQuery, window);