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
    for (var i = 0; i < regionOptions.length; i++){
      if (regionOptions[i].id === region){
        return regionOptions[i].telCode + " " + phone;
      }
    }
    
  },
  convertPhoneStrToObj (str, regionOptions){
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
    var span = $('meebid-fit-string-to-height');
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
    return arguments.callee(span, height, str, subfix);
  }
}
