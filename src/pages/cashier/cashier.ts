import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { find, pull, sumBy } from 'lodash';

import { Row, Order } from '../../entity/row';
import { Item } from '../../entity/item';
import { KeypadPage } from '../keypad/keypad';
import { DbProvider } from '../../providers/db/db';
import { Account } from '../../entity/account';

@Component({
	selector: 'page-cashier',
	templateUrl: 'cashier.html',
})
export class CashierPage {
	row: Row;
	receivable: number;
	date: string;
	max: string;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private modalCtrl: ModalController,
		private dbProvider: DbProvider
	) {
		this.reset();
	}

	reset() {
		this.receivable = 0;
		this.row = {
			ca: new Date().getTime(),
			money: 0,
			orders: [],
		};
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
		this.receivable = sumBy(this.row.orders, 'price');
	}

	sub(i: Order) {
		if (i.num > 1) {
			i.num--;
			i.price -= (i.item as Item).price;
		} else {
			pull(this.row.orders, i);
		}
		this.receivable = sumBy(this.row.orders, 'price');
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
		this.row.ca = new Date(this.date).getTime();
		this.dbProvider.getAccount(this.row.ca)
			.then((account: Account) => {
				account.rows.push(this.row);
				this.dbProvider.saveAccount(account);
				this.reset();
			});
	}
}
