import { ServiceType } from "../../enums/ServiceType";

export class ServiceVariant{
    private constructor(
        private readonly id:string,
        private name:string,
        public isActive:boolean=true
    ){}
}

