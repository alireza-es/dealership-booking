export const bookings_by_date_sample =
    {
        query:
`query bookingsByDate($input: Date!) {
  bookingsByDate(input: $input) {
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
  "input": "05/25/2021"
}`
    }