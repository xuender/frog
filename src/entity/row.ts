import { Item } from './item';
export class Items {
	item: Item | number;
	num: number;
	price: number;
}
export class Row {
	ca: number;				// 创建时间
	money: number;			// 金额
	items: Array<Items>;	// 商品ID
}
