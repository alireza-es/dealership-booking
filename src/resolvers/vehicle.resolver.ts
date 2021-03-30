import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Vehicle } from 'src/entities/vehicle.entity';
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
		return await getMongoRepository(Vehicle).save(new Vehicle({ ...input }));
	}
}
