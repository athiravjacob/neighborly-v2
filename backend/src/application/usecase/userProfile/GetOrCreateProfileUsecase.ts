import { IProfileRepository } from "../../../domain/repositories/IProfileRepository"

type getorCreateInput={
    userId:string
}

type getOrCreateOutput={
    userId:string,
    dob?:Date|undefined,
    address?:{line1:String,city:string,state:string,pincode:string}|undefined,
    profilePicture?:string|undefined
}

export class GetOrCreateUsecase{
    constructor(
        private profileUsecase:IProfileRepository
    ){}

    async execute (input:getorCreateInput):Promise<getOrCreateOutput>{
        const {userId} = input

        let profile = await this.profileUsecase.findProfileByUserId(userId)
        if(!profile){
            profile = await this.profileUsecase.create(userId)
        }

        return {
            userId:profile.getUserId(),
            dob:profile.getDob(),
            address:profile.getAddress()? profile.getAddress()?.toPrimitives():undefined,
            profilePicture:profile.getProfilePictureUrl()
        }
    }
}