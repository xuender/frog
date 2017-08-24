import { Pipe, PipeTransform } from '@angular/core';

import { Extend } from '../../entity/extend';
import { ExtendProvider } from '../../providers/extend/extend';
@Pipe({
	name: 'extend',
})
export class ExtendPipe implements PipeTransform {
	private exts: Extend[];
	constructor(
		private extendProvider: ExtendProvider
	) {
		this.exts = extendProvider.exts;
	}

	transform(ext: any, ...args) {
		const ret: string[] = [];
		for (const e of this.exts) {
			if (e.id in ext) {
				ret.push(`${e.label}: ${ext[e.id]}`);
			}
		}
		return ret.join(' ');
	}
}
