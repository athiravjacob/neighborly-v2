import { Service } from "../../../../domain/entities/service/Service";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { ServiceMapper } from "../mapper/ServiceMapper";
import { ServiceModel } from "../schemas/service/ServiceSchema";

export class ServiceRepositoryMongo implements IServiceRepository{
   async existsByName(serviceName: string): Promise<boolean> {
    const exists = await ServiceModel.findOne({serviceName})
    if(exists) return true
    return false

    }


    async save(service: Service): Promise<Service> {
        const persistence = ServiceMapper.toPersist(service);
        const created = await ServiceModel.create(persistence);
        return ServiceMapper.toDomain(created); 
    }
}