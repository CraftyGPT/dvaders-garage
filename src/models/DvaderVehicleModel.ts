import { DvaderWarehouse } from "./DvaderWarehouseModel";

export function sortedVehiclesByDate(vehicles:DvaderVehicle[], direction:"asc"|"dsc"): DvaderVehicle[] {
  if (direction === "asc") {
    return [...vehicles].sort((a, b) => a.date_added.getTime() - b.date_added.getTime());
  } else {
    return [...vehicles].sort((a, b) => b.date_added.getTime() - a.date_added.getTime());
  }
}

export function sortedListByAttribute(vehicles:any[], attribute:string, direction:"asc"|"dsc"): any[] {
  if (direction === "asc") {
    return [...vehicles].sort((a, b) => a[attribute] - b[attribute]);
  } else {
    return [...vehicles].sort((a, b) => b[attribute] - a[attribute]);
  }
}

export function findVehicleById(warehouses: DvaderWarehouse[], id:number):DvaderVehicleResult|undefined {
  for (let warehouse of warehouses) {
    const vehicle = warehouse.cars.vehicles.find((vehicle) => vehicle._id === id);
    if (vehicle) {
      return {
        vehicle: vehicle,
        warehouse: warehouse
      };
    }
  }
}

export interface DvaderVehicleResult {
  vehicle: DvaderVehicle,
  warehouse: DvaderWarehouse
}

export interface DvaderVehicle {
    _id:number;
    make:string;
    model:string;
    year_model:number;
    price:number;
    licensed:boolean;
    date_added:Date;
}