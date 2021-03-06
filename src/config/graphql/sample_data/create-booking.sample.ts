export const create_booking_sample =
    {
    mutation:
`mutation createBooking($input: CreateBookingInput!) {
  createBooking(input: $input) {
    _id
    customer {
      name
    }
    vehicle {
      VIN
    }
    bookingAt
  }
}`,
    variables:
`{
    "input":{
        "customerID":"458cc69c-bab5-435a-8205-6d06cfe8d982",
        "vehicleID":"ad40fcff-bfb0-401a-8c09-a8fa9852054b",
        "bookingAt":"05/25/2021 15:30"
    }
}`
};
