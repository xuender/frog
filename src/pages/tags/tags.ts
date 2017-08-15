import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { forEach, countBy, mergeWith } from 'lodash';

import { DbProvider } from '../../providers/db/db';
import { Tag } from '../../entity/tag';
import { Item } from '../../entity/item';
import { TagDetailPage } from '../tag-detail/tag-detail';

@Component({
	selector: 'page-tags',
	templateUrl: 'tags.html',
})
export class TagsPage {
	public tags: Tag[];
	public isReorder: boolean;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private modalCtrl: ModalController,
		private dbProvider: DbProvider
	) {
		this.isReorder = false;
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

	edit(tag: Tag) {
		const tagModal = this.modalCtrl.create(TagDetailPage, {
			tag: tag,
		});
		tagModal.onDidDismiss((t) => {
			if (t) {
				Object.assign(tag, t);
				this.dbProvider.saveTags();
			}
		})
		tagModal.present();
	}

	add() {
		const tagModal = this.modalCtrl.create(TagDetailPage, {
			tag: {
				name: '新标签',
				note: '',
			},
			add: true,
		});
		tagModal.onDidDismiss((tag: Tag) => {
			if (tag) {
				this.tags.push(Object.assign({
					id: this.dbProvider.getSeq(Tag.KEY),
					hide: false,
					order: this.tags.length,
				}, tag));
				this.dbProvider.saveTags();
			}
		})
		tagModal.present();
	}

	reorder() {
		this.isReorder = true;
	}

	saveTags() {
		this.isReorder = false;
		this.dbProvider.saveTags();
	}

	reorderTags(indexes) {
		const element = this.tags[indexes.from];
		this.tags.splice(indexes.from, 1);
		this.tags.splice(indexes.to, 0, element);
	}
}
