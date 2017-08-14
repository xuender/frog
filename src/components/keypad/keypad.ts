import { Component } from '@angular/core';

@Component({
	selector: 'keypad',
	templateUrl: 'keypad.html'
})
export class KeypadComponent {
	public num: number;

	constructor() {
		console.log('Hello KeypadComponent Component');
		this.num = 0;
	}

}
