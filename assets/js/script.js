!(function ($) {
  function RGBObject(r, t, o, g) {
    (this.r = r), (this.b = o), (this.g = t), (this.a = 'number' == typeof g ? g : 1);
  }
  function onChange() {
    const forground = $('#rgba_colorpicker').spectrum('get');
    const background = $('#bg_colorpicker').spectrum('get');

    const forgroundRGB = new RGBObject(forground.toRgb().r, forground.toRgb().g, forground.toRgb().b, forground.toRgb().a);
    const backgroundRGB = new RGBObject(background.toRgb().r, background.toRgb().g, background.toRgb().b).rgba2rgb(forgroundRGB);
    const backgroundRGBString = 'rgb(' + Math.round(backgroundRGB.r) + ',' + Math.round(backgroundRGB.g) + ',' + Math.round(backgroundRGB.b) + ')';

    $('#bg_value').text(background.toHexString() + ' ' + background.toRgbString().replace(/\s/g, ''));

    $('#rgba_value').text(forground.toHexString() + ' ' + forground.toRgbString().replace(/\s/g, ''));

    $('#output_block').css({
      'background-color': backgroundRGBString,
      display: 'inline-block',
      'vertical-align': 'middle',
      'margin-right': '.5rem',
      width: '1.71875rem',
      height: '1.25rem',
    });

    const luminancy = getLuminancy(Math.round(backgroundRGB.r), Math.round(backgroundRGB.g), Math.round(backgroundRGB.b));
    $('#output_value').text(`${new tinycolor(backgroundRGBString).toHexString()} ${backgroundRGBString} | Luminancy: ${luminancy}`);

    $('#rgba_view').css(
      'background-color',
      'rgba(' + forground.toRgb().r + ',' + forground.toRgb().g + ',' + forground.toRgb().b + ',' + forground.toRgb().a + ')'
    );

    $('#join_view').css('background-color', backgroundRGBString);

    // setting color
    if (1 - luminancy <= 0.6) {
      $('#join_view > span').css('color', '#000');
    } else {
      $('#join_view > span').css('color', '#fff');
    }
  }

  function getLuminancy(r, g, b) {
    // Convert RGB to sRGB
    function srgb_to_linear(c) {
      c = c / 255.0;
      if (c <= 0.03928) {
        return c / 12.92;
      } else {
        return ((c + 0.055) / 1.055) ** 2.4;
      }
    }

    const r_lin = srgb_to_linear(r);
    const g_lin = srgb_to_linear(g);
    const b_lin = srgb_to_linear(b);

    // Calculate the luminance
    luminance = 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin;
    return luminance;
  }

  (RGBObject.prototype.rgba2rgb = function (colorObject) {
    const alpha = colorObject.a;
    return new RGBObject(
      (1 - alpha) * this.r + alpha * colorObject.r,
      (1 - alpha) * this.g + alpha * colorObject.g,
      (1 - alpha) * this.b + alpha * colorObject.b
    );
  }),
    $('#bg_colorpicker').spectrum({
      color: 'rgb(255,255,255)',
      showAlpha: !1,
      preferredFormat: 'rgb',
      showInput: !0,
      change: function (r) {
        onChange();
      },
    }),
    $('#rgba_colorpicker').spectrum({
      color: 'rgba(0,0,255,.5)',
      showAlpha: !0,
      preferredFormat: 'rgb',
      showInput: !0,
      change: function (r) {
        onChange();
      },
    }),
    onChange();
})(jQuery);
