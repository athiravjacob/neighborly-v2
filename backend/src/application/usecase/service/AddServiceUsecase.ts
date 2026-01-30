import { Service } from "../../../domain/entities/service/Service";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IFileStorage } from "../../port/IFileStorage";

type addServiceInput={
    serviceName:string,
    description:string,
    imageBuffer:Buffer
}
type addServiceOutput={
    id:string
    serviceName:string,
    description:string,
    imageUrl:string,
    isActive:boolean
}
export class AddServiceUsecase {
    constructor(
      private  serviceRepository :IServiceRepository,
      private fileStorage:IFileStorage

    ){}

    async execute(input:addServiceInput):Promise<addServiceOutput>{
        const exists = await this.serviceRepository.existsByName(input.serviceName);
        if (exists) {
          throw new Error("Service with this name already exists");
        }
        const imageUrl = await this.fileStorage.uploadProfileImage(input.imageBuffer,`${input.serviceName}-${Date.now()}`)

        const service =Service.create(input.serviceName,input.description,imageUrl)
        const persistService = await this.serviceRepository.save(service)
        return {
            id: persistService.getId(),
            serviceName: persistService.getServiceName(),
            description: persistService.getDescription(),
            imageUrl: persistService.getImage(),
            isActive: persistService.activeStatus()
          };

    }
}