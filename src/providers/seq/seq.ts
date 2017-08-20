import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { isEmpty } from 'lodash';

/**
 * 序列
 */
const SEQ = 'seq';
@Injectable()
export class SeqProvider {
	private seq: any = {};
	constructor(
		private storage: Storage
	) {
		this.storage.ready()
			.then(_ => {
				this.storage.get(SEQ)
					.then(seq => Object.assign(this.seq, seq));
			});
	}

	find(key: string): number {
		let num = 0;
		if (key in this.seq) {
			num = this.seq[key];
		}
		num++;
		this.seq[key] = num;
		this.storage.set(SEQ, this.seq);
		return num;
	}

	getSet(key: string): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			if (isEmpty(this.seq)) {
				this.storage.get(SEQ)
					.then(seq => {
						Object.assign(this.seq, seq);
						resolve(this.find(key));
					});
			} else {
				resolve(this.find(key));
			}
		});
	}
}
