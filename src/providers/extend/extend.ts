import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Extend } from '../../entity/extend';
import { SeqProvider } from '../seq/seq';
/**
 * 用户扩展设置
 */
@Injectable()
export class ExtendProvider {
	private _exts: Extend[] = [];
	constructor(
		private storage: Storage,
		private seqProvider: SeqProvider
	) {
		console.log('Hello ExtendProvider Provider');
	}

	get exts() {
		if (this._exts.length == 0) {
			this.getExts();
		}
		return this._exts;
	}

	getExts(): Promise<Extend[]> {
		return new Promise<Extend[]>((resolve, reject) => {
			if (this._exts.length == 0) {
				this.storage.get(Extend.KEY)
					.then((exts: Extend[]) => {
						if (!exts) {
							exts = [
								{
									id: this.seqProvider.find(Extend.KEY),
									label: '左球镜',
									isNumber: true,
									format: '3.2-2',
								},
								{
									id: this.seqProvider.find(Extend.KEY),
									label: '左柱镜',
									isNumber: true,
									format: '3.2-2',
								},
								{
									id: this.seqProvider.find(Extend.KEY),
									label: '左轴位',
									isNumber: true,
									format: '3.2-2',
								},
								{
									id: this.seqProvider.find(Extend.KEY),
									label: '右球镜',
									isNumber: true,
									format: '3.2-2',
								},
								{
									id: this.seqProvider.find(Extend.KEY),
									label: '右柱镜',
									isNumber: true,
									format: '3.2-2',
								},
								{
									id: this.seqProvider.find(Extend.KEY),
									label: '右轴位',
									isNumber: true,
									format: '3.2-2',
								},
								{
									id: this.seqProvider.find(Extend.KEY),
									label: '瞳距',
									isNumber: true,
									format: '3.2-2',
								},
							];
						}
						console.log('get exts:', exts);
						Object.assign(this._exts, exts);
						this.save();
						resolve(this._exts);
					});
			} else {
				resolve(this._exts);
			}
		});
	}

	save() {
		this.storage.set(Extend.KEY, this._exts).then(exts => {
			// this.tagsSubject.next(this._tags);
			console.debug('saveExts', this._exts);
		});
	}
}
