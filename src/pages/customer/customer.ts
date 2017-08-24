import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
@Component({
	selector: 'page-customer',
	templateUrl: 'customer.html',
})
export class CustomerPage {
	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad CustomerPage');
	}
}
