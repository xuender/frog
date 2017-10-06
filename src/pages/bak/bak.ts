import { Component } from '@angular/core';
import { NavController, NavParams, ItemSliding, AlertController } from 'ionic-angular';

import { BakProvider } from '../../providers/bak/bak';
import { Bak } from '../../entity/bak';

@Component({
	selector: 'page-bak',
	templateUrl: 'bak.html',
})
export class BakPage {

	private baks: Bak[];
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private alertCtrl: AlertController,
		private bakProvider: BakProvider
	) {
		this.baks = bakProvider.baks;
	}

	bak() {
		this.bakProvider.bak();
	}

	restore(bak: Bak, item: ItemSliding) {
		this.bakProvider.restore(bak);
		item.close();
	}

	remove(bak: Bak, item: ItemSliding) {
		this.alertCtrl.create({
			title: '确认删除?',
			message: `是否删除${bak.name}备份文件?`,
			buttons: [
				{
					text: '取消',
					role: 'cancel',
				},
				{
					text: '删除',
					handler: () => {
						this.bakProvider.remove(bak);
						item.close();
					}
				}
			]
		}).present();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BakPage');
	}
}
