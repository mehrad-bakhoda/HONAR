module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function (item, id, type) {
    var storedItem = this.items[id];
    if (!storedItem) {
      console.log("adding");
      storedItem = this.items[id] = {
        item: item,
        qty: 0,
        price: 0,
        type: type,
      };
      storedItem.qty++;
      storedItem.price = storedItem.item.orginalPrice;
      this.totalQty++;
      this.totalPrice += storedItem.price;
    } else if (storedItem.type != type) {
      // if(storedItem.size == "original")
      //     this.totalPrice -= storedItem.item.orginalPrice;
      // else if(storedItem.size == "large")
      //     this.totalPrice -= storedItem.item.largePrice;
      // else if(storedItem.size == "medium")
      //     this.totalPrice -= storedItem.item.mediumPrice;
      // else if(storedItem.size == "small")
      //     this.totalPrice -= storedItem.item.smallPrice;
      this.items[id].type = type;
      // if(size == "original")
      //     this.totalPrice += storedItem.item.orginalPrice;
      // else if(size == "large")
      //     this.totalPrice += storedItem.item.largePrice;
      // else if(size == "medium")
      //     this.totalPrice += storedItem.item.mediumPrice;
      // else if(size == "small")
      //     this.totalPrice += storedItem.item.smallPrice;
    }
  };
  this.delete = function (id) {
    var storedItem = this.items[id];
    if (storedItem) {
      console.log("deleting");
      //   if (storedItem.size == "original")
      this.totalPrice -= storedItem.item.orginalPrice;
      //   else if (storedItem.size == "large")
      //     this.totalPrice -= storedItem.item.largePrice;
      //   else if (storedItem.size == "medium")
      //     this.totalPrice -= storedItem.item.mediumPrice;
      //   else if (storedItem.size == "small")
      //     this.totalPrice -= storedItem.item.smallPrice;
      delete this.items[id];
      this.totalQty--;
    }
  };

  this.generateArray = function () {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
