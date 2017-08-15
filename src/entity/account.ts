import { Row } from './row';
export class Account {
	static KEY = 'accounts';
	id: number;
	date: string;
	rows: Row[];
}
