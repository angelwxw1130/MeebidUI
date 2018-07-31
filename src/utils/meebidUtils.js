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
    var dateObj = new Date(date);
    return dateObj.format(format);
  },
  getQueryString (url, name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = url.match(reg);
    if(r!=null) 
      return unescape(r[2]); return null;
  },
  escapeHTML(text,nl,empty) {
    if (typeof nl != 'string') nl = "\n";
    if (typeof empty != 'string') empty = "";

    return ((text||"").toString().
      replace(/&/g,'&amp;').
      replace(/</g,'&lt;').
      replace(/>/g,'&gt;').
      replace(/\"/g,'&quot;').
      replace(/\'/g,'&#39;').
      replace(/\n|\r\n?/g, nl)) || empty;
  },
  
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


Date.prototype.format = function (formatStr) {  
    var date = this;  
    /*  
    函数：填充0字符  
    参数：value-需要填充的字符串, length-总长度  
    返回：填充后的字符串  
    */ 
    var zeroize = function (value, length) {  
        if (!length) {  
            length = 2;  
        }  
        value = new String(value);  
        for (var i = 0, zeros = ''; i < (length - value.length); i++) {  
            zeros += '0';  
        }  
            return zeros + value;  
    };  
    return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function($0) {  
        switch ($0) {  
            case 'd': return date.getDate();  
            case 'dd': return zeroize(date.getDate());  
            case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()];  
            case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];  
            case 'M': return date.getMonth() + 1;  
            case 'MM': return zeroize(date.getMonth() + 1);  
            case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];  
            case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];  
            case 'yy': return new String(date.getFullYear()).substr(2);  
            case 'yyyy': return date.getFullYear();  
            case 'h': return date.getHours() % 12 || 12;  
            case 'hh': return zeroize(date.getHours() % 12 || 12);  
            case 'H': return date.getHours();  
            case 'HH': return zeroize(date.getHours());  
            case 'm': return date.getMinutes();  
            case 'mm': return zeroize(date.getMinutes());  
            case 's': return date.getSeconds();  
            case 'ss': return zeroize(date.getSeconds());  
            case 'l': return date.getMilliseconds();  
            case 'll': return zeroize(date.getMilliseconds());  
            case 'tt': return date.getHours() < 12 ? 'am' : 'pm';  
            case 'TT': return date.getHours() < 12 ? 'AM' : 'PM';  
        }  
    });  
}

