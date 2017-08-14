import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as localforage from 'localforage';
import { indexOf, forEach, isNumber, find, sortBy } from 'lodash';

import { Item } from '../../entity/item';
import { Tag } from '../../entity/tag';

const SEQ = 'seq';
@Injectable()
export class DbProvider {
	public items: Item[] = [];
	public tags: Tag[] = [];
	private seq: any = {};

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
			tags: [tag1, tag2],
		});
		this.items.push({
			id: this.getSeq(Item.KEY),
			name: '测试耗材',
			tags: [tag2],
		});
		this.saveItems();
	}

	public saveTags() {
		forEach(this.tags, (t: Tag, i: number) => t.order = i);
		localforage.setItem(Tag.KEY, this.tags);
	}

	private saveItems() {
		forEach(this.items, (item: Item) => {
			const ids: number[] = [];
			forEach(item.tags, (t) => ids.push(isNumber(t) ? t : t.id))
			item.tags = ids;
		})
		localforage.setItem(Item.KEY, this.items).then((items) => {
			Object.assign(this.items, this.linkItems(items));
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

	public getTag(id: number | string): Tag {
		if (!isNumber(id)) {
			id = parseInt(id as string);
		}
		return find(this.tags, (tag) => tag.id === id);
	}

	public getSeq(key: string): number {
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
		localforage.getItem(Tag.KEY, (err, tags: Tag[]) => Object.assign(this.tags, tags));
		localforage.getItem(Item.KEY, (err, items: Item[]) => {
			Object.assign(this.items, this.linkItems(items));
		});
	}
}
