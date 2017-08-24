export interface Tags {
	tags: Array<Tag | number>;
}
export class Tag {
	static KEY = 'tags';
	id: number;
	name: string;
	hide: boolean;
	order?: number;
	note?: string;
	count?: number;
}
