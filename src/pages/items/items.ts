import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Item } from '../../entity/item';

@Component({
	selector: 'page-items',
	templateUrl: 'items.html',
})
export class ItemsPage {
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams
	) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ItemsPage');
	}

	public open(item: Item) {
		console.log('open', item);
	}
}
