import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server';
import { getMongoRepository } from 'typeorm';
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

		const customer = await getMongoRepository(Customer).findOne({ _id: input.customerID });
		if (!customer)
			throw new ForbiddenError('Customer not found');
		
		const vehicle = await getMongoRepository(Vehicle).findOne({ _id: input.vehicleID });
		if (!vehicle)
			throw new ForbiddenError('Vehicle not found');

		const booking = new Booking({ ...input });
		booking.customer = customer;
		booking.vehicle = vehicle;
		
		return await getMongoRepository(Booking).save(booking);
	}
}
