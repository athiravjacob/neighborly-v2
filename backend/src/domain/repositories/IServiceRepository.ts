import { Service } from "../entities/service/Service";

export interface IServiceRepository{
    existsByName(serviceName: string):Promise<boolean>;
    save(service:Service):Promise<Service>
    findById(seviceId:string):Promise<Service>
}