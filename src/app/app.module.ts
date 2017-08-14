import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DbProvider } from '../providers/db/db';
import { SettingsPage } from '../pages/settings/settings';
import { CashierPage } from '../pages/cashier/cashier';
import { ItemsPage } from '../pages/items/items';
import { CustomerPage } from '../pages/customer/customer';
import { TagsPage } from '../pages/tags/tags';
import { TagDetailPage } from '../pages/tag-detail/tag-detail';
import { ComponentsModule } from '../components/components.module';

@NgModule({
	declarations: [
		MyApp,
		TabsPage,
		CashierPage,
		ItemsPage,
		CustomerPage,
		SettingsPage,
		TagsPage,
		TagDetailPage,
	],
	imports: [
		BrowserModule,
		ComponentsModule,
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
		TabsPage,
		CashierPage,
		ItemsPage,
		CustomerPage,
		SettingsPage,
		TagsPage,
		TagDetailPage,
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		DbProvider
	]
})
export class AppModule { }
