import { ServiceType } from "../../enums/ServiceType";
import { ServiceOffering } from "./ServiceOfferings";
import { ServiceVariant } from "./ServiceVariants";

export class ServiceCategory{
    private variants:ServiceVariant[]=[]
    private offerings:ServiceOffering[]=[]
    private constructor(
        private readonly id:string|null,
        private categoryName:string,
        private type:ServiceType,
        private inclusion:string[],
        private exclusion:string[],
        public isActive:boolean=true
    ){}

    static create(categoryName:string,type:ServiceType,inclusion:string[],exclusion:string[]):ServiceCategory{
      if (!categoryName.trim()) throw new Error("Category name required");
      if (!Object.values(ServiceType).includes(type)) throw new Error("Invalid service type");
      return new ServiceCategory(null, categoryName, type, inclusion, exclusion);
    }

    addVariant(variant: ServiceVariant) {
      if (this.variants.some(v => v.hasSameName( variant.getName()))) {
        throw new Error("Variant name must be unique within category");
      }
      this.variants.push(variant);      }
    
      addOffering(offering: ServiceOffering) {
        this.offerings.push(offering);
      }

      hasSameName(name: string): boolean {
        return this.categoryName === name;
      }
    
      getCategoryName(): string {
        return this.categoryName;
      }
}

