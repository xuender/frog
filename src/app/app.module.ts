import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';

import { ComponentsModule } from '../components/components.module';
import { ExtendPipe } from '../pipes/extend/extend';

import { SettingsPage } from '../pages/settings/settings';
import { CashierPage } from '../pages/cashier/cashier';
import { ItemsPage } from '../pages/items/items';
import { CustomerPage } from '../pages/customer/customer';
import { TagsPage } from '../pages/tags/tags';
import { TagDetailPage } from '../pages/tag-detail/tag-detail';
import { KeypadPage } from '../pages/keypad/keypad';
import { AccountsPage } from '../pages/accounts/accounts';
import { ExtendDetailPage } from '../pages/extend-detail/extend-detail';
import { BakPage } from '../pages/bak/bak';

import { AccountsProvider } from '../providers/accounts/accounts';
import { TagProvider } from '../providers/tag/tag';
import { ItemProvider } from '../providers/item/item';
import { SeqProvider } from '../providers/seq/seq';
import { SettingProvider } from '../providers/setting/setting';
import { ExtendsPage } from '../pages/extends/extends';
import { ExtendProvider } from '../providers/extend/extend';
import { CustomerProvider } from '../providers/customer/customer';
import { BakProvider } from '../providers/bak/bak';

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
		ExtendsPage,
		ExtendDetailPage,
		BakPage,

		ExtendPipe,
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
		ExtendsPage,
		ExtendDetailPage,
		BakPage,
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		{ provide: LOCALE_ID, useValue: 'zh-CN' },
		File,
		AccountsProvider,
		TagProvider,
		ItemProvider,
		SeqProvider,
		SettingProvider,
		ExtendProvider,
		CustomerProvider,
		BakProvider,
	]
})
export class AppModule { }
