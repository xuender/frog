import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DbProvider } from '../providers/db/db';
import { ItemsPageModule } from '../pages/items/items.module';
import { TagsPageModule } from '../pages/tags/tags.module';
import { CashierPageModule } from '../pages/cashier/cashier.module';
import { CustomerPageModule } from '../pages/customer/customer.module';
import { SettingsPageModule } from '../pages/settings/settings.module';

@NgModule({
	declarations: [
		MyApp,
		HomePage,
		ListPage,
		TabsPage,
	],
	imports: [
		BrowserModule,
		TagsPageModule,
		CashierPageModule,
		ItemsPageModule,
		CustomerPageModule,
		SettingsPageModule,
		IonicModule.forRoot(MyApp, {
			backButtonText: '返回',
			iconMode: 'ios',
			tabsPlacement: 'bottom',
			pageTransition: 'ios',
		}),
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		ListPage,
		TabsPage
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		DbProvider
	]
})
export class AppModule { }
