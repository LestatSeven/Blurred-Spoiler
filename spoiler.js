(function(){
  var opt = {
    max: 10,
    part: 0
  };

  var ieo = function() {
    return !document.createElement('canvas').getContext;
  }

  var b = (function(){
    var ua = navigator.userAgent;
    return {
      webkit : /webkit\/?\s*(\.?\d+(\.\d+)*)/i.test(ua),
      msieo : /msie\/?\s*(\.?\d+(\.\d+)*)/i.test(ua) && ieo(),
      msien : /msie\/?\s*(\.?\d+(\.\d+)*)/i.test(ua) && !ieo(),
      opera : /opera\/?\s*(\.?\d+(\.\d+)*)/i.test(ua),
      ffox : /firefox\/?\s*(\.?\d+(\.\d+)*)/i.test(ua)
    }
  })();

  spoiler = function(opts) {
    if(opts !== undefined) {
      opt.max = opts.max;
      opt.part = opts.part;
    }
    var els  = document.querySelectorAll('.spoiler'),
        len  = els.length,
        curBlur = opt.max,
        animT = null;

    var canT = function() {
      if (animT) {
        clearTimeout(animT);
        animT = null;
      }
    }

    var appBlur = function(el, rad){
      if(!b.msieo){
        if(!b.ffox){
          appBlur = function(el, rad) {
            curBlur = rad;
            var fl = rad > 0 ? 'blur('+ rad +'px)' : '';
            var st = '-webkit-filter:' + fl + ';';
                st += '-moz-filter:' + fl + ';';
                st += '-o-filter:' + fl + ';';
                st += '-ms-filter:' + fl + ';';
                st += 'filter:' + fl +';';
            el.setAttribute('style',st);
          }
        }else{
          appBlur = function(el, rad) {
            curBlur = rad;
            var fl = rad > 0 ? "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='blur'><feGaussianBlur stdDeviation='" + rad + "' /></filter></svg>#blur\")" : '';
            el.setAttribute('style','filter:' + fl);
          }
        }
      }else{
        appBlur = function(el, rad) {
          curBlur = rad;
          el.style.filter = "progid:DXImageTransform.Microsoft.Blur(pixelradius=" + rad + ")";
        }
      }
      appBlur(el, rad);
    }

    var perfBlur = function (el, f, t){
      canT();
      if(curBlur !== f){
        appBlur(el, curBlur + t);
        animT = setTimeout(function() {
          perfBlur(el, f, t);
        }, 10);
      }
    }

    for(var i = len; i--, el = els[i];) {
      appBlur(el, curBlur);
      var s = el.style;
      s.cursor = 'pointer';
      el.onmouseover = function () {
        perfBlur(this, opt.part, -1);
      }
      el.onmouseout = function () {
        perfBlur(this, opt.max, 1);
      }
    }
  }
}());