import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { forEach, isNumber, find } from 'lodash';
import { Storage } from '@ionic/storage';

import { Tag } from '../../entity/tag';
import { SeqProvider } from '../seq/seq';
/**
 * 标签
 */
@Injectable()
export class TagProvider {
	private _tags: Tag[];
	private tagsSubject = new Subject<Tag[]>();

	tagsObservable = this.tagsSubject.asObservable();
	constructor(
		private storage: Storage,
		private seqProvider: SeqProvider
	) {
		this._tags = [];
	}

	get tags() {
		if (this._tags.length == 0) {
			this.getTags();
		}
		return this._tags;
	}

	async getTags(): Promise<Tag[]> {
		return await new Promise<Tag[]>((resolve, reject) => {
			if (this._tags.length == 0) {
				this.storage.get(Tag.KEY)
					.then((tags: Tag[]) => {
						if (!tags) {
							tags = [
								{
									id: this.seqProvider.find(Tag.KEY),
									name: '商品',
									hide: false,
									note: '主要销售的商品',
								},
								{
									id: this.seqProvider.find(Tag.KEY),
									name: '耗材',
									hide: false,
									note: '销售需要的耗材',
								}
							];
						}
						console.log('get tags:', tags);
						Object.assign(this._tags, tags);
						this.save();
						resolve(this._tags);
					});
			} else {
				resolve(this._tags);
			}
		});
	}

	save() {
		forEach(this._tags, (t: Tag, i: number) => t.order = i);
		this.storage.set(Tag.KEY, this._tags).then((tags) => {
			this.tagsSubject.next(this._tags);
			console.debug('saveTags', this._tags);
		});
	}

	find(id: number | string): Tag {
		if (!isNumber(id)) {
			id = parseInt(id as string);
		}
		return find(this._tags, (tag) => tag.id === id);
	}
}
