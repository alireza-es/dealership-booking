import { Expose, plainToClass } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { v4 as uuidv4 } from "uuid";

@Entity({
	name: 'vehicles',
	orderBy: {
		VIN: 'ASC'
	}
})
export class Vehicle {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	make: string

	@Expose()
	@Column()
	model: string

	@Expose()
	@Column()
	VIN: string


	@Expose()
	@Column()
	createdAt: number

	constructor(vehicle: Partial<Vehicle>) {
		if (vehicle) {
			Object.assign(
				this,
				plainToClass(Vehicle, vehicle, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuidv4()
			this.createdAt = +new Date();
		}
	}
}
