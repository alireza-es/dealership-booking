import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'src/entities/customer.entity';
import { getMongoRepository } from 'typeorm';
import { CreateCustomerInput } from '../generator/graphql.schema';

@Resolver('Customer')
export class CustomerResolver {
	@Query()
	async customers(): Promise<Customer[]> {
		return getMongoRepository(Customer).find({
			cache: true
		})
	}

	@Mutation()
	async createCustomer(
		@Args('input') input: CreateCustomerInput
	): Promise<Customer> {
		return await getMongoRepository(Customer).save(new Customer({ ...input }));
	}
}
