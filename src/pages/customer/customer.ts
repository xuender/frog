import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { chain } from 'lodash';

import { Customer } from '../../entity/customer';
import { CustomerProvider } from '../../providers/customer/customer';
import { Group } from './group';
import { Tag } from '../../entity/tag';
import { TagProvider } from '../../providers/tag/tag';
@Component({
	selector: 'page-customer',
	templateUrl: 'customer.html',
})
export class CustomerPage {
	private cs: Customer[];
	private searchText = '';
	private isSelect: boolean;
	groups: Group[] = [];
	tags: Tag[] = [];
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		private customerProvider: CustomerProvider,
		tagProvider: TagProvider
	) {
		this.isSelect = navParams.get('select');
		this.customerProvider.getCs()
			.then((cs: Customer[]) => {
				this.cs = cs;
				this.group();
				this.tags = tagProvider.findTags(this.cs);
				console.log('cs', JSON.stringify(this.tags));
			});
	}

	private group() {
		this.groups = chain(this.cs)
			.groupBy((c: Customer) => c.name[0])
			.map((v, k) => {
				return { label: k, items: v };
			}).value();
	}

	filter(ev: any) {
		this.searchText = ev.target.value;
		this.doFilter();
	}

	private doFilter() {
		this.cs = this.customerProvider.cs;
		const text = this.searchText ? this.searchText.trim() : '';
		this.cs = this.cs.filter(c => {
			if (text !== '' && c.name.toLowerCase().indexOf(text.toLowerCase()) < 0) {
				return false;
			}
			if (c.tags.length === 0) {
				return true;
			}
			for (const t of c.tags) {
				if (!(t as Tag).hide) {
					return true;
				}
			}
			return false;
		});
		this.group();
	}

	toggle(tag: Tag) {
		tag.hide = !tag.hide;
		this.doFilter();
	}

	edit(c: Customer) {
		if (this.isSelect) {
			this.viewCtrl.dismiss(c);
		} else {
		}
	}
}
