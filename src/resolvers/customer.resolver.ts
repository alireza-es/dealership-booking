import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server';
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
		if (!input.name)
			throw new ForbiddenError('Customer name is not provided');
		
		if (!input.phone)
			throw new ForbiddenError('Customer phone is not provided');
		
		const existCustomer = await getMongoRepository(Customer).findOne({ phone: input.phone });
		if (existCustomer)
			throw new ForbiddenError('Customer already exists with this phone');
		
		return await getMongoRepository(Customer).save(new Customer({ ...input }));
	}
}
