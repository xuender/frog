import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { sumBy, forEach, find, indexOf } from 'lodash';
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
	previous: string;
	next: string;
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
		this.accountsProvider.allDays()
			.then(dates => {
				const i = indexOf(dates, this.account.date);
				if (i > 0) {
					this.previous = dates[i - 1];
				} else {
					this.previous = '';
				}
				if (i < dates.length - 1) {
					this.next = dates[i + 1];
				} else {
					this.next = '';
				}
			});
	}


	ionViewDidLoad() {
		console.log('ionViewDidLoad AccountsPage');
	}

	days(date = this.account.date) {
		const daysAlert = this.alertCtrl.create();
		daysAlert.setTitle('选择日期');
		this.accountsProvider.days(date)
			.then(days => {
				const inputs = [];
				forEach(days, day => {
					inputs.push({
						type: 'radio',
						label: day,
						value: day,
						checked: day == date,
					});
				});
				if (inputs.length > 0 && !find(inputs, i => i.checked)) {
					inputs[0].checked = true;
				}
				forEach(inputs, i => daysAlert.addInput(i));
				daysAlert.addButton('取消');
				daysAlert.addButton({
					text: '确定',
					handler: data => {
						console.log('data', data);
						this.show(data);
					}
				});
				daysAlert.present();
			});
	}

	show(date: string) {
		this.accountsProvider.getAccounts(date)
			.then(account => this.open(account));
	}

	months(date = this.account.date) {
		const monthsAlert = this.alertCtrl.create();
		monthsAlert.setTitle('选择月份');
		this.accountsProvider.months(date)
			.then(months => {
				const inputs = [];
				forEach(months, month => {
					inputs.push({
						type: 'radio',
						label: month,
						value: month,
						checked: date.startsWith(month),
					});
				});
				if (inputs.length > 0 && !find(inputs, i => i.checked)) {
					inputs[0].checked = true;
				}
				forEach(inputs, i => monthsAlert.addInput(i));
				monthsAlert.addButton('取消');
				monthsAlert.addButton({
					text: '确定',
					handler: data => {
						this.days(data);
					}
				});
				monthsAlert.present();
			});
	}

	years(date = this.account.date) {
		const yearsAlert = this.alertCtrl.create();
		yearsAlert.setTitle('选择年份');
		this.accountsProvider.years()
			.then(years => {
				forEach(years, year => {
					yearsAlert.addInput({
						type: 'radio',
						label: year,
						value: year,
						checked: date.startsWith(year),
					});
				})
				yearsAlert.addButton('取消');
				yearsAlert.addButton({
					text: '确定',
					handler: data => {
						this.months(data);
					}
				});
				yearsAlert.present();
			});
	}
}
