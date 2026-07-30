class ItemsController {
    constructor(currentId = 0) {
        this.items = [];
        this.currentId = currentId;
    }

    addItem(name, img, description, price) {
        this.currentId++;

        const item = {
            id: this.currentId,
            name: name,
            img: img,
            description: description,
            price: price,
            createdAt: new Date().toISOString().split("T")[0]
        };

        this.items.push(item);
    }
}