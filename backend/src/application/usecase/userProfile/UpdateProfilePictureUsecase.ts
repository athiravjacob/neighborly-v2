import { IProfileRepository } from "../../../domain/repositories/IProfileRepository"
import { IFileStorage } from "../../port/IFileStorage"

type updateProfilePicInput={
    userId:string,
    buffer:Buffer
}

type updateProfilePicOutput={
    userId:string,
    profilePictureUrl:string
}

export class UpdateProfilePictureUsecase{
    constructor(
        private profileRepository:IProfileRepository,
        private fileStorage:IFileStorage
    ){}

    async execute(input:updateProfilePicInput):Promise<updateProfilePicOutput>{
        const {userId,buffer}= input
        let profile = await this.profileRepository.findProfileByUserId(userId)
        if(!profile) throw new Error("No User Found")

        let imageUrl = await this.fileStorage.uploadProfileImage(buffer,`${userId}-${Date.now()}`)
        if(!imageUrl) throw new Error("Error creating image url")

        profile.updateProfilePictureUrl(imageUrl)
        profile = await this.profileRepository.update(profile)

        return {
            userId:profile.getUserId(),
            profilePictureUrl:profile.getProfilePictureUrl()!
        }
    }
}