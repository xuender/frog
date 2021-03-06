import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { forEach, isFinite, chain } from 'lodash';
import * as moment from 'moment';

import { Account } from '../../entity/account';
import { Row, Order } from '../../entity/row';
import { Item } from '../../entity/item';
import { SeqProvider } from '../seq/seq';
import { ItemProvider } from '../item/item';
import { CustomerProvider } from '../customer/customer';
import { Customer } from '../../entity/customer';
/**
 * 帐目
 */
@Injectable()
export class AccountsProvider {
	private cache: any;
	constructor(
		private storage: Storage,
		private seqProvider: SeqProvider,
		private customerProvider: CustomerProvider,
		private itemProvider: ItemProvider
	) {
		this.cache = {};
		console.log('Hello AccountsProvider Provider');
	}

	reset() {
		this.cache = {};
	}

	getAccounts(ca: number | string): Promise<Account> {
		const date: string = isFinite(ca) ? moment(ca).format('YYYY-MM-DD') : ca as string;
		return new Promise<Account>((resolve, reject) => {
			if (date in this.cache) {
				resolve(this.cache[date]);
			} else {
				this.storage.get(date)
					.then((account: Account) => {
						console.log('getAccount:', account);
						if (account) {
							this.link(account);
						} else {
							account = {
								id: this.seqProvider.find(Account.KEY),
								date: date,
								rows: [],
							};
						}
						resolve(this.cache[date] = account);
					})
					.catch((error) => {
						console.log('account error:', error, ca);
						reject(error);
					});
			}
		});
	}

	private link(account: Account): Account {
		forEach(account.rows, (row: Row) => {
			// 客户修改
			if (row.customer && isFinite(row.customer)) {
				row.customer = this.customerProvider.find(row.customer as number);
			}
			forEach(row.orders, (order: Order) => {
				if (isFinite(order.item)) {
					order.item = this.itemProvider.find(order.item as number);
				}
				return true;
			});
			return true;
		});
		return account;
	}

	save(account: Account) {
		forEach(account.rows, (row: Row) => {
			// 客户修改
			if (row.customer && !isFinite(row.customer)) {
				row.customer = (row.customer as Customer).id;
			}
			forEach(row.orders, (order: Order) => {
				if (!isFinite(order.item)) {
					order.item = (order.item as Item).id;
				}
				return true;
			});
			return true;
		});
		this.storage.set(account.date, account)
			.then((a: Account) => {
				const d = account.date.split('-');
				const month = `${d[0]}-${d[1]}`;
				const year = d[0];
				this.storage.get(month)
					.then((m: string[]) => {
						if (!m) m = [];
						m.push(account.date);
						this.storage.set(month, chain(m).sort().sortedUniq().value());
					});
				this.storage.get(year)
					.then((y: string[]) => {
						if (!y) y = [];
						y.push(month);
						this.storage.set(year, chain(y).sort().sortedUniq().value());
					});
				this.link(account);
			});
	}

	async days(date: string) {
		const d = date.split('-');
		return await this.storage.get(`${d[0]}-${d[1]}`);
	}

	async months(date: string) {
		const d = date.split('-');
		return await this.storage.get(d[0]);
	}

	async years() {
		return await this.reFilter(/^\d{4}$/);
	}

	private reFilter(re: RegExp): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			this.storage.keys()
				.then(keys => resolve(chain(keys).filter(key => re.test(key)).sortBy().value()));
		});
	}

	async allDays() {
		return await this.reFilter(/^\d{4}-\d{2}-\d{2}$/);
	}
}
