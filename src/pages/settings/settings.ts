import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TagsPage } from '../tags/tags';
import { SettingProvider } from '../../providers/setting/setting';
import { Setting } from '../../entity/setting';
import { ExtendsPage } from '../extends/extends';
import { BakPage } from '../bak/bak';

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

	tags() {
		this.navCtrl.push(TagsPage);
	}

	exts() {
		this.navCtrl.push(ExtendsPage);
	}

	save() {
		this.settingProvider.save();
	}

	bak() {
		this.navCtrl.push(BakPage);
	}
}
