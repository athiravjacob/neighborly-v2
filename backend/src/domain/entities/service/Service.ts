import { ServiceCategory } from "./ServiceCategory"

export class Service{
    private categories:ServiceCategory[]
    private constructor(
        private readonly id:string|null,
        private serviceName:string,
        private description:string,
        private imageUrl:string,
        private isActive:boolean=true,
        categories:ServiceCategory[]
    ){this.categories=categories}

    getId():string{
      if(!this.id) throw new Error("Service not yet persisted")
      return this.id
    }

    getServiceName():string{
      return this.serviceName
    }

    getDescription():string{
      return this.description
    }

    getImage():string{
      return this.imageUrl
    }
    
     activeStatus():boolean{
      return this.isActive
    }
    static create(serviceName:string,description:string,imageUrl:string):Service{
        if (!serviceName.trim()) {
            throw new Error("Service name cannot be empty");
          }
          if (!description.trim()) {
            throw new Error("Service description cannot be empty");
          }
          if (!imageUrl.trim()) {
            throw new Error("Service imageUrl cannot be empty");
          }
        return new Service(null,serviceName,description,imageUrl,true,[])
    }

    addCategory(category:ServiceCategory){
        if (this.categories.some(c => c.hasSameName(category.getCategoryName()))) {
            throw new Error("Category name must be unique within this service");
          }        this.categories.push(category)
    }
    activate(){
         this.isActive = true
    }
    deactivate(){
        this.isActive = false
    }

    static rehydrate(id:string,serviceName:string,description:string,imageUrl:string,isActive:boolean,categories:ServiceCategory[]):Service{
        return new Service(id,serviceName,description,imageUrl,isActive,categories)
    }
}

 