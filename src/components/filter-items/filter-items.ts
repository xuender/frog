import { union, forEach, orderBy } from 'lodash';
import { Component, Output, EventEmitter } from '@angular/core';
import { Item } from '../../entity/item';
import { Tag } from '../../entity/tag';
import { TagProvider } from '../../providers/tag/tag';
import { ItemProvider } from '../../providers/item/item';
import { Setting } from '../../entity/setting';
import { SettingProvider } from '../../providers/setting/setting';

@Component({
	selector: 'filter-items',
	templateUrl: 'filter-items.html'
})
export class FilterItemsComponent {
	private searchText: string;
	setting: Setting;
	items: Item[];
	tags: Tag[];
	@Output() select: EventEmitter<Item> = new EventEmitter<Item>();
	constructor(
		private itemProvider: ItemProvider,
		private tagProvider: TagProvider,
		private settingProvider: SettingProvider
	) {
		this.items = this.itemProvider.items;
		if (this.items.length > 0) {
			this.tags = this.tagProvider.findTags(this.items);
		}
		this.itemProvider.itemsObservable.subscribe((items: Item[]) => {
			this.items = items;
			this.tags = this.tagProvider.findTags(this.items);
			// stop.unsubscribe();
		});
		this.tagProvider.tagsObservable.subscribe((tags: Tag[]) => this.tags = this.tagProvider.findTags(this.items));
		this.setting = this.settingProvider.setting;
	}

	public getItems(ev: any) {
		this.searchText = ev.target.value;
		this.filter();
	}

	private filter() {
		this.items = this.itemProvider.items;
		const text = this.searchText ? this.searchText.trim() : '';
		this.items = this.items.filter((item) => {
			if (text !== '' && item.name.toLowerCase().indexOf(text.toLowerCase()) < 0) {
				return false;
			}
			if (item.tags.length === 0) {
				return true;
			}
			for (const t of item.tags) {
				if (!(t as Tag).hide) {
					return true;
				}
			}
			return false;
		})
	}

	public toggle(tag: Tag) {
		tag.hide = !tag.hide;
		this.filter();
	}

	public click(item: Item) {
		this.select.emit(item);
	}
}
