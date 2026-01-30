import { Types } from "mongoose";
import { Service } from "../../../../domain/entities/service/Service";

export interface ServicePersistence {
    _id: Types.ObjectId;
    serviceName: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
  }
export class ServiceMapper{
    static toPersist(service :Service){
        return{
            serviceName:service.getServiceName(),
            description:service.getDescription(),
            imageUrl:service.getImage(),
            isActive:service.activeStatus()
        }
    }

    static toDomain(raw:ServicePersistence):Service{
        return Service.rehydrate(
            raw._id.toString(),
            raw.serviceName,
            raw.description,
            raw.imageUrl,
            raw.isActive
          );
    }
}