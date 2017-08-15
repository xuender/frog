import { NgModule } from '@angular/core';
import { KeypadComponent } from './keypad/keypad';
import { IonicModule } from 'ionic-angular';
import { FilterItemsComponent } from './filter-items/filter-items';
@NgModule({
	declarations: [KeypadComponent,
    FilterItemsComponent],
	imports: [IonicModule],
	exports: [KeypadComponent,
    FilterItemsComponent]
})
export class ComponentsModule { }
