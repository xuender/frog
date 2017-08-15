import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { find, pull } from 'lodash';
import { Row, Items } from '../../entity/row';
import { Item } from '../../entity/item';

@Component({
	selector: 'page-cashier',
	templateUrl: 'cashier.html',
})
export class CashierPage {
	public row: Row;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams
	) {
		this.reset();
	}

	public reset() {
		this.row = {
			ca: new Date().getTime(),
			money: 0,
			items: [],
		};
		console.log('row', this.row);
	}

	public addItem(item: Item) {
		const is = find(this.row.items, (i: Items) => i.item === item);
		if (is) {
			is.num++;
			is.price += is.item.price;
		} else {
			this.row.items.push({ item: item, num: 1, price: item.price });
		}
	}

	public sub(i: Items) {
		if (i.num > 1) {
			i.num--;
			i.price -= (i.item as Item).price;
		} else {
			pull(this.row.items, i);
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CashierPage');
	}
}
