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
  }
}
