export const sample_queries =
`{
  bookings {
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
customers {
    _id
    name
    phone
    email
  }
vehicles {
    _id
    make
    model
    VIN
  }
}`;
