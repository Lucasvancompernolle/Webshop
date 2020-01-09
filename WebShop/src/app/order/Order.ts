export class Order {

    selected: boolean;
    position: number;
    orderId: number;
    invoiceId: string;
    custId: string;
    payed: boolean;
    orderDate: Date;
    totalPrice: number;
    shippingDate: Date;
    delivered: Date;
    status: number;

}

export class OrderLine {
    
    orderId: number;
    lineNo: number;
    prodId: string;
    item: string;
    qtyOrdered: number;
    price: number;
    canceled: boolean;
    status: number;

}

