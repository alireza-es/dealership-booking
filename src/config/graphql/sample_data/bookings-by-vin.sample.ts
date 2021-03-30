export const bookings_by_vin_sample =
    {
        query:
`query bookingsByVIN($input: String!) {
  bookingsByVIN(input: $input) {
    _id
    customer {
      name
      phone
      email
    }
    vehicle {
      VIN
      model
      make
    }
    bookingAt
  }
}`,
        variables:
`{
  "input": "13265698456213629"
}`
    }