export const create_sample_vehicle =
    {
    mutation:
`mutation createVehicle($input: CreateVehicleInput!){
        createVehicle(input: $input) {
            _id
            VIN
        }
    }`,
    variables:
`{
    "input":{
        "make":"Tesla",
        "model":"1995",
        "VIN":"13265698456213629"
    }
}`
};
