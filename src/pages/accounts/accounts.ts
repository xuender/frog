import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { sumBy } from 'lodash';
import { DbProvider } from '../../providers/db/db';
import { Account } from '../../entity/account';

@Component({
	selector: 'page-accounts',
	templateUrl: 'accounts.html',
})
export class AccountsPage {

	date: string;
	account: Account;
	sum: number;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private dbProvider: DbProvider
	) {
		this.date = this.navParams.get('date');
		if (!this.date) {
			this.date = moment(new Date()).format('YYYY-MM-DD');
		}
		this.dbProvider.getAccount(this.date)
			.then((a: Account) => {
				this.account = a;
				this.sum = sumBy(this.account.rows, 'money');
			});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AccountsPage');
	}
}
