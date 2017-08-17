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
		this.account = this.navParams.get('account');
		this.date = this.account.date;
		this.sum = sumBy(this.account.rows, 'money');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AccountsPage');
	}
}
