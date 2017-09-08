import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { find, pull, sumBy } from 'lodash';
import * as moment from 'moment';

import { Row, Order } from '../../entity/row';
import { Item } from '../../entity/item';
import { KeypadPage } from '../keypad/keypad';
import { Account } from '../../entity/account';
import { AccountsPage } from '../accounts/accounts';
import { AccountsProvider } from '../../providers/accounts/accounts';
import { Setting } from '../../entity/setting';
import { SettingProvider } from '../../providers/setting/setting';
import { CustomerPage } from '../customer/customer';
import { Customer } from '../../entity/customer';
import { CustomerProvider } from '../../providers/customer/customer';

@Component({
	selector: 'page-cashier',
	templateUrl: 'cashier.html',
})
export class CashierPage {
	row: Row;
	date: string;
	max: string;
	setting: Setting;
	private oldCa: number;
	private oldMoney: number;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private modalCtrl: ModalController,
		private accountsProvider: AccountsProvider,
		private customerProvider: CustomerProvider,
		private settingProvider: SettingProvider
	) {
		const row = this.navParams.get('row');
		this.oldMoney = 0;
		if (row) {
			this.oldCa = row.ca;
			this.oldMoney = row.money;
			this.reset(row);
		} else {
			this.oldCa = 0;
			this.reset();
		}
		this.setting = this.settingProvider.setting;
	}

	reset(row = {
		ca: new Date().getTime(),
		money: 0,
		price: 0,
		orders: [],
	}) {
		this.row = row;
		this.date = new Date(this.row.ca).toISOString();
		this.max = `${new Date().getFullYear() + 1}`;
	}

	addItem(item: Item) {
		const is = find(this.row.orders, (i: Order) => i.item === item);
		if (is) {
			is.num++;
			is.price += is.item.price;
		} else {
			this.row.orders.push({ item: item, num: 1, price: item.price });
		}
		this.row.price = sumBy(this.row.orders, 'price');
	}

	sub(i: Order) {
		if (i.num > 1) {
			i.num--;
			i.price -= (i.item as Item).price;
		} else {
			pull(this.row.orders, i);
		}
		this.row.price = sumBy(this.row.orders, 'price');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CashierPage');
	}

	money() {
		const keypadModal = this.modalCtrl.create(KeypadPage);
		keypadModal.onDidDismiss((money: number) => {
			if (money) {
				this.row.money = money;
			}
		});
		keypadModal.present();
	}

	done() {
		if (this.row.customer) {
			const c = this.row.customer as Customer;
			if (!c.total) {
				c.total = 0;
			}
			c.total += (this.row.money - this.oldMoney);
			console.log('c', c, this.row.money, this.oldMoney);
			this.customerProvider.save();
		}
		if (this.oldCa) {
			this.accountsProvider.getAccounts(this.oldCa)
				.then((account: Account) => {
					this.accountsProvider.save(account);
					this.navCtrl.pop();
				});
		} else {
			this.row.ca = new Date(this.date).getTime();
			this.accountsProvider.getAccounts(this.row.ca)
				.then((account: Account) => {
					account.rows.push(this.row);
					this.accountsProvider.save(account);
					this.reset();
				});
		}
	}

	accounts() {
		this.row.ca = new Date(this.date).getTime();
		this.accountsProvider.getAccounts(moment(this.row.ca).format('YYYY-MM-DD'))
			.then((a: Account) => {
				this.navCtrl.push(AccountsPage, { account: a });
			});
	}

	selectCustomer() {
		const modal = this.modalCtrl.create(CustomerPage, { select: true });
		modal.onDidDismiss((c: Customer) => {
			if (c) {
				this.row.customer = c;
			}
		});
		modal.present();
	}
}
