
module.exports = function Cart(oldCart) {
    this.item = oldCart.item || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id) {
        var storedItem = this.item[id];
        if (!storedItem) {
            storedItem = this.item[id] = {
              product: item,
              quantity: 0,
              sumPrice: 0
            };
        }
        storedItem.quantity++;
        storedItem.sumPrice = storedItem.product.price * storedItem.quantity;
        this.totalQty++;
        this.totalPrice += storedItem.product.price;
    };

    this.reduceByOne = function(id) {
        this.item[id].quantity--;
        this.item[id].sumPrice -= this.item[id].product.price;
        this.totalQty--;
        this.totalPrice -= this.item[id].product.price;

        if (this.item[id].quantity <= 0) {
            delete this.item[id];
        }
    };

    this.addByOne = function(id) {
        this.item[id].quantity++;
        this.item[id].sumPrice += this.item[id].product.price;
        this.totalQty++;
        this.totalPrice += this.item[id].product.price;
    };

    this.removeItem = function(id) {
        this.totalQty -= this.item[id].quantity;
        this.totalPrice -= this.item[id].sumPrice;
        delete this.item[id];
    };

    this.generateArray = function() {
        var arr = [];
        for (var id in this.item) {
            arr.push(this.item[id]);
        }
        return arr;
    };
};
