import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SettingsPage } from '../pages/settings/settings';
import { CashierPage } from '../pages/cashier/cashier';
import { ItemsPage } from '../pages/items/items';
import { CustomerPage } from '../pages/customer/customer';
import { TagsPage } from '../pages/tags/tags';
import { TagDetailPage } from '../pages/tag-detail/tag-detail';
import { ComponentsModule } from '../components/components.module';
import { KeypadPage } from '../pages/keypad/keypad';
import { AccountsPage } from '../pages/accounts/accounts';
import { AccountsProvider } from '../providers/accounts/accounts';
import { TagProvider } from '../providers/tag/tag';
import { ItemProvider } from '../providers/item/item';
import { SeqProvider } from '../providers/seq/seq';
import { SettingProvider } from '../providers/setting/setting';

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
		KeypadPage,
		AccountsPage,
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
		IonicStorageModule.forRoot({
			name: 'frog',
			// driverOrder: ['indexeddb', 'sqlite', 'websql'],
			driverOrder: ['localstorage', 'indexeddb', 'sqlite', 'websql'],
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
		KeypadPage,
		AccountsPage,
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		{ provide: LOCALE_ID, useValue: 'zh-CN' },
		AccountsProvider,
		TagProvider,
		ItemProvider,
		SeqProvider,
    SettingProvider,
	]
})
export class AppModule { }
