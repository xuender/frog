import { Tag } from './tag';
export class Item {
	static KEY = 'items';
	id: number;
	name: string;
	tags: Tag[] | number[];
}
