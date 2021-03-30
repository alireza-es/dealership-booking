import { Expose, plainToClass } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { v4 as uuidv4 } from "uuid";

@Entity({
	name: 'bookings',
	orderBy: {
		createdAt: 'DESC'
	}
})
export class Booking {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	customerName: string

	@Expose()
	@Column()
	customerPhone: string

	@Expose()
	@Column()
	customerEmail: string

	@Expose()
	@Column()
	vehicleMake: string
	
	@Expose()
	@Column()
	vehicleModel: string
	
	@Expose()
	@Column()
	vehicleVIN: string

	@Expose()
	@Column()
	bookingAt: number


	@Expose()
	@Column()
	createdAt: number

	constructor(booking: Partial<Booking>) {
		if (booking) {
			Object.assign(
				this,
				plainToClass(Booking, booking, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuidv4()
			this.bookingAt = this.bookingAt || +new Date()
			this.createdAt = +new Date();
		}
	}
}
