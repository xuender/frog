import { Tag, Tags } from './tag';
// 客户信息
export class Customer implements Tags {
	static KEY = 'customers';
	id: number;
	name: string;					// 姓名
	extend: any;					// 扩展数据
	tags: Array<Tag | number>;		// 标签
	phone?: string;					// 联系电话
	note?: string;					// 备注
}
