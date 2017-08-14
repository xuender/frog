import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { pull } from 'lodash';

import { Tag } from '../../entity/tag';
import { DbProvider } from '../../providers/db/db';

@Component({
	selector: 'page-tag-detail',
	templateUrl: 'tag-detail.html',
})
export class TagDetailPage {
	public form: FormGroup;
	public isReadyToSave: boolean;
	public isEdit: boolean;
	public tag: Tag;
	constructor(
		public navCtrl: NavController,
		public viewCtrl: ViewController,
		public navParams: NavParams,
		private alertCtrl: AlertController,
		private dbProvider: DbProvider,
		formBuilder: FormBuilder
	) {
		this.tag = navParams.get('tag');
		this.isEdit = !navParams.get('add');
		console.log('tag', this.tag)
		this.form = formBuilder.group({
			name: ['', Validators.required],
			note: ['']
		});
		this.form.setValue({
			name: this.tag.name,
			note: this.tag.note,
		});
		this.form.valueChanges.subscribe((v) => {
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
			message: `是否确认删除标签 [ ${this.tag.name} ]?`,
			buttons: [
				{
					text: '取消',
					role: 'cancel',
				},
				{
					text: '删除',
					handler: () => {
						pull(this.dbProvider.tags, this.tag);
						this.dbProvider.saveTags();
						this.viewCtrl.dismiss();
					}
				}
			]
		}).present();
	}
}
