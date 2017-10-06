import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { File, Entry } from '@ionic-native/file';
import { Platform, AlertController, ToastController } from 'ionic-angular';
import { max, forEach, isObject, size, pullAllBy } from 'lodash';
import md5 from 'crypto-js/md5';

import { Bak } from '../../entity/bak';
import { AccountsProvider } from '../accounts/accounts';
import { ItemProvider } from '../item/item';
import { CustomerProvider } from '../customer/customer';
import { ExtendProvider } from '../extend/extend';
import { SeqProvider } from '../seq/seq';
import { SettingProvider } from '../setting/setting';
import { TagProvider } from '../tag/tag';
@Injectable()
export class BakProvider {
	private _baks: Bak[];
	private bakDir: string;

	constructor(
		private storage: Storage,
		private accountsProvider: AccountsProvider,
		private platform: Platform,
		private file: File,
		private alertCtrl: AlertController,
		private toastCtrl: ToastController,
		private itemProvider: ItemProvider,
		private customerProvider: CustomerProvider,
		private extendProvider: ExtendProvider,
		private seqProvider: SeqProvider,
		private settingProvider: SettingProvider,
		private tagProvider: TagProvider
	) {
		this._baks = [];
		console.log(this.platform.platforms());
		this.bakDir = `${this.file.dataDirectory}bak`;
	}

	get baks() {
		if (this._baks.length == 0) {
			this.getBaks();
		}
		return this._baks;
	}

	getBaks() {
		console.log('getBaks');
		return new Promise<Bak[]>((resolve, reject) => {
			if (this._baks.length == 0 && this.platform.is('cordova')) {
				console.log(this.file.dataDirectory);
				this.file.checkDir(this.file.dataDirectory, 'bak')
					.then(_ => {
						this.file.listDir(this.file.dataDirectory, 'bak')
							.then((es: Entry[]) => {
								this._baks.splice(0, this._baks.length);
								forEach(es, (e: Entry) => {
									this._baks.push({
										name: e.name
									});
								});
								resolve(this._baks);
							});
					})
					.catch(err => {
						this.file.createDir(this.file.dataDirectory, 'bak', false);
						resolve(this._baks);
					});
			} else {
				resolve(this._baks);
			}
		});
	}

	private getBak() {
		return new Promise<Bak>((resolve, reject) => {
			this.storage.length()
				.then(l => {
					const data: any = {};
					this.storage.forEach((v, k, i) => {
						data[k] = v;
						if (i == l) {
							const bak: Bak = { data: JSON.stringify(data) };
							this.accountsProvider.allDays()
								.then((days: string[]) => {
									if (days && days.length > 0) {
										bak.date = max(days);
										bak.hash = `${md5(bak.data)}`;
										bak.name = `${bak.date} ${bak.hash}`.substr(0, 20);
										resolve(bak);
									} else {
										this.alertCtrl.create({
											title: `无法备份`,
											subTitle: `没有交易记录`,
											buttons: ['关闭'],
										}).present();
									}
								});
						}
					})
				});
		});
	}

	bak() {
		this.getBak()
			.then(bak => {
				this.file.checkFile(this.bakDir, bak.name)
					.then(_ => {
						// 这里有疑问，什么时候走这个流程
						this.alertCtrl.create({
							title: `备份过，无需再次备份`,
							subTitle: `历史文件名:${bak.name}.`,
							buttons: ['关闭'],
						}).present();
					})
					.catch(e => {
						console.error(`error: ${JSON.stringify(e)}`);
						this.file.createFile(this.bakDir, bak.name, false)
							.then(entry => {
								entry.createWriter(writer => {
									writer.onerror = function(e) {
										console.error(`写入错误:${JSON.stringify(e)}`);
									};
									writer.write(bak.data);
									this._baks.push(bak);
								});
								this.toastCtrl.create({
									message: '备份完毕.',
									duration: 3000,
									position: 'bottom',
								}).present();
							})
							.catch(e => {
								console.error(`创建错误:${JSON.stringify(e)}`);
								this.alertCtrl.create({
									title: `备份过，无需再次备份`,
									subTitle: `历史文件名:${bak.name}.`,
									buttons: ['关闭'],
								}).present();
							});
					});
			});
	}

	restore(bak: Bak) {
		this.file.readAsText(this.bakDir, bak.name)
			.then(data => {
				console.log(data);
				const b = JSON.parse(data);
				if (b && isObject(b)) {
					this.storage.clear()
						.then(_ => {
							const s = size(b);
							let i = 0;
							forEach(b, (v, k) => {
								this.storage.set(k, v)
									.then(_ => {
										i++;
										if (i == s) {
											this.seqProvider.reset();
											this.settingProvider.reset();
											this.tagProvider.reset();
											this.extendProvider.reset();
											this.itemProvider.reset();
											this.accountsProvider.reset();
											this.customerProvider.reset();
											this.toastCtrl.create({
												message: '备份回复完毕.',
												duration: 3000,
												position: 'bottom',
											}).present();
										}
									});
							});
						});
				}
			});
	}

	remove(bak: Bak) {
		this.file.removeFile(this.bakDir, bak.name)
			.then(_ => {
				pullAllBy(this._baks, [{ name: bak.name }], 'name');
				this.toastCtrl.create({
					message: '备份删除完毕.',
					duration: 3000,
					position: 'bottom',
				}).present();
			});
	}
}
