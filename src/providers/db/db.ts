import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { indexOf, forEach, isNumber, find, sortBy, chain } from 'lodash';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';


import { Item } from '../../entity/item';
import { Tag } from '../../entity/tag';
import { Account } from '../../entity/account';
import { Row, Order } from '../../entity/row';

const SEQ = 'seq';
@Injectable()
export class DbProvider {
	private seq: any = {};
	private itemsSubject = new Subject<Item[]>();
	private tagsSubject = new Subject<Tag[]>();

	items: Item[] = [];
	tags: Tag[] = [];
	itemsObservable = this.itemsSubject.asObservable();
	tagsObservable = this.tagsSubject.asObservable();
	constructor(
		private storage: Storage
	) {
		console.log('constructo DbProvider');
		this.storage.keys().then((keys) => {
			if (indexOf(keys, SEQ) < 0) {
				this.init();
			} else {
				this.load();
			}
		});
	}

	private init() {
		const tag1 = {
			id: this.getSeq(Tag.KEY),
			name: '商品',
			hide: false,
			note: '主要销售的商品',
		};
		const tag2 = {
			id: this.getSeq(Tag.KEY),
			name: '耗材',
			hide: false,
			note: '销售需要的耗材',
		};
		this.tags.push(tag1, tag2);
		this.saveTags();

		this.items.push({
			id: this.getSeq(Item.KEY),
			name: '测试商品',
			price: 3,
			tags: [tag1, tag2],
		});
		this.items.push({
			id: this.getSeq(Item.KEY),
			name: '测试耗材',
			price: 1.5,
			tags: [tag2],
		});
		this.saveItems();
	}

	saveTags() {
		forEach(this.tags, (t: Tag, i: number) => t.order = i);
		this.storage.set(Tag.KEY, this.tags).then((tags) => {
			this.tagsSubject.next(this.tags);
			console.debug('saveTags', this.tags);
		});
	}

	private saveItems() {
		forEach(this.items, (item: Item) => {
			const ids: number[] = [];
			forEach(item.tags, (t) => ids.push(isNumber(t) ? t : t.id))
			item.tags = ids;
		})
		this.storage.set(Item.KEY, this.items).then((items) => {
			Object.assign(this.items, this.linkItems(items));
			this.itemsSubject.next(this.items);
		});
	}

	private linkItems(items: Item[]): Item[] {
		forEach(items, (item: Item) => {
			const tags: Tag[] = [];
			forEach(item.tags, (t) => tags.push(isNumber(t) ? this.getTag(t) : t));
			item.tags = sortBy(tags, 'order');
		});
		return items;
	}

	getTag(id: number | string): Tag {
		if (!isNumber(id)) {
			id = parseInt(id as string);
		}
		return find(this.tags, (tag) => tag.id === id);
	}

	getSeq(key: string): number {
		let num = 0;
		if (key in this.seq) {
			num = this.seq[key];
		}
		num++;
		this.seq[key] = num;
		this.storage.set(SEQ, this.seq);
		return num;
	}

	private load() {
		this.storage.get(SEQ)
			.then((seq: any) => Object.assign(this.seq, seq));
		this.storage.get(Tag.KEY)
			.then((tags: Tag[]) => {
				Object.assign(this.tags, tags);
				this.tagsSubject.next(this.tags);
			});
		this.storage.get(Item.KEY)
			.then((items: Item[]) => {
				Object.assign(this.items, this.linkItems(items));
				this.itemsSubject.next(this.items);
			});
	}

	getAccount(ca: number | string): Promise<Account> {
		const date: string = isNumber(ca) ? moment(ca).format('YYYY-MM-DD') : ca as string;
		return new Promise<Account>((resolve, reject) => {
			this.storage.get(date)
				.then((account: Account) => {
					console.log('getAccount:', account);
					if (account) {
						resolve(this.linkAccount(account));
					} else {
						resolve(this.linkAccount({
							id: this.getSeq(Account.KEY),
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

	getData(key: string) {
		return this.storage.get(key);
	}

	saveAccount(account: Account) {
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
				this.storage.get(d[1])
					.then((m: string[]) => {
						if (!m) m = [];
						m.push(account.date);
						this.storage.set(d[1], chain(m).sort().sortedUniq().value());
					});
				this.storage.get(d[0])
					.then((y: string[]) => {
						if (!y) y = [];
						y.push(d[1]);
						this.storage.set(d[0], chain(y).sort().sortedUniq().value());
					});
				this.linkAccount(account);
			});
	}

	private linkAccount(account: Account): Account {
		forEach(account.rows, (row: Row) => {
			forEach(row.orders, (order: Order) => {
				if (isNumber(order.item)) {
					order.item = this.getItem(order.item as number);
				}
				return true;
			});
			return true;
		});
		return account;
	}

	private getItem(id: number): Item {
		return find(this.items, (item: Item) => item.id === id);
	}
}
