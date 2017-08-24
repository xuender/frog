import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { pull } from 'lodash';

import { Extend } from '../../entity/extend';
import { ExtendProvider } from '../../providers/extend/extend';
@Component({
	selector: 'page-extend-detail',
	templateUrl: 'extend-detail.html',
})
export class ExtendDetailPage {
	form: FormGroup;
	isReadyToSave: boolean;
	isEdit: boolean;
	ext: Extend;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public formBuilder: FormBuilder,
		private alertCtrl: AlertController,
		private extendProvider: ExtendProvider
	) {
		this.ext = navParams.get('ext');
		this.isEdit = !navParams.get('add');
		this.form = formBuilder.group({
			label: ['', Validators.required],
			format: [''],
			isNumber: [false],
		});
		this.form.setValue({
			label: this.ext.label,
			format: this.ext.format,
			isNumber: this.ext.isNumber,
		});
		this.form.valueChanges.subscribe(v => {
			this.isReadyToSave = this.form.valid;
		});
	}

	cancel() {
		this.viewCtrl.dismiss();
	}

	done() {
		this.viewCtrl.dismiss(this.form.value);
	}

	del() {
		this.alertCtrl.create({
			title: '确认删除?',
			message: `是否确认删除客户扩展信息 [ ${this.ext.label} ]?`,
			buttons: [
				{
					text: '取消',
					role: 'cancel',
				},
				{
					text: '删除',
					handler: () => {
						const exts = this.extendProvider.exts;
						pull(exts, this.ext);
						this.extendProvider.save();
						this.viewCtrl.dismiss();
					}
				}
			]
		}).present();
	}
}
