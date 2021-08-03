import { DvaderVehicle } from "./DvaderVehicleModel";

export function parseWarehouseList(warehouses:DvaderWarehouse[]):DvaderWarehouse[] {
  // FIXME: Restructure
  return warehouses.map(warehouse => {
    return {
      _id: warehouse._id,
      name: warehouse.name,
      location: warehouse.location,
      cars: {
        location: warehouse.cars.location,
        vehicles: warehouse.cars.vehicles.map(vehicle => {
          return {
            _id: vehicle._id,
            make: vehicle.make,
            model: vehicle.model,
            year_model: vehicle.year_model,
            price: vehicle.price,
            licensed: vehicle.licensed,
            date_added: new Date(vehicle.date_added)
          }
        })
      }
    };
  });
}

export interface Location {
    lat:string
    long:string
}

export interface DvaderWarehouse {
    _id:number;
    name:string;
    location:Location
    cars: {
        location:string,
        vehicles:DvaderVehicle[]
    }
}