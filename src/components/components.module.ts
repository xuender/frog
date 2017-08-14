import { NgModule } from '@angular/core';
import { KeypadComponent } from './keypad/keypad';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [KeypadComponent],
	imports: [IonicModule],
	exports: [KeypadComponent]
})
export class ComponentsModule { }
