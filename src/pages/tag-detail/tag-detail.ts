import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Tag } from '../../entity/tag';

@Component({
	selector: 'page-tag-detail',
	templateUrl: 'tag-detail.html',
})
export class TagDetailPage {

	public form: FormGroup;
	public isReadyToSave: boolean;
	public isEdit: boolean;
	constructor(
		public navCtrl: NavController,
		public viewCtrl: ViewController,
		public navParams: NavParams,
		formBuilder: FormBuilder
	) {
		const tag = navParams.get('tag');
		this.isEdit = !navParams.get('add');
		console.log('tag', tag)
		this.form = formBuilder.group({
			name: ['', Validators.required],
			note: ['']
		});
		this.form.setValue({
			name: tag.name,
			note: tag.note,
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
}
