import DvaderVehicle from "./DvaderVehicleModel";

export interface Location {
    lat:string
    long:string
}

export default interface DvaderWarehouse {
    _id:number;
    name:string;
    location:Location
    cars: {
        location:string,
        vehicles:DvaderVehicle[]
    }
}