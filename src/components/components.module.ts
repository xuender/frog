import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { FilterItemsComponent } from './filter-items/filter-items';
import { OrdersComponent } from './orders/orders';
@NgModule({
	declarations: [
		FilterItemsComponent,
		OrdersComponent,
	],
	imports: [IonicModule],
	exports: [
		FilterItemsComponent,
		OrdersComponent,
	]
})
export class ComponentsModule { }
