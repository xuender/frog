import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { union, forEach, orderBy } from 'lodash';

import { DbProvider } from '../../providers/db/db';
import { Item } from '../../entity/item';
import { Tag } from '../../entity/tag';

@Component({
	selector: 'page-items',
	templateUrl: 'items.html',
})
export class ItemsPage {
	public items: Item[];
	public tags: Tag[];

	private searchText: string;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public dbProvider: DbProvider
	) {
		this.items = this.dbProvider.items;
		if (this.items.length > 0) {
			this.findTags();
		}
		const stop = this.dbProvider.itemsObservable.subscribe((items: Item[]) => {
			this.items = items;
			this.findTags();
			// stop.unsubscribe();
		});
		this.dbProvider.tagsObservable.subscribe((tags: Tag[]) => this.findTags());
	}

	private findTags() {
		let tags = []
		forEach(this.items, (item: Item) => tags = union(tags, item.tags));
		this.tags = orderBy(tags, 'order');
		console.debug('findtags sort', this.tags);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ItemsPage');
	}

	public getItems(ev: any) {
		this.searchText = ev.target.value;
		this.filter();
	}

	private filter() {
		this.items = this.dbProvider.items;
		const text = this.searchText ? this.searchText.trim() : '';
		this.items = this.items.filter((item) => {
			if (text !== '' && item.name.toLowerCase().indexOf(text.toLowerCase()) < 0) {
				return false;
			}
			if (item.tags.length === 0) {
				return true;
			}
			for (const t of item.tags) {
				if (!(t as Tag).hide) {
					return true;
				}
			}
			return false;
		})
	}

	public toggle(tag: Tag) {
		tag.hide = !tag.hide;
		this.filter();
	}
}
