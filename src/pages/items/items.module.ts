import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemsPage } from './items';
import { DbProvider } from '../../providers/db/db';

@NgModule({
	declarations: [
		ItemsPage,
	],
	imports: [
		IonicPageModule.forChild(ItemsPage),
	],
	providers: [
		DbProvider
	]
})
export class ItemsPageModule { }
