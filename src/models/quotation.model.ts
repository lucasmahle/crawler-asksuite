export class Quotation {
    public name: string = '';

    public description: string = '';

    public price: number = 0;

    public images: string[] = [];

    constructor({ name, description, price, images }: { name: string, description: string, price: number, images: string[] }) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.images = images;
    }
}