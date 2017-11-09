module.exports = class {
    constructor(oldCart) {
        this.items = oldCart.items || {};
        this.totalQty = oldCart.totalQty || 0;
        this.totalPrice = oldCart.totalPrice || 0;
    }

    add(item, id) {
        let storedItem = this.items[id];
        if(!storedItem) {
            storedItem = this.items[id] = {item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }

    genArray() {
        let arr = [];
        for(let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }

    getObj() {
        return {
            items: this.items,
            totalQty: this.totalQty,
            totalPrice: this.totalPrice
        }
    }

    reduce(action, id) {

        let del = (id) => {
            delete this.items[id];
        }

        let reloadPrice = () => {
            this.totalPrice = 0;
            for(let id in this.items) {
                this.items[id].price = this.items[id].item.price * this.items[id].qty;
                this.totalPrice +=  this.items[id].price;
            }
        }

        if(action == 'one') {
            this.items[id].qty--;
            this.totalQty--;

            if(this.items[id].qty == 0) {
                if(this.totalQty == 0) {
                    return null;
                }
                del(id);
            }

        } else if(action == 'all') {
            this.totalQty -= this.items[id].qty;
            del(id);
        } else {
            console.log("DOT UNDERSTUD");
        }

        reloadPrice();

        return this.getObj();
    }
}