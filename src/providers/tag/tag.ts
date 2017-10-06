import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { forEach, isFinite, find, orderBy, union } from 'lodash';
import { Storage } from '@ionic/storage';

import { Tag, Tags } from '../../entity/tag';
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
		this.reset();
	}

	reset() {
		if (this._tags.length > 0) {
			this._tags.splice(0, this._tags.length);
		}
		this.getTags();
	}

	get tags() {
		if (this._tags.length == 0) {
			this.getTags();
		}
		return this._tags;
	}

	getTags(): Promise<Tag[]> {
		return new Promise<Tag[]>((resolve, reject) => {
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
								},
								{
									id: this.seqProvider.find(Tag.KEY),
									name: 'VIP',
									hide: false,
									note: '重要客户',
								},
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
		if (!isFinite(id)) {
			id = parseInt(id as string);
		}
		return find(this._tags, (tag) => tag.id === id);
	}

	findTags(tags: Tags[]): Tag[] {
		let ts = [];
		forEach(tags, (t: Tags) => ts = union(ts, t.tags));
		return orderBy(ts, 'order');
	}
}
