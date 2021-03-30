import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server';
import * as date from 'date-and-time';
import { getMongoRepository } from 'typeorm';
import * as CONSTANTS from '../constant/index';
import { Booking, Customer, Vehicle } from '../entities';
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

		const bookingAtTime = date.parse(date.format(input.bookingAt, 'hh:mm A'), 'hh:mm A');

		const startWorkingDateTime = date.parse(CONSTANTS.DEALERSHIP_WORKING_HOURS.START_TIME, 'hh:mm A');

		const endWorkingDateTime = date.parse(CONSTANTS.DEALERSHIP_WORKING_HOURS.END_TIME, 'hh:mm A');
		
		if (bookingAtTime < startWorkingDateTime || bookingAtTime > endWorkingDateTime)
			throw new ForbiddenError('Booking time is not in dealership working hours');

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
}
