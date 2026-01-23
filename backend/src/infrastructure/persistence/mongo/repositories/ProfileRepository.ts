import { profile } from "console";
import { Profile } from "../../../../domain/entities/user/Profile";
import { IProfileRepository } from "../../../../domain/repositories/IProfileRepository";
import { ProfileMapper } from "../mapper/ProfileMapper";
import { ProfileModel } from "../schemas/ProfileSchema";

export class ProfileRepository implements IProfileRepository{
    async findProfileByUserId(userId: string): Promise<Profile | null> {
        const profile = await ProfileModel.findOne({userId})
       return  profile? ProfileMapper.toDomain(profile) : null
    }
    async create(userId: string): Promise<Profile> {
        let profile = await ProfileModel.findOne({userId})
        if(!profile) {
            profile =await ProfileModel.create({userId})}
        return ProfileMapper.toDomain(profile)

    }
    
    async update(input: Profile): Promise<Profile> {
        let persistence =  ProfileMapper.toPersist(input)

        let updatedDoc = await ProfileModel.findOneAndUpdate(
            {userId:persistence.userId},
            {
                $set:persistence
            },
            {new:true})
            if (!updatedDoc) {
                throw new Error("Profile not found");
              }
          
              return ProfileMapper.toDomain(updatedDoc);
    }
    
}