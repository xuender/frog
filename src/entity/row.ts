import { Item } from './item';
import { Customer } from './customer';
export class Order {
	item: Item | number;	// 商品
	num: number;			// 数量
	price: number;			// 成本
}
export class Row {
	ca: number;						// 创建时间
	money: number;					// 金额
	price: number;					// 成本
	orders: Array<Order>;			// 订单
	customer?: Customer | number;	// 客户
}
