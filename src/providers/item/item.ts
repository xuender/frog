import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { forEach, isNumber, sortBy, find } from 'lodash';
import { Storage } from '@ionic/storage';

import { Item } from '../../entity/item';
import { Tag } from '../../entity/tag';
import { TagProvider } from '../tag/tag';
import { SeqProvider } from '../seq/seq';
/**
 * 商品
 */
@Injectable()
export class ItemProvider {
	private itemsSubject = new Subject<Item[]>();

	private _items: Item[];
	itemsObservable = this.itemsSubject.asObservable();
	constructor(
		private storage: Storage,
		private seqProvider: SeqProvider,
		private tagProvider: TagProvider
	) {
		this._items = [];
	}

	get items(): Item[] {
		if (this._items.length == 0) {
			this.getItems();
		}
		return this._items;
	}

	async getItems() {
		return await new Promise<Item[]>((resolve, reject) => {
			if (this._items.length === 0) {
				this.storage.get(Item.KEY)
					.then((items: Item[]) => {
						this.tagProvider.getTags()
							.then(tags => {
								console.log('getTags:', tags)
								if (items) {
									Object.assign(this._items, this.link(items));
									resolve(this._items);
								} else {
									items = [
										{
											id: this.seqProvider.find(Item.KEY),
											name: '测试商品',
											price: 3,
											tags: [tags[0], tags[1]],
										},
										{
											id: this.seqProvider.find(Item.KEY),
											name: '测试耗材',
											price: 1.5,
											tags: [tags[1]],
										}
									];
									Object.assign(this._items, items);
									this.save();
									resolve(this._items);
								}
							});
					});
			} else {
				resolve(this._items);
			}
		});
	}

	private save() {
		console.log('save items');
		forEach(this._items, (item: Item) => {
			const ids: number[] = [];
			forEach(item.tags, (t) => ids.push(isNumber(t) ? t : t.id))
			item.tags = ids;
		})
		this.storage.set(Item.KEY, this._items).then(items => {
			Object.assign(this._items, this.link(items));
			this.itemsSubject.next(this._items);
		});
	}

	private link(items: Item[]): Item[] {
		forEach(items, (item: Item) => {
			const tags: Tag[] = [];
			forEach(item.tags, (t) => tags.push(isNumber(t) ? this.tagProvider.find(t) : t));
			item.tags = sortBy(tags, 'order');
		});
		console.log('link item:', items)
		return items;
	}

	find(id: number | string): Item {
		if (!isNumber(id)) {
			id = parseInt(id as string);
		}
		return find(this._items, item => item.id === id);
	}
}
