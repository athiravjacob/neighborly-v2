import { Service } from "../../../domain/entities/service/Service"
import { ServiceCategory } from "../../../domain/entities/service/ServiceCategory"
import { ServiceType } from "../../../domain/enums/ServiceType"
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository"

type addCategoryInput={
    serviceId:string,
    categoryName:string,
    type:ServiceType,
    inclusion:string[],
    exclusion:string[],
    isActive:boolean
}

type addCategoryOutput={
    id:string
    serviceId:string,
    categoryName:string,
    type:ServiceType,
    inclusion:string[],
    exclusion:string[],
    isActive:boolean
}
export class AddCategoryUsecase{
    constructor(
        private serviceRepository:IServiceRepository
    ){}


    async execute(input:addCategoryInput):Promise<addCategoryOutput>{

        const {serviceId,categoryName,type,inclusion,exclusion,isActive}= input
        const service =await this.serviceRepository.findById(serviceId)
        if(!service) throw new Error("Service doesnot exist")

        const newCategory = ServiceCategory.create(categoryName,type,inclusion,exclusion,isActive)
        service.addCategory(newCategory)
        this.serviceRepository.save(service)
        return {
            id:service.getId(),
            serviceId,
            categoryName,
            type,
            inclusion,exclusion,
            isActive
        }


        

    }
}