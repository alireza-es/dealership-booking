import { Vehicle } from '@entities';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server';
import { getMongoRepository } from 'typeorm';
import { CreateVehicleInput } from '../generator/graphql.schema';

@Resolver('Vehicle')
export class VehicleResolver {
	@Query()
	async vehicles(): Promise<Vehicle[]> {
		return getMongoRepository(Vehicle).find({
			cache: true
		})
	}

	@Mutation()
	async createVehicle(
		@Args('input') input: CreateVehicleInput
	): Promise<Vehicle> {

		if (!input.VIN)
			throw new ForbiddenError('Vehicle VIN is not provided');

		if (input.VIN.length !== 17)
			throw new ForbiddenError('Vehicle VIN should be a 17 length string');
		
		const existVIN = await getMongoRepository(Vehicle).findOne({ VIN: input.VIN });
		if (existVIN)
			throw new ForbiddenError('Vehicle exist with this VIN');
		
		return await getMongoRepository(Vehicle).save(new Vehicle({ ...input }));
	}
}
