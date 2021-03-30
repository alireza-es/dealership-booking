export const update_booking_capacity_sample =
{
    mutation:
`mutation updateBookingCapacity($input: Int!) {
  updateBookingCapacity(input: $input)
}
`,
    variables:
`{
    "input":2
}`
};
