import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { forEach, isNumber, chain } from 'lodash';
import * as moment from 'moment';

import { Account } from '../../entity/account';
import { Row, Order } from '../../entity/row';
import { Item } from '../../entity/item';
import { SeqProvider } from '../seq/seq';
import { ItemProvider } from '../item/item';

/**
 * 帐目
 */
@Injectable()
export class AccountsProvider {
	constructor(
		private storage: Storage,
		private seqProvider: SeqProvider,
		private itemProvider: ItemProvider
	) {
		console.log('Hello AccountsProvider Provider');
	}

	getAccounts(ca: number | string): Promise<Account> {
		const date: string = isNumber(ca) ? moment(ca).format('YYYY-MM-DD') : ca as string;
		return new Promise<Account>((resolve, reject) => {
			this.storage.get(date)
				.then((account: Account) => {
					console.log('getAccount:', account);
					if (account) {
						resolve(this.link(account));
					} else {
						resolve(this.link({
							id: this.seqProvider.find(Account.KEY),
							date: date,
							rows: [],
						}));
					}
				})
				.catch((error) => {
					console.log('account error:', error, ca);
					reject(error);
				});
		});
	}

	private link(account: Account): Account {
		forEach(account.rows, (row: Row) => {
			forEach(row.orders, (order: Order) => {
				if (isNumber(order.item)) {
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
			forEach(row.orders, (order: Order) => {
				if (!isNumber(order.item)) {
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
}
