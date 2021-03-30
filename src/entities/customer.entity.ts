import { Expose, plainToClass } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { v4 as uuidv4 } from "uuid";

@Entity({
	name: 'customers',
	orderBy: {
		name: 'ASC'
	}
})
export class Customer {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	name: string

	@Expose()
	@Column()
	phone: string

	@Expose()
	@Column()
	email: string


	@Expose()
	@Column()
	createdAt: number

	constructor(customer: Partial<Customer>) {
		if (customer) {
			Object.assign(
				this,
				plainToClass(Customer, customer, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuidv4()
			this.createdAt = +new Date();
		}
	}
}
