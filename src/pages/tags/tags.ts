import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { forEach, countBy, mergeWith } from 'lodash';

import { DbProvider } from '../../providers/db/db';
import { Tag } from '../../entity/tag';
import { Item } from '../../entity/item';

@IonicPage()
@Component({
	selector: 'page-tags',
	templateUrl: 'tags.html',
})
export class TagsPage {
	public tags: Tag[];
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public dbProvider: DbProvider
	) {
		this.tags = this.dbProvider.tags;
	}

	ionViewDidLoad() {
		let count: any = {};
		forEach(this.dbProvider.items, (item: Item) => {
			mergeWith(count, countBy(item.tags, 'id'), (a, b) => {
				if (a && b) return a + b;
				if (a) return a;
				if (b) return b;
				return 0;
			});
		});
		for (const id in count) {
			const tag = this.dbProvider.getTag(id);
			if (tag) tag.count = count[id];
		}
	}
}
