import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { getMongoRepository } from 'typeorm';
import { Booking } from '../entities';
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
		// const { name } = input

		// const company = await getMongoRepository(Company).findOne({ name })

		// if (company) {
		// 	throw new ForbiddenError('Company already existed.')
		// }

		return await getMongoRepository(Booking).save(new Booking({ ...input }));
	}
}
