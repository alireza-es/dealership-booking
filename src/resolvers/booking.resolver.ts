import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server';
import * as date from 'date-and-time';
import { BOOKING_CAPACITY_KEY, BOOKING_DURATION_IN_HOURS, DEALERSHIP_WORKING_HOURS, DEFAULT_BOOKING_CAPACITY } from 'src/constant';
import { getMongoRepository } from 'typeorm';
import { Booking, Customer, Setting, Vehicle } from '../entities';
import { CreateBookingInput } from '../generator/graphql.schema';

@Resolver('Booking')
export class BookingResolver {
	@Query()
	async bookings(): Promise<Booking[]> {
		return getMongoRepository(Booking).find({
			cache: true
		})
	}

	@Mutation()
	async createBooking(
		@Args('input') input: CreateBookingInput
	): Promise<Booking> {

		if (!input.customerID)
			throw new ForbiddenError('customerID is not provided')

		if (!input.vehicleID)
			throw new ForbiddenError('vehicleID is not provided')

		if (!this.isBookingIWorkingHours(input))
			throw new ForbiddenError('Booking time is not in dealership working hours');
		
		if (this.isExceededCapacity(input))
			throw new ForbiddenError('Booking time is not acceptable. Capacity is full.')

		const customer = await getMongoRepository(Customer).findOne({ _id: input.customerID });
		if (!customer)
			throw new ForbiddenError('Customer not found');
		
		const vehicle = await getMongoRepository(Vehicle).findOne({ _id: input.vehicleID });
		if (!vehicle)
			throw new ForbiddenError('Vehicle not found');

		const booking = new Booking({
			bookingAt: +input.bookingAt,
			customer: customer,
			vehicle: vehicle
		 });
		
		return await getMongoRepository(Booking).save(booking);
	}
	private async isExceededCapacity(input: CreateBookingInput):Promise<boolean> {
		const setting = await getMongoRepository(Setting).findOne({ key: BOOKING_CAPACITY_KEY });
		let capacity = Number(setting?.value);
		if (Number.isNaN(capacity))
			capacity = DEFAULT_BOOKING_CAPACITY;
		
		const filters  = {
			start: input.bookingAt.getTime() as any,
			end: date.addHours(input.bookingAt, BOOKING_DURATION_IN_HOURS).getTime() as any,
		};
		const result = await getMongoRepository(Booking)
			.find({
				where: {
					$and: [
						{
							bookingAt: { $gt: filters.start }
						},
						{
							bookingAt: { $gt: filters.end }
						},
					]
				}
			});
		
		return true;
		
	}
	private async isBookingIWorkingHours(input: CreateBookingInput): Promise<boolean>{

		const bookingAtTime = date.parse(date.format(input.bookingAt, 'hh:mm A'), 'hh:mm A');
		const startWorkingDateTime = date.parse(DEALERSHIP_WORKING_HOURS.START_TIME, 'hh:mm A');
		const endWorkingDateTime = date.parse(DEALERSHIP_WORKING_HOURS.END_TIME, 'hh:mm A');

		if (bookingAtTime < startWorkingDateTime || bookingAtTime > endWorkingDateTime)
			return false;
		
		return true;
	}
}
