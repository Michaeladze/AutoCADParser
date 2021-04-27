export function RandomColor (color1, color2) {

  var _regs = {
    "hex3"  : /^#([a-f\d])([a-f\d])([a-f\d])$/i,
    "hex6"  : /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
    "rgb"   : /^rgb\s*\(\s*([\d\.]+%?)\s*\,\s*([\d\.]+%?)\s*\,\s*([\d\.]+%?)\s*\)$/
  };

  var _obj1 = getValues(color1);
  var _obj2 = getValues(color2);

  //---Get the colors
  function getValues (color) {

    var values = false;

    for (var prop in _regs) {

      if (_regs[prop].test(color)) {

        values = {};

        values.r = color.replace(_regs[prop], "$1");
        values.g = color.replace(_regs[prop], "$2");
        values.b = color.replace(_regs[prop], "$3");

        if (prop === "rgb") {

          values.r = Number(values.r);
          values.g = Number(values.g);
          values.b = Number(values.b);

        } else {

          values.r = parseInt(values.r, 16);
          values.g = parseInt(values.g, 16);
          values.b = parseInt(values.b, 16);

        }

        break;

      }

    }

    return values;

  }

  //---str_pad
  function str_pad (str, pad_length, pad_string, pad_type) {

    var len = pad_length - str.length;
    if (len < 0) { return str };
    var pad = new Array(len + 1).join(pad_string);
    if (pad_type === "STR_PAD_LEFT") { return pad + str };
    return str + pad;

  }

  //---Get a value
  function getRandom (c1, c2, pcent) {

    var color = c1 + Math.floor((c2 - c1) * pcent);

    if (color < 0) color = 0;

    return str_pad(color.toString(16), 2, "0", "STR_PAD_LEFT");

  }

  //---Get a random color
  this.getColor = function () {

    if (_obj1 && _obj2) {

      var random = Math.random();

      var r = getRandom(_obj1.r, _obj2.r, random);
      var g = getRandom(_obj1.g, _obj2.g, random);
      var b = getRandom(_obj1.b, _obj2.b, random);

      return "#" + r + g + b;

    }

    return false;

  };

}
