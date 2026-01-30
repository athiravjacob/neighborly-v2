import { ServiceType } from "../../enums/ServiceType";

export class ServiceVariant{
    private constructor(
        private readonly id:string,
        private name:string,
        public isActive:boolean=true
    ){}

    getName(){
        return this.name
    }

    hasSameName(name:string):boolean{
        return this.name === name
    }
}

