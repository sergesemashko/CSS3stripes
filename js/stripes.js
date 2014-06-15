(function ($) {
  'use strict';



  $(function() {
    $('.colorpicker').colorpicker();
    var stripesController = new StripesController();
  });

  function StripesController() {
    var $angleEl = $('#stripes-angle');
    var $body = $('body');
    var angle = 0;
    var colors = [];
    var gradients = [];

    function getColors() {
      return $('[name="stripe-color[]"]').toArray().map(function (el) {
        var colorId = $(el).data('colorId');
        var $gradient = $('#gradient-' + colorId);
        var gradient = 0;
        if ($gradient.length) {
          gradient = parseInt($gradient.val());
        }
        return {"color": el.value, "weight": parseInt($('#stripe-size-' + colorId).val()), "gradient": gradient};
      });
    }

    colors = getColors();

    function compileBackground(angle, colors) {
      var style = "";
      var gradients = [];
      var sum = 0;
      var i = 0;
      //first color is always background-color
      if (colors[i]) {
        style = "background-color:" + colors[i].color + ";";
        gradients.push('transparent');
        if (colors[i + 1]) {
          gradients.push('transparent ' + (colors[i].weight/2 - colors[i + 1].gradient / 2) + 'px');
        } else {
          gradients.push('transparent ' + colors[i].weight/2 + 'px');
        }
        sum += colors[i].weight/2;
      }

      for (i = 1; i < colors.length; i++) {
        gradients.push(colors[i].color + ' ' + (sum + colors[i].gradient / 2) + "px");
        gradients.push(colors[i].color + ' ' + (sum + colors[i].weight - colors[i].gradient / 2) + "px");
        sum += colors[i].weight;
      }

      i = 0;

      if (colors[i]) {
        style = "background-color:" + colors[i].color + ";";

        if (colors[colors.length - 1]) {
          gradients.push('transparent ' + (sum + colors[colors.length - 1].gradient / 2) + 'px');
          gradients.push('transparent ' + (sum + colors[i].weight/2) + 'px');
        } else {
          gradients.push('transparent ' + sum + 'px');
          gradients.push('transparent ' + (sum + colors[i].weight/2) + 'px');
        }

        sum += colors[i].weight/2;
      }

//      style += 'background-image: -moz-repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'
//      style += 'background-image: -webkit-repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'
//      style += 'background-image: -o-repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'
//      style += 'background-image: -ms-repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'
      style += 'background-image: repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'

      return style;
    }

    var style = compileBackground(angle, colors);

    $body.attr('style', style);
    console.log(colors);
    console.log(style);

    function update() {
      angle = parseInt($angleEl.val());
      colors = getColors();
      style = compileBackground(angle, colors);
      $body.attr('style', style);
      console.log(style);
    }
    $('input').change(update).on('input',update);

  }


})(window.jQuery);
