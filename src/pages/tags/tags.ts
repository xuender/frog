import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { forEach, countBy, mergeWith } from 'lodash';

import { Tag, Tags } from '../../entity/tag';
import { TagDetailPage } from '../tag-detail/tag-detail';
import { TagProvider } from '../../providers/tag/tag';
import { ItemProvider } from '../../providers/item/item';
import { SeqProvider } from '../../providers/seq/seq';
import { CustomerProvider } from '../../providers/customer/customer';

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
		private tagProvider: TagProvider,
		private itemProvider: ItemProvider,
		private customerProvider: CustomerProvider,
		private seqProvider: SeqProvider
	) {
		this.isReorder = false;
		this.tags = this.tagProvider.tags;
	}

	ionViewDidLoad() {
		this.itemProvider.getItems()
			.then(items => {
				const count = this.doCount(items);
				for (const id in count) {
					const tag = this.tagProvider.find(id);
					if (tag) tag.items = count[id];
				}
			});
		this.customerProvider.getCs()
			.then(cs => {
				const count = this.doCount(cs);
				for (const id in count) {
					const tag = this.tagProvider.find(id);
					if (tag) tag.customers = count[id];
				}
			});
	}

	private doCount(items: Tags[]): any {
		const count: any = {};
		forEach(items, (item: Tags) => {
			mergeWith(count, countBy(item.tags, 'id'), (a, b) => {
				if (a && b) return a + b;
				if (a) return a;
				if (b) return b;
				return 0;
			});
		});
		return count;
	}

	edit(tag: Tag) {
		const tagModal = this.modalCtrl.create(TagDetailPage, {
			tag: tag,
		});
		tagModal.onDidDismiss((t) => {
			if (t) {
				Object.assign(tag, t);
				this.tagProvider.save();
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
					id: this.seqProvider.find(Tag.KEY),
					hide: false,
					order: this.tags.length,
				}, tag));
				this.tagProvider.save();
			}
		})
		tagModal.present();
	}

	reorder() {
		this.isReorder = true;
	}

	saveTags() {
		this.isReorder = false;
		this.tagProvider.save();
	}

	reorderTags(indexes) {
		const element = this.tags[indexes.from];
		this.tags.splice(indexes.from, 1);
		this.tags.splice(indexes.to, 0, element);
	}
}
