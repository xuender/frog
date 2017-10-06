import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { sortBy, find, isFinite, forEach } from 'lodash';

import { Customer } from '../../entity/customer';
import { SeqProvider } from '../seq/seq';
import { TagProvider } from '../tag/tag';
import { Tag } from '../../entity/tag';
@Injectable()
export class CustomerProvider {
	private _cs: Customer[] = [];
	constructor(
		private storage: Storage,
		private tagProvider: TagProvider,
		private seqProvider: SeqProvider
	) {
		this.getCs();
	}

	reset() {
		if (this._cs.length > 0) {
			this._cs.splice(0, this._cs.length);
			this.getCs();
		}
	}

	get cs(): Customer[] {
		if (this._cs.length == 0) {
			this.getCs();
		}
		return this._cs;
	}

	getCs(): Promise<Customer[]> {
		return new Promise<Customer[]>((resolve, reject) => {
			if (this._cs.length === 0) {
				this.storage.get(Customer.KEY)
					.then((cs: Customer[]) => {
						if (cs) {
							Object.assign(this._cs, sortBy(cs, 'name'));
							resolve(this.link(this._cs));
						} else {
							this.tagProvider.getTags()
								.then(tags => {
									[].push.apply(this._cs, sortBy([
										{
											id: this.seqProvider.find(Customer.KEY),
											name: '张三',
											extend: { 1: -3, 2: 3.1, 3: 40 },
											tags: [],
											phone: '110',
											note: 'ffff',
										},
										{
											id: this.seqProvider.find(Customer.KEY),
											name: '李四',
											extend: { 1: -3, 2: 3.1, 3: 40 },
											tags: [],
											phone: '110',
											note: 'ffff',
										},
										{
											id: this.seqProvider.find(Customer.KEY),
											name: '张三丰',
											extend: { 1: -3, 2: 3.1, 3: 40 },
											tags: [tags[2]],
											phone: '110',
											note: 'ffff',
										},
									], 'name'));
									this.save();
									resolve(this._cs);
								});
						}
					});
			} else {
				resolve(this._cs);
			}
		});
	}

	save() {
		forEach(this._cs, (c: Customer) => {
			const ids: number[] = [];
			forEach(c.tags, (t) => ids.push(isFinite(t) ? t : t.id))
			c.tags = ids;
		})
		this.storage.set(Customer.KEY, this._cs).then((cs) => {
			Object.assign(this._cs, this.link(cs));
			console.debug('saveCustomer', cs);
		});
	}

	private link(cs: Customer[]): Customer[] {
		forEach(cs, (c: Customer) => {
			const tags: Tag[] = [];
			forEach(c.tags, (t) => tags.push(isFinite(t) ? this.tagProvider.find(t) : t));
			c.tags = sortBy(tags, 'order');
		});
		console.log('link cs:', cs)
		return cs;
	}

	find(id: number | string): Customer {
		if (!isFinite(id)) {
			id = parseInt(id as string);
		}
		return find(this._cs, (c) => c.id === id);
	}
}
