import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TagsPage } from '../tags/tags';

@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
})
export class SettingsPage {
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SettingsPage');
	}

	tags() {
		this.navCtrl.push(TagsPage);
	}
}
