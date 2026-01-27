import { ServiceCategory } from "./ServiceCategory"

export class Service{
    private categories:ServiceCategory[]=[]
    private constructor(
        private readonly id:string|null,
        private name:string,
        private description:string,
        private imageUrl:string,
        private isActive:boolean=true
    ){}
    
    static create(name:string,description:string,imageUrl:string):Service{
        return new Service(null,name,description,imageUrl,true)
    }

    addCategory(category:ServiceCategory){
        this.categories.push(category)
    }
    activate(){
         this.isActive = true
    }
    deactivate(){
        this.isActive = false
    }
}

