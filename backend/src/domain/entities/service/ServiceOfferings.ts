import { ServiceType } from "../../enums/ServiceType";

// The offering represents the "bookable thing"
export class ServiceOffering {
    private constructor(
      private readonly id: string|null,       
      private categoryId: string, 
      private price: number,     
      private type: ServiceType,       
      private variantId?: string,         
      private durationInMinutes?: number, 
      private isActive: boolean = true
    ) {}
  
    // Use create() for new offering (no ID yet)
    static create( 
      categoryId: string,
      price: number,
      type: ServiceType,
      variantId?: string,
      durationInMinutes?: number,
    ): ServiceOffering {
      return new ServiceOffering(
        null,
        categoryId,
        price,
        type,
        variantId,
        durationInMinutes,
        true
      );
    }
  
    // Use rehydrate() for DB-loaded offering (with ID)
    static rehydrate(props: {
      id: string;
      categoryId: string;
      variantId?: string;
      price: number;
      durationInMinutes?: number;
      type: ServiceType;
      isActive: boolean;
    }): ServiceOffering {
      return new ServiceOffering(
        props.id,
        props.categoryId,
        props.price,
        props.type,
        props.variantId,
        props.durationInMinutes,
        props.isActive
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
  