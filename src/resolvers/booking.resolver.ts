import { BOOKING_CAPACITY_KEY, BOOKING_DURATION_IN_HOURS, DEALERSHIP_WORKING_HOURS, DEFAULT_BOOKING_CAPACITY } from '@constants';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenError } from 'apollo-server';
import * as date from 'date-and-time';
import { Repository } from 'typeorm';
import { Booking, Customer, Setting, Vehicle } from '../entities';
import { CreateBookingInput } from '../generator/graphql.schema';

@Resolver('Booking')
export class BookingResolver {
	constructor(
		@InjectRepository(Booking)
		private bookingRepository: Repository<Booking>,
		@InjectRepository(Customer)
		private customerRepository: Repository<Customer>,
		@InjectRepository(Vehicle)
		private vehicleRepository: Repository<Vehicle>,
		@InjectRepository(Setting)
		private settingRepository: Repository<Setting>
	){}
	@Query()
	async bookings(): Promise<Booking[]> {
		return this.bookingRepository.find({
			cache: true
		})
	}

	@Query()
	async bookingsByDate(@Args('input') input: Date): Promise<Booking[]> {
		const start_day = new Date(input.getFullYear(), input.getMonth(), input.getDate());
		const end_day = date.addDays(start_day, 1);
		return this.bookingRepository.find({
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

		return this.bookingRepository.find({
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

		const customer = await this.customerRepository.findOne({ _id: input.customerID });
		if (!customer)
			throw new ForbiddenError('Customer not found');

		const vehicle = await this.vehicleRepository.findOne({ _id: input.vehicleID });
		if (!vehicle)
			throw new ForbiddenError('Vehicle not found');

		const booking = new Booking({
			bookingAt: +input.bookingAt,
			customer: customer,
			vehicle: vehicle
		});

		return await this.bookingRepository.save(booking);
	}
	private async isExceededCapacity(input: CreateBookingInput): Promise<boolean> {
		const setting = await this.settingRepository.findOne({ key: BOOKING_CAPACITY_KEY });
		let capacity = Number(setting?.value);
		if (Number.isNaN(capacity))
			capacity = DEFAULT_BOOKING_CAPACITY;

		const filters = {
			start: input.bookingAt.getTime() as any,
			end: date.addHours(input.bookingAt, BOOKING_DURATION_IN_HOURS).getTime() as any,
		};
		const bookedInRange = await this.bookingRepository
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
