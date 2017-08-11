import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Item } from '../../entity/item';
import * as localforage from 'localforage';
import { indexOf } from 'lodash';

@Injectable()
export class DbProvider {

	public items: Item[] = [];
	constructor() {
		console.log('constructo DbProvider');
		localforage.config({
			// driver: localforage.WEBSQL,
			driver: localforage.LOCALSTORAGE,
			name: 'frog',
			version: 1.0,
			size: 4980736,
			storeName: 'frog',
			description: 'frog database'
		});
		localforage.keys().then((keys) => {
			if (indexOf(keys, 'items') < 0) {
				this.init();
			} else {
				this.load();
			}
		});
	}
	private init() {
		this.items.push({ id: 1, name: '测试商品' });
		localforage.setItem('items', this.items);
	}
	private load() {
		localforage.getItem('items', (err, items: Item[]) => this.items = items);
	}

}
