import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as localforage from 'localforage';
import { indexOf } from 'lodash';

import { Item } from '../../entity/item';

const SEQ = 'seq';
@Injectable()
export class DbProvider {
	public items: Item[] = [];
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
		this.items.push({
			id: this.getSeq(Item.KEY),
			name: '测试商品',
		});
		localforage.setItem(Item.KEY, this.items);
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
		localforage.getItem(SEQ, (err, seq: any) => this.seq = seq);
		localforage.getItem(Item.KEY, (err, items: Item[]) => this.items = items);
	}
}
