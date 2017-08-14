import { Component } from '@angular/core';

import { CashierPage } from '../cashier/cashier';
import { ItemsPage } from '../items/items';
import { CustomerPage } from '../customer/customer';
import { SettingsPage } from '../settings/settings';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = CashierPage;
	tab2Root = ItemsPage;
	tab3Root = CustomerPage;
	tab4Root = SettingsPage;

	constructor() {

	}
}
