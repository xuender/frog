import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';

/**
 * Generated class for the ItemsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-items',
	templateUrl: 'items.html',
})
export class ItemsPage {

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public dbProvider: DbProvider
	) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ItemsPage');
	}

}
