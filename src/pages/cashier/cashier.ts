import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { find, pull, sumBy } from 'lodash';
import { Row, Items } from '../../entity/row';
import { Item } from '../../entity/item';
import { KeypadPage } from '../keypad/keypad';

@Component({
	selector: 'page-cashier',
	templateUrl: 'cashier.html',
})
export class CashierPage {
	row: Row;
	receivable: number;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private modalCtrl: ModalController
	) {
		this.reset();
	}

	reset() {
		this.receivable = 0;
		this.row = {
			ca: new Date().getTime(),
			money: 0,
			items: [],
		};
		console.log('row', this.row);
	}

	addItem(item: Item) {
		const is = find(this.row.items, (i: Items) => i.item === item);
		if (is) {
			is.num++;
			is.price += is.item.price;
		} else {
			this.row.items.push({ item: item, num: 1, price: item.price });
		}
		this.receivable = sumBy(this.row.items, 'price');
	}

	sub(i: Items) {
		if (i.num > 1) {
			i.num--;
			i.price -= (i.item as Item).price;
		} else {
			pull(this.row.items, i);
		}
		this.receivable = sumBy(this.row.items, 'price');
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
}
