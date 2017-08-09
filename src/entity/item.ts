import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Item {

	@PrimaryColumn('int', { generated: true })
	id: number;

	@Column()
	name: string;
}
