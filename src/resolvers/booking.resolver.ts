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

	@Query()
	async bookingsByDate(@Args('input') input: Date): Promise<Booking[]> {
		const start_day = new Date(input.getFullYear(), input.getMonth(), input.getDate());
		const end_day = date.addDays(start_day, 1);
		return getMongoRepository(Booking).find({
			where: {
				$and: [
					{
						bookingAt: { $gte: start_day.getTime() }
					},
					{
						bookingAt: { $lt: end_day.getTime() }
					},
				]
			},
			cache: true
		})
	}

	@Query()
	async bookingsByVIN(@Args('input') input: string): Promise<Booking[]> {
		if (!input)
			throw new ForbiddenError('Vehicle VIN should be provided')

		return getMongoRepository(Booking).find({
			where: {
				'vehicle.VIN': input
			},
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

		if (!await this.isBookingIWorkingHours(input))
			throw new ForbiddenError('Booking time is not in dealership working hours');

		if (await this.isExceededCapacity(input))
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
	private async isExceededCapacity(input: CreateBookingInput): Promise<boolean> {
		const setting = await getMongoRepository(Setting).findOne({ key: BOOKING_CAPACITY_KEY });
		let capacity = Number(setting?.value);
		if (Number.isNaN(capacity))
			capacity = DEFAULT_BOOKING_CAPACITY;

		const filters = {
			start: input.bookingAt.getTime() as any,
			end: date.addHours(input.bookingAt, BOOKING_DURATION_IN_HOURS).getTime() as any,
		};
		const bookedInRange = await getMongoRepository(Booking)
			.findAndCount({
				where: {
					$and: [
						{
							bookingAt: { $gte: filters.start }
						},
						{
							bookingAt: { $lte: filters.end }
						},
					]
				}
			});

		const countOfBookedInRange = bookedInRange && bookedInRange.length > 1 && <number>bookedInRange[1];

		return countOfBookedInRange >= capacity ? true : false;

	}
	private async isBookingIWorkingHours(input: CreateBookingInput): Promise<boolean> {

		const bookingAtTime = date.parse(date.format(input.bookingAt, 'hh:mm A'), 'hh:mm A');
		const startWorkingDateTime = date.parse(DEALERSHIP_WORKING_HOURS.START_TIME, 'hh:mm A');
		const endWorkingDateTime = date.parse(DEALERSHIP_WORKING_HOURS.END_TIME, 'hh:mm A');

		if (bookingAtTime < startWorkingDateTime || bookingAtTime > endWorkingDateTime)
			return false;

		return true;
	}
}
