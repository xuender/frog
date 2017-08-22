import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Setting } from '../../entity/setting';
@Injectable()
export class SettingProvider {
	setting: Setting;
	constructor(
		private storage: Storage
	) {
		this.setting = {
			displayCost: true,
			displayProfit: true,
		};
		this.storage.ready()
			.then(_ => {
				this.storage.get(Setting.KEY)
					.then(setting => {
						if (setting) {
							Object.assign(this.setting, setting);
						}
					});
			});
	}

	save() {
		console.log('save');
		this.storage.set(Setting.KEY, this.setting);
	}

	getSetting() {
		return new Promise<Setting>((resolve, reject) => {
			this.storage.get(Setting.KEY)
				.then(setting => {
					if (setting) {
						Object.assign(this.setting, setting);
						resolve(this.setting);
					}
				});
		});
	}
}
