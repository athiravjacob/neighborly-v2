import { AddressVO } from "./AddressVO";
import { User } from "./User";

export class UserProfile{
    private constructor(
        private readonly id:string,
        private readonly userId:string,
        private  dob?:Date,
        private  address?:AddressVO,
        private  profilePictureUrl?:string,
        private readonly createdAt? :Date,
        private updatedAt?:Date

    ){}

    getUserId():string{
        return this.userId
    }

    static create(id:string,userId:string):UserProfile{
        return new UserProfile(id,userId)
    }

    isProfileComplete():boolean{
        return Boolean(
            this.dob &&
            this.address &&
            this.profilePictureUrl 
        )
    }

    updateDOB(dob:Date):void{
        if(dob > new Date()) throw new Error("Give a valid DOB")
        const age = new Date().getFullYear() -dob.getFullYear() 
        if(age < 18) throw new Error("You must me 18 or above")
        this.dob = dob
        this.touch()
    }

    updateAddress(address:AddressVO):void{
        if (this.address?.equals(address)) return
        this.address = address
        this.touch()
    }

    updateProfilePictureUrl(url:string):void{
        this.profilePictureUrl = url
        this.touch()
    }

    touch():void{
        this.updatedAt = new Date()
    }
}