import { Tag, Tags } from './tag';
export class Item implements Tags {
	static KEY = 'items';
	id: number;
	name: string;
	tags: Array<Tag | number>;
	price: number;					// 成本
}
