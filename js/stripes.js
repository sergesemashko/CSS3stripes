(function ($, document, Math, jscolor) {
  'use strict';



  $(function() {
    var stripesController = new StripesController();
  });

  function StripesController() {
    var $angleEl = $('#stripes-angle');
    var $target = $('#test-background');
    var angle = $angleEl.val();
    var colors = [];
    var gradients = [];
    var style = '';

    function getColors() {
      return $('[name="stripe-color[]"]').toArray().map(function (el) {
        var $tr = $(el).closest('tr');
        var weight = parseInt($tr.find('.stripe-size-pixels').val());
        var blurPercents = parseInt($tr.find('.stripe-blur').val());
        var blur = weight / 100 * blurPercents;
        return {"color": '#' + el.value, "weight": weight, "blur": blur, "blurPercents": blurPercents};
      });
    }

    function compileBackground(angle, colors) {
      var style = "";
      var gradients = [];
      var sum = 0;
      var i = 0;
      //first color is always background-color
      if (colors[i]) {
        style = "background-color:" + colors[i].color + ";";
        gradients.push('transparent');
        //half of blur percent of color weight in the beginning
        gradients.push('transparent ' + (colors[i].weight/2 - colors[i].blur / 2) + 'px');
        sum += colors[i].weight/2;
      }

      for (i = 1; i < colors.length; i++) {
        gradients.push(colors[i].color + ' ' + (sum + colors[i].blur / 2) + "px");
        gradients.push(colors[i].color + ' ' + (sum + colors[i].weight - colors[i].blur / 2) + "px");
        sum += colors[i].weight;
      }

      //lopping the first element
      i = 0;
      if (colors[i]) {
        //half of blur percent of color weight in the end
        gradients.push('transparent ' + (sum + colors[i].blur / 2) + 'px');
        gradients.push('transparent ' + (sum + colors[i].weight/2) + 'px');

        sum += colors[i].weight/2;
      }

//      style += 'background-image: -moz-repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'
//      style += 'background-image: -webkit-repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'
//      style += 'background-image: -o-repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'
//      style += 'background-image: -ms-repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'
      style += 'background-image: repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');';

      return style;
    }

    function compileBackgroundPercents(angle, colors) {
      var style = "";
      var gradients = [];
      var sum = 0;
      var i = 0;
      //first color is always background-color
      if (colors[i]) {
        style = "background-color:" + colors[i].color + ";";
        gradients.push('transparent');
        //half of blur percent of color weight in the beginning
        gradients.push('transparent ' + (colors[i].weight/2 - colors[i].blur / 2) + '%');
        sum += colors[i].weight / 2;
      }

//      red (bkgrnd) 20px
//      green 30px
//      yellow 10px
//
//      60px = 50%


      for (i = 1; i < colors.length; i++) {
        gradients.push(colors[i].color + ' ' + (sum + colors[i].blur / 2) + "%");
        gradients.push(colors[i].color + ' ' + (sum + colors[i].weight - colors[i].blur / 2) + "%");
        sum += colors[i].weight;
      }

      //lopping the first element
      i = 0;
      if (colors[i]) {
        //half of blur percent of color weight in the end
        gradients.push('transparent ' + (sum + colors[i].blur / 2) + '%');
        gradients.push('transparent ' + (sum + colors[i].weight / 2) + '%');

        sum += colors[i].weight / 2;
      }

//      style += 'background-image: -moz-repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'
//      style += 'background-image: -webkit-repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'
//      style += 'background-image: -o-repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'
//      style += 'background-image: -ms-repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');'
      style += 'background-image: repeating-linear-gradient(' + angle + 'deg, ' + gradients.join(', ') + ');';
      style += 'background-size: ' + sum + 'px ' + (Math.tan(deg) * sum) + 'px';

      return style;
    }

    function update() {
      angle = parseInt($angleEl.val());
      colors = getColors();
      style = compileBackground(angle, colors);
      $target.attr('style', style);
      console.log(style);
    }

    function randomHexColor() {
      return Math.random().toString(16).slice(2, 8);
    }

    function addColorHandler(e) {
      e.preventDefault();


      var template = '<tr>' +
          '<td><a href="" class="remove-color glyphicon glyphicon-remove"></a></td>' +
          '<td>' +
            '<input name="stripe-color[]" class="color" value="' + randomHexColor() + '">' +
          '</td>' +
          '<td>' +
            '<input type="range" class="stripe-size" name="stripe-size[]" min="1" max="50" value="10" />' +
            '<input type="text" class="stripe-size-pixels" name="stripe-size-pixels[1]" value="10" size="3" maxlength="3" />' +
            '<em>px</em>'+
          '</td>' +
          '<td>' +
            '<input type="range" class="stripe-blur" name="stripe-blur[]" min="0" max="100" value="0" />' +
            '<input type="text" class="stripe-blur-pixels" name="stripe-blur-pixels[]" value="0" size="3" maxlength="3" />' +
            '<em>%</em>' +
          '</td>' +
        '</tr>';

      console.log($(template).find('.color').first());
      console.log($(template).find('.color')[0]);
      $('#colors tbody').append(template);
      update();
      jscolor.init();
    }

    function removeColorHandler(e) {
      e.preventDefault();
      if ($('#colors tbody tr').length < 3) {
        return false;
      }
      $(this).closest('tr').remove();
      update();
    }

    update();

    $(document).on('input change', 'input', update);
    $(document).on('input change', '.stripe-size', function() {
      $(this).closest('td').find('.stripe-size-pixels').val(this.value);
    });
    $(document).on('input change', '.stripe-size-pixels', function() {
      $(this).closest('td').find('.stripe-size').val(this.value);
    });
    $(document).on('input change', '.stripe-blur', function() {
      $(this).closest('td').find('.stripe-blur-percents').val(this.value);
    });
    $(document).on('input change', '.stripe-blur-percents', function() {
      $(this).closest('td').find('.stripe-blur').val(this.value);
    });

    $(document).on('input change', '#stripes-angle', function() {
      $('#stripes-angle-deg').val(this.value);
    });
    $(document).on('input change', '#stripes-angle-deg', function() {
      $('#stripes-angle').val(this.value);
    });

    $('#add-color').on('click', addColorHandler);

    $(document).on('click', '.remove-color', removeColorHandler);

  }


})(window.jQuery, document, window.Math, window.jscolor);
