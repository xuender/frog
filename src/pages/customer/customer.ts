import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { chain } from 'lodash';

import { Customer } from '../../entity/customer';
import { CustomerProvider } from '../../providers/customer/customer';
import { Group } from './group';
@Component({
	selector: 'page-customer',
	templateUrl: 'customer.html',
})
export class CustomerPage {
	groups: Group[] = [];
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private customerProvider: CustomerProvider
	) {
		this.customerProvider.getCs()
			.then((cs: Customer[]) => {
				this.groups = chain(cs)
					.groupBy((c: Customer) => c.name[0])
					.map((v, k) => {
						return { label: k, items: v };
					}).value();
			});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CustomerPage');
	}
}
