import { Profile } from "../../../../domain/entities/user/Profile";
import { AddressVO } from "../../../../domain/valueObjects/AddressVO";
import { ProfileDocument } from "../schemas/ProfileSchema";


export type ProfilePersistence = {
  userId: string;
  dob?: Date;
  profilePictureUrl?: string;
  address?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export class ProfileMapper{
  static toDomain(doc:ProfileDocument):Profile{
    return Profile.rehydrate({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      dob: doc.dob,
      profilePictureUrl: doc.profilePictureUrl,
      address: doc.address
        ? new AddressVO(
            doc.address.line1,
            doc.address.city,
            doc.address.state,
            doc.address.pincode
          )
        : undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
  static toPersist(profile: Profile): ProfilePersistence {
    const address = profile.getAddress();

    const persistence: ProfilePersistence = {
      userId: profile.getUserId(),
    };
  
    const dob = profile.getDob();
    if (dob !== undefined) {
      persistence.dob = dob;
    }
  
    const profilePictureUrl = profile.getProfilePictureUrl();
    if (profilePictureUrl !== undefined) {
      persistence.profilePictureUrl = profilePictureUrl;
    }
  
    if (address !== undefined) {
      persistence.address = address.toPrimitives();
    }
  
    return persistence;
  }
}
  