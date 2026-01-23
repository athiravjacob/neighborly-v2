import { AddressVO } from "../../valueObjects/AddressVO";
import { User } from "./User";

export class Profile{
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

    getDob():Date|undefined{
        return this.dob
    }
    getAddress():AddressVO|undefined{
        return this.address
    }
    getProfilePictureUrl():string|undefined{
        return this.profilePictureUrl
    }

    
    static create(userId:string):Profile{
        return new Profile(
        undefined as any, 
        userId,
        undefined,
        undefined,
        undefined,
        new Date(),
        new Date())
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

  static rehydrate(props: {
    id: string;
    userId: string;
    dob?: Date | undefined;
    address?: AddressVO | undefined;
    profilePictureUrl?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
  }): Profile {
    return new Profile(
      props.id,
      props.userId,
      props.dob,
      props.address,
      props.profilePictureUrl,
      props.createdAt,
      props.updatedAt
    );
  }
}