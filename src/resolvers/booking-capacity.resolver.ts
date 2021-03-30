import { BOOKING_CAPACITY_KEY } from '@constants';
import { Setting } from '@entities';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server';
import { getMongoRepository } from 'typeorm';
@Resolver('Setting')
export class BookingCapacityResolver {
    @Mutation()
    async updateBookingCapacity(
        @Args('input') input: number
    ): Promise<boolean> {

        if (input < 0)
            throw new ForbiddenError('Invalid capacity. Capacity should be a positive number')

        let setting = await getMongoRepository(Setting).findOne({ key: BOOKING_CAPACITY_KEY });
        if (!setting)
            setting = new Setting({ key: BOOKING_CAPACITY_KEY });
        setting.value = input.toString();

        await getMongoRepository(Setting).save(setting);
        
        return true;
    }
}
