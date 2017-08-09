import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ItemsPage } from '../pages/items/items';
import { createConnection } from 'typeorm';
import { Item } from '../entity/item';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = HomePage;

	pages: Array<{ title: string, component: any }>;

	constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Home', component: HomePage },
			{ title: 'List', component: ListPage },
			{ title: '商品', component: ItemsPage },
		];

	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			createConnection({
				driver: {
					type: "sqlite",
					database: "db/MyAppDB.db"
				},
				entities: [
					Item,
				],
				autoSchemaSync: true,
			}).then(async connection => {
				const item = new Item();
				item.name = '测试商品1';
				const itemRepository = connection.getRepository(Item);
				await itemRepository.persist(item);
				console.log("Item has been saved: ", item);
				// this.items = await itemRepository.find();
				console.log('find');
			}).catch(error => console.log(error));
		});
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}
}
