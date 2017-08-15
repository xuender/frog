import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { FilterItemsComponent } from './filter-items/filter-items';
@NgModule({
	declarations: [
		FilterItemsComponent,
	],
	imports: [IonicModule],
	exports: [
		FilterItemsComponent,
	]
})
export class ComponentsModule { }
