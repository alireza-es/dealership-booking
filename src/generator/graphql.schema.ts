
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateBookingInput {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleVIN: string;
    bookingAt: number;
}

export class Booking {
    _id: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleVIN: string;
    bookingAt: number;
}

export abstract class IQuery {
    abstract bookings(): Booking[] | Promise<Booking[]>;
}

export abstract class IMutation {
    abstract createBooking(input: CreateBookingInput): Booking | Promise<Booking>;
}
