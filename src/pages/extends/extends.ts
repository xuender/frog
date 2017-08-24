import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { Extend } from '../../entity/extend';
import { ExtendProvider } from '../../providers/extend/extend';
import { ExtendDetailPage } from '../extend-detail/extend-detail';
import { SeqProvider } from '../../providers/seq/seq';

@Component({
	selector: 'page-extends',
	templateUrl: 'extends.html',
})
export class ExtendsPage {
	exts: Extend[];
	isReorder: boolean = false;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private modalCtrl: ModalController,
		private seqProvider: SeqProvider,
		private extendProvider: ExtendProvider
	) {
		this.exts = extendProvider.exts;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ExtendsPage');
	}

	edit(ext: Extend) {
		const modal = this.modalCtrl.create(ExtendDetailPage, {
			ext: ext,
		});
		modal.onDidDismiss(e => {
			if (e) {
				Object.assign(ext, e);
				this.extendProvider.save();
			}
		})
		modal.present();
	}

	add() {
		const modal = this.modalCtrl.create(ExtendDetailPage, {
			ext: {
				label: '新扩展',
				isNumber: false,
			},
			add: true,
		});
		modal.onDidDismiss((ext: Extend) => {
			if (ext) {
				this.exts.push(Object.assign({
					id: this.seqProvider.find(Extend.KEY),
				}, ext));
				this.extendProvider.save();
			}
		})
		modal.present();
	}

	reorder() {
		this.isReorder = true;
	}

	saveTags() {
		this.isReorder = false;
		this.extendProvider.save();
	}

	reorderTags(indexes) {
		const element = this.exts[indexes.from];
		this.exts.splice(indexes.from, 1);
		this.exts.splice(indexes.to, 0, element);
	}
}
