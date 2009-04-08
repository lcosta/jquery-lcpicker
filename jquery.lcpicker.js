/*
 * lcpicker - jQuery plugin for color picker
 *
 * Copyright (c) 2009 L. Costa
 *
 * Site: http://github.com/lcosta/lcpicker 
 *  
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {
  //
  // plugin definition
  //
  var isDeBug = true;
  var picker = null;
  var colorsDiv = null;
  var controls = null;
  var colorValue = null;
  var bt = null;
  var opts = null;
  var pickerOpen = false;
  
  $.fn.lcpicker = function(options) {
	debug(this);
	
  if(picker == null){
    drawPicker();
  }
	// build main options before element iteration
	opts = $.extend({}, $.fn.lcpicker.defaults, options);
	// iterate and reformat each matched element
	return this.each(function() {
	  var pickerSpan = $(this);
	  // build element specific options
	  var o = $.metadata ? $.extend({}, opts, pickerSpan.metadata()) : opts;
	  
    if(o.updateTo != null){
      o.updateTo = $(o.updateTo);
      pickerSpan.css('background',clearColorHex(o.updateTo.val()));
      
      o.updateTo.keyup(function(){
        if(clearColorHex(o.updateTo.val()).match(o.regExpValidatedColor)){
          pickerSpan.css('background',clearColorHex(o.updateTo.val()));
        } else {
          pickerSpan.css('background','');
        }
      });
    }


    
	  pickerSpan.click(function(){

      if(picker.is(":hidden")){
          if(o.updateTo == null){
            if($.metadata && pickerSpan.metadata().color) colorValue.val(formatColor(pickerSpan.metadata().color));
          }
          o.showControls ? controls.show() : controls.hide();
          colorsListDraw(o.colors);
          picker.css({
              top: pickerSpan.offset().top + (pickerSpan.outerHeight()),
              left: pickerSpan.offset().left
          }).show();
          
          if(o.updateTo != null){
            setcolorValue(o.updateTo.val());
          }
          if(picker.is(":hidden")){colorValue.get(0).focus(); colorValue.get(0).select();}
          
          $.fn.lcpicker.elements.bt.click(function (){
            updateTo(o.updateTo, colorValue.val());
            if($.metadata) pickerSpan.metadata().color = clearColorHex(colorValue.val());
            pickerSpan.css('background',clearColorHex(colorValue.val()));
            picker.hide();
            $.fn.lcpicker.elements.bt.unbind();
          });
      } else {
          picker.hide();
          $.fn.lcpicker.elements.bt.unbind();
      }
    });
	});
  };
  
  
  

  
  
  //
  // private function
  //
  function debug($obj) {
	if (isDeBug && window.console && window.console.log)
	  window.console.log($obj);
  };
  
  function setValue() {
        updateTo(o.updateTo, colorValue.val());
        pickerSpan.css('background',clearColorHex(colorValue.val()));
        picker.hide();
  };  
  
  function updateTo(el, value){
      value = formatColor(value);
      if(el != null){
          
          type = el.get(0).tagName.toLowerCase();
          debug(el);
          switch (type){
              case 'input':
                  el.val(value);
                  break;
    
              default:
                  el.html(value);
                  break;
          }
      }
  };
  
  function drawPicker(){
    picker = $('<div class="lcpicker"><div class="lcpickerList"></div><div class="lcpickerControls"><input type="text" /><button>ok</button></div></div>').css('position','absolute').appendTo('body').hide();
    colorValue = $("input[type='text']", picker);
    $.fn.lcpicker.elements.bt = $("button", picker);
    colorsDiv = $("div.lcpickerList", picker).css('overflow','hidden');
    controls = $('div.lcpickerControls').css('clear','both');
  };
  
  function colorsListDraw(list){
    colorsDiv.html('');
    
    $(list).each(function(){
      var color = this;
      var spColor = $('<span />').appendTo(colorsDiv).css({
                                                            'background': clearColorHex(color),
                                                            'display':'block',
                                                            'float':'left',
                                                            'width':'15px',
                                                            'height':'15px',
                                                            'margin':'2px',
                                                            'border':'1px solid #000000'
                  }).click(function(){
                                        setcolorValue(color);
                                        $.fn.lcpicker.elements.bt.click();
                                    });
      
    });
  
  }
  
  function setcolorValue(color){
    color = formatColor(color);
    colorValue.val(color);
    if(picker.is(":hidden")){colorValue.get(0).focus(); colorValue.get(0).select();}
  }
  
  function clearColorHex(color){
    if(typeof(color.split('#')[1]) == 'undefined') color = '#' + color;
    return color;
  }
  
  
  function formatColor(color){
    
    if($.fn.lcpicker.defaults.updateToStripSharp){
      color = color.replace(/#/gi, '');
    } else {
      if(typeof(color.split('#')[1]) == 'undefined') color = '#' + color;
    }
    return color;  
  }

  
  //
  // define and expose
  //  
  $.fn.lcpicker.elements = {bt: null};
  //
  // plugin defaults
  //
  $.fn.lcpicker.defaults = {
	updateTo: null,
	showControls: true,
	updateToStripSharp: true,
	regExpValidatedColor: /#?[0-9a-fA-F]{6}$/,
	colors: [ '000000', '993300','333300', '000080', '333399', '333333', '800000', 'FF6600', '808000', '008000', '008080', '0000FF', '666699', '808080', 'FF0000', 'FF9900', '99CC00', '339966', '33CCCC', '3366FF', '800080', '999999', 'FF00FF', 'FFCC00', 'FFFF00', '00FF00', '00FFFF', '00CCFF', '993366', 'C0C0C0', 'FF99CC', 'FFCC99', 'FFFF99' , 'CCFFFF', '99CCFF', 'FFFFFF']
  };
//
// end of closure
//
})(jQuery);