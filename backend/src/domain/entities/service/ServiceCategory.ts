import { ServiceType } from "../../enums/ServiceType";
import { ServiceOffering } from "./ServiceOfferings";
import { ServiceVariant } from "./ServiceVariants";

export class ServiceCategory{
    private variants:ServiceVariant[]=[]
    private offerings:ServiceOffering[]=[]
    private constructor(
        private readonly id:string|null,
        private name:string,
        private type:ServiceType,
        private inclusion:string[],
        private exclusion:string[],
        public isActive:boolean=true
    ){}

    static create(name:string,type:ServiceType,inclusion:string[],exclusion:string[]):ServiceCategory{
        return new ServiceCategory(null,name,type,inclusion,exclusion,true)

    }

    addVariant(variant: ServiceVariant) {
        this.variants.push(variant);
      }
    
      addOffering(offering: ServiceOffering) {
        this.offerings.push(offering);
      }
}

