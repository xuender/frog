import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { sumBy, forEach } from 'lodash';
import { Account } from '../../entity/account';
import { AccountsProvider } from '../../providers/accounts/accounts';

@Component({
	selector: 'page-accounts',
	templateUrl: 'accounts.html',
})
export class AccountsPage {

	date: string;
	account: Account;
	sum: number;
	price: number;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private alertCtrl: AlertController,
		private accountsProvider: AccountsProvider
	) {
		this.open(this.navParams.get('account'));
	}

	private open(account: Account) {
		this.account = account;
		this.date = this.account.date;
		this.sum = sumBy(this.account.rows, 'money');
		this.price = sumBy(this.account.rows, 'price');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AccountsPage');
	}

	days() {
		const daysAlert = this.alertCtrl.create();
		daysAlert.setTitle('选择日期');
		this.accountsProvider.days(this.account.date)
			.then(days => {
				forEach(days, (day, i) => {
					daysAlert.addInput({
						type: 'radio',
						label: day,
						value: day,
						checked: day == this.account.date,
					});
				})
				daysAlert.addButton('取消');
				daysAlert.addButton({
					text: '确定',
					handler: data => {
						console.log('data', data);
						this.accountsProvider.getAccounts(data)
							.then(account => this.open(account));
					}
				});
				daysAlert.present();
			});
	}
	months() {
		const monthsAlert = this.alertCtrl.create();
		monthsAlert.setTitle('选择月份');
		this.accountsProvider.months(this.account.date)
			.then(months => {
				forEach(months, month => {
					monthsAlert.addInput({
						type: 'radio',
						label: month,
						value: month,
						checked: this.account.date.startsWith(month),
					});
				})
				monthsAlert.addButton('取消');
				monthsAlert.addButton({
					text: '确定',
					handler: data => {
						console.log('data', data);
					}
				});
				monthsAlert.present();
			});
	}
}
