import { BOOKING_CAPACITY_KEY } from '@constants';
import { Setting } from '@entities';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenError } from 'apollo-server';
import { Repository } from 'typeorm';
@Resolver('Setting')
export class BookingCapacityResolver {
    constructor(
        @InjectRepository(Setting)
        private settingRepository: Repository<Setting>
    ){}
    @Mutation()
    async updateBookingCapacity(
        @Args('input') input: number
    ): Promise<boolean> {

        if (input < 0)
            throw new ForbiddenError('Invalid capacity. Capacity should be a positive number')

        let setting = await this.settingRepository.findOne({ key: BOOKING_CAPACITY_KEY });
        if (!setting)
            setting = new Setting({ key: BOOKING_CAPACITY_KEY });
        setting.value = input.toString();

        await this.settingRepository.save(setting);
        
        return true;
    }
}
