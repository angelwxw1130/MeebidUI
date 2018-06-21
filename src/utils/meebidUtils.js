import meebidConstant from './../constant/meebidConstants'
import dateUtil from './date'

export default {
  buildCategoryItemStr (categoryItems) {
    var categoryItems = categoryItems || [];
    var selectedItems = [];
    
    for (var i = 0; i < categoryItems.length; i++){
      if (categoryItems[i].selected){
        selectedItems.push(categoryItems[i].id);
      }
    }
    return selectedItems.join(";");
  },
  convertPhoneObjToStr (region, phone, regionOptions){
    if (phone === null || phone === ""){
      return "";
    }
    for (var i = 0; i < regionOptions.length; i++){
      if (regionOptions[i].id === region){
        return regionOptions[i].telCode + " " + phone;
      }
    }
    
  },
  convertPhoneStrToObj (str, regionOptions){
    if (str === null || str === ""){
      return {
        //us as default
        region: 36,
        phone: null
      }
    }
    var regionTelCode = str.split(' ')[0];
    var region;
    for (var i = 0; i < regionOptions.length; i++){
      if (regionOptions[i].telCode === regionTelCode){
        region = regionOptions[i].id;
        break;
      }
    }
    var phone = str.split(' ').slice(1).join(' ');
    return {
      region: region,
      phone: phone
    }
  },
  refreshRegions(regionOptions){
    for (var i = 0; i < regionOptions.length; i++){
      var regionOption = regionOptions[i];
      regionOption.addressRule = "";
      if (regionOption.hasMore === 1){
        regionOption.childrens = [];
        regionOption.isLoaded = false;
      }
    }
  },
  indexOf(array, selector, executionContext) {
    if (array) {
        for ( var ctr = 0, len = array.length; ctr < len; ctr++) {
            if (executionContext ? selector.call(executionContext, array[ctr]) : selector(array[ctr])) {
                return ctr;
            }
        }
    }
    return null;
  },

  findIndex(array, attribute, value) {
    return this.indexOf(array, function(object) {
        if (object) {
            var compareWith = attribute ? object[attribute] : object;
            if (typeof compareWith == 'function' && typeof value != 'function') {
                compareWith = compareWith.apply(object);
            }
            return compareWith == value;
        }
        return false;
    });
  },

  findObject(array, attribute, value) {
    var index = this.findIndex(array, attribute, value);
    return index != null ? array[index] : null;
  },
  fitStringToHeightByRecursive (str, height, className, subfix, width) {
    if (height <= 0 || !str) {
        return '';
    }
    if (!subfix) {
        subfix = '...';
    }
    var span = document.getElementById('meebid-fit-string-to-height');
    if (!span) {
        span = document.createElement("span");
        span.id = 'meebid-fit-string-to-height';
        span.style.display = 'inline';
        span.style.visibility = 'hidden';
        span.style.padding = '0';
        document.body.appendChild(span);
    }
    span.style.display = '';
    /**
     * Important Note !!!! Please note here we have to provide a class with width, so that function can calculate height as we expect.
     * 
     */
    span.className = className ? className : 'meebidButtonText';
    
    if (width){
        span.style.width = width;
    }
    var result = escapeHTML(str); 
    span.innerHTML = result;
    if (span.offsetHeight <= height){
        span.innerHTML = '';
        span.style.display = 'none';
        return str;
    }
    else {
        return this.calculateStringWidth(span, height, str, subfix);
    }
  },
  calculateStringWidth (span, height, str, subfix) { //this function is aim to called only by fitStringToWidthByRecursive
    if (span.offsetHeight <= height || !str){
        span.innerHTML = '';
        span.style.display = 'none';
        return str + subfix;
    }
    //use recursive to calculate the most close index; -3 is set to remove the effect by subfix, in common, subfix is '...'
    str = str.substring(0, str.length - 3);
    span.innerHTML = str + subfix;
    return this.calculateStringWidth(span, height, str, subfix);
  },
  isNumber(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)){
      return true;
    } else{
      return false;
    }
  },
  formatMoneyForNumberField(currencyCode, price, isForceSuffix, forceSuffix){
    if (this.isNumber(price)){
      var currencyCodeObj = this.findObject(window.meebidConstant.currencyCode, "id", parseInt(currencyCode));
      var suffix, currencyCodePrefix;
      if (currencyCodeObj && !isForceSuffix){
        suffix = currencyCodeObj.suffix;
        currencyCodePrefix = currencyCodeObj.alias + " ";
      } else if (isForceSuffix) {
        suffix = forceSuffix;
        currencyCodePrefix = "";
      } else {
        var pointIndex = price.toString().indexOf(".");
        if (pointIndex > 0) {
          suffix = price.toString().substring(pointIndex + 1).length;
        } else {
          suffix = 2;
        }
        currencyCodePrefix = "";
      }
      return price.formatMoneyWithoutThousand(suffix, currencyCodePrefix);
    } else {
      return "No Price";
    }
  },
  formatMoney(currencyCode, price, withoutThousand){
    if (this.isNumber(price)){
      var currencyCodeObj = this.findObject(window.meebidConstant.currencyCode, "id", parseInt(currencyCode));
      var suffix, currencyCodePrefix;
      if (currencyCodeObj){
        suffix = currencyCodeObj.suffix;
        currencyCodePrefix = currencyCodeObj.alias + " ";
      } else {
        var pointIndex = price.toString().indexOf(".");
        if (pointIndex > 0) {
          suffix = price.toString().substring(pointIndex + 1).length;
        } else {
          suffix = 2;
        }
        currencyCodePrefix = "";
        
      }
      return withoutThousand ? price.formatMoneyWithoutThousand(suffix, currencyCodePrefix) : price.formatMoney(suffix, currencyCodePrefix);
    } else {
      return "No Price";
    }
    
  },
  formatDate (date, format) {
    return dateUtil.format(new Date(date), format);
  },

}

function escapeHTML(text,nl,empty)
{
  if (typeof nl != 'string') nl = "\n";
  if (typeof empty != 'string') empty = "";

  return ((text||"").toString().
    replace(/&/g,'&amp;').
    replace(/</g,'&lt;').
    replace(/>/g,'&gt;').
    replace(/\"/g,'&quot;').
    replace(/\'/g,'&#39;').
    replace(/\n|\r\n?/g, nl)) || empty;
}

// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

Number.prototype.formatMoneyWithoutThousand = function (places, symbol, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1") + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

Date.prototype.format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
