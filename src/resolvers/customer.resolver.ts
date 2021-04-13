import { Customer } from '@entities';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenError } from 'apollo-server';
import { Repository } from 'typeorm';
import { CreateCustomerInput } from '../generator/graphql.schema';

@Resolver('Customer')
export class CustomerResolver {
	constructor(
		@InjectRepository(Customer)
		private customerRepository: Repository<Customer>) { }
	@Query()
	async customers(): Promise<Customer[]> {
		return this.customerRepository.find({
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
		
		const existCustomer = await this.customerRepository.findOne({ phone: input.phone });
		if (existCustomer)
			throw new ForbiddenError('Customer already exists with this phone');
		
		return await this.customerRepository.save(new Customer({ ...input }));
	}
}
