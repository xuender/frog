import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Setting } from '../../entity/setting';
import { SettingProvider } from '../../providers/setting/setting';
import { Order } from '../../entity/row';
@Component({
	selector: 'orders',
	templateUrl: 'orders.html'
})
export class OrdersComponent {
	setting: Setting;
	@Input()
	orders: Order[];
	@Output()
	onClick: EventEmitter<Order> = new EventEmitter<Order>();
	constructor(
		private settingProvider: SettingProvider
	) {
		this.setting = this.settingProvider.setting;
	}

	click(order: Order) {
		if (this.onClick) {
			this.onClick.emit(order);
		}
	}
}
