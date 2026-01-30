import { ServiceType } from "../../enums/ServiceType";

// The offering represents the "bookable thing"
export class ServiceOffering {
    private constructor(
      private readonly id: string|null,  
      private serviceId:string,     
      private categoryId: string, 
      private price: number,     
      private type: ServiceType,       
      private variantId?: string,         
      private durationInMinutes?: number, 
      private isActive: boolean = true
    ) {}
  
    // Use create() for new offering (no ID yet)
    static create( 
      serviceId:string,
      categoryId: string,
      price: number,
      type: ServiceType,
      variantId?: string,
      durationInMinutes?: number,
    ): ServiceOffering {

      if(type=== ServiceType.FIXED)
{
  if (price <= 0) throw new Error("Price must be positive");
  if (durationInMinutes! <= 0) throw new Error("Duration must be positive");

}
     
      return new ServiceOffering(
        null,
        serviceId,
        categoryId,
        price,
        type,
        variantId,
        durationInMinutes,
        true
      );
    }
  
    
  
    deactivate() {
      this.isActive = false;
    }
  
    activate() {
      this.isActive = true;
    }
  
    updatePrice(price: number) {
      if (price <= 0) throw new Error("Price must be positive");
      this.price = price;
    }
  
    updateDuration(duration: number) {
      if (duration <= 0) throw new Error("Duration must be positive");
      this.durationInMinutes = duration;
    }
  }
  