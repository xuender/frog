import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TagsPage } from '../tags/tags';
import { SettingProvider } from '../../providers/setting/setting';
import { Setting } from '../../entity/setting';

@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
})
export class SettingsPage {
	setting: Setting;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private settingProvider: SettingProvider
	) {
		this.setting = this.settingProvider.setting;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SettingsPage');
	}

	tags() {
		this.navCtrl.push(TagsPage);
	}

	save() {
		this.settingProvider.save();
	}
}
