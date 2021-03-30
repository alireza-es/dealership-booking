export const create_sample_booking =
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
        "customerID":"",
        "vehicleID":"",
        "bookingAt":1617095338404
    }
}`
};
