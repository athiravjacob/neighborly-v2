
export type AddressPrimitive = {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  
export class AddressVO{
    constructor(
        private readonly line1:string,
        private readonly city:string,
        private readonly state:string,
        private readonly pincode:string,
    ){
        if(!line1 || !city || !state ||!pincode) throw new Error("Give full address")
    }

    equals(other:AddressVO):boolean{
        return Boolean(this.line1 === other.line1 && this.city === other.city && this.state === other.state && this.pincode === other.pincode )
    }

    toPrimitives():AddressPrimitive{
        return {
            line1:this.line1,
            city:this.city,
            state:this.state,
            pincode:this.pincode
        }

    }
}