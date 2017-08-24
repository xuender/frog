// 客户信息
export class Customer {
	static KEY = 'customers';
	id: number;
	name: string;					// 姓名
	extend: any;					// 扩展数据
	phone?: string;					// 联系电话
	note?: string;					// 备注
}
