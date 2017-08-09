import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { createConnection } from 'typeorm';
import { Item } from '../../entity/item';

@Injectable()
export class DbProvider {

	public items: Item[] = [];
	constructor() {
		console.log('Hello DbProvider Provider');
		createConnection({
			driver: {
				type: 'sqlite',
				database: 'db/frog.db',
			},
			entities: [
				Item,
			],
			logging: {
				logFailedQueryError: true,
				logQueries: true,
				logSchemaCreation: true,
				logOnlyFailedQueries: true,
			},
			autoSchemaSync: true,
		}).then(async connection => {
			const item = new Item();
			item.name = '测试商品1';
			const itemRepository = connection.getRepository(Item);
			await itemRepository.persist(item);
			console.log("Item has been saved: ", item);
			// this.items = await itemRepository.find();
			console.log('find');
		}).catch(error => console.log("Error: ", error));
	}

}
