export const create_customer_sample =
{
    mutation:
`mutation createCustomer($input: CreateCustomerInput!) {
  createCustomer(input: $input) {
    _id
    name
  }
}`,
    variables:
`{
    "input":{
        "name":"Alireza",
        "phone":"09124758576",
        "email": "alireza.es@gmail.com"
    }
}`
};
