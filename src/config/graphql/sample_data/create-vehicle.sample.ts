export const create_vehicle_sample =
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
