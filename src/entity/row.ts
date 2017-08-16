import { Item } from './item';
export class Order {
	item: Item | number;
	num: number;
	price: number;
}
export class Row {
	ca: number;				// 创建时间
	money: number;			// 金额
	orders: Array<Order>;	// 商品ID
}
