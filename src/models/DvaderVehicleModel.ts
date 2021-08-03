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
export interface DvaderVehicle {
    _id:number;
    make:string;
    model:string;
    year_model:number;
    price:number;
    licensed:boolean;
    date_added:Date;
}