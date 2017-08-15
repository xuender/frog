import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
	selector: 'page-keypad',
	templateUrl: 'keypad.html',
})
export class KeypadPage {
	num: number;
	private str: Array<string | number>;
	constructor(
		public navCtrl: NavController,
		public viewCtrl: ViewController,
		public navParams: NavParams
	) {
		this.num = 0;
		this.str = [];
	}

	add(n: number) {
		this.str.push(n);
		this.toNum();
	}

	private toNum() {
		const str = this.str.join('');
		if (str.length == 0) {
			this.num = 0;
		} else {
			this.num = parseFloat(str);
		}
	}

	del() {
		this.str.pop();
		this.toNum();
	}

	dot() {
		this.str.push('.');
		this.toNum();
	}

	cancel() {
		this.viewCtrl.dismiss();
	}

	done() {
		this.viewCtrl.dismiss(this.num);
	}
}
