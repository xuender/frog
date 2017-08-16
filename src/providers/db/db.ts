import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import * as localforage from 'localforage';
import { indexOf, forEach, isNumber, find, sortBy } from 'lodash';
import * as moment from 'moment';

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
	constructor() {
		console.log('constructo DbProvider');
		localforage.config({
			// driver: localforage.WEBSQL,
			driver: localforage.LOCALSTORAGE,
			name: 'frog',
			version: 1.0,
			size: 4 * 1024 * 1024,
			storeName: 'frog',
			description: 'frog database'
		});
		localforage.keys().then((keys) => {
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
		localforage.setItem(Tag.KEY, this.tags).then((tags) => {
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
		localforage.setItem(Item.KEY, this.items).then((items) => {
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
		localforage.setItem(SEQ, this.seq);
		return num;
	}

	private load() {
		localforage.getItem(SEQ, (err, seq: any) => Object.assign(this.seq, seq));
		localforage.getItem(Tag.KEY, (err, tags: Tag[]) => {
			Object.assign(this.tags, tags);
			this.tagsSubject.next(this.tags);
		});
		localforage.getItem(Item.KEY, (err, items: Item[]) => {
			Object.assign(this.items, this.linkItems(items));
			this.itemsSubject.next(this.items);
		});
	}

	getAccount(ca: number): Promise<Account> {
		const date = moment(ca).format('YY-MM-DD');
		return new Promise<Account>((resolve, reject) => {
			localforage.getItem(date)
				.then((account: Account) => {
					if (account) {
						resolve(account);
					} else {
						resolve({
							id: this.getSeq(Account.KEY),
							date: date,
							rows: [],
						});
					}
				})
				.catch((error) => {
					console.log('account error:', error, ca);
					reject(error);
				});
		});
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
		localforage.setItem(account.date, account)
			.then((a: Account) => {
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
