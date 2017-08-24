import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { sortBy } from 'lodash';

import { Customer } from '../../entity/customer';
import { SeqProvider } from '../seq/seq';
import { TagProvider } from '../tag/tag';
@Injectable()
export class CustomerProvider {
	private _cs: Customer[] = [];
	constructor(
		private storage: Storage,
		private tagProvider: TagProvider,
		private seqProvider: SeqProvider
	) {
		console.log('Hello CustomerProvider Provider');
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
							resolve(this._cs);
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
									resolve(this._cs);
								});
						}
					});
			} else {
				resolve(this._cs);
			}
		});
	}
}
