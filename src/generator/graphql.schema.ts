
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateBookingInput {
    customerID: string;
    vehicleID: string;
    bookingAt: Date;
}

export class CreateCustomerInput {
    name: string;
    phone: string;
    email?: string;
}

export class CreateVehicleInput {
    make: string;
    model: string;
    VIN: string;
}

export abstract class IMutation {
    abstract updateBookingCapacity(input: number): boolean | Promise<boolean>;

    abstract createBooking(input: CreateBookingInput): Booking | Promise<Booking>;

    abstract createCustomer(input: CreateCustomerInput): Customer | Promise<Customer>;

    abstract createVehicle(input: CreateVehicleInput): Vehicle | Promise<Vehicle>;
}

export class Booking {
    _id: string;
    customer: Customer;
    vehicle: Vehicle;
    bookingAt: number;
    createdAt: number;
    lastUpdatedAt: number;
}

export abstract class IQuery {
    abstract bookings(): Booking[] | Promise<Booking[]>;

    abstract customers(): Customer[] | Promise<Customer[]>;

    abstract vehicles(): Vehicle[] | Promise<Vehicle[]>;
}

export class Customer {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    createdAt: number;
}

export class Vehicle {
    _id: string;
    make: string;
    model: string;
    VIN: string;
    createdAt: number;
}

export type JSON = any;
