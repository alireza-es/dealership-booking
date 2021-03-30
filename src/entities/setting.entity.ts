import { Expose, plainToClass } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { v4 as uuidv4 } from "uuid";

@Entity({
    name: 'settings',
    orderBy: {
        key: 'ASC'
    }
})
export class Setting {
    @Expose()
    @ObjectIdColumn()
    _id: string

    @Expose()
    @Column()
    key: string

    @Expose()
    @Column()
    value: string

    @Expose()
    @Column()
    lastUpdateAt: number


    constructor(setting: Partial<Setting>) {
        if (setting) {
            Object.assign(
                this,
                plainToClass(Setting, setting, {
                    excludeExtraneousValues: true
                })
            )
            this._id = this._id || uuidv4()
            this.lastUpdateAt = +new Date();
        }
    }
}
