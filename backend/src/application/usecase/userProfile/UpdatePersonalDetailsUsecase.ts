import { AddressVO } from "../../../domain/valueObjects/AddressVO";
import { IFileStorage } from "../../port/IFileStorage";
import { IProfileRepository } from "../../../domain/repositories/IProfileRepository";
import { Profile } from "../../../domain/entities/user/Profile";

type updatePersonalDetailsInput = {
  userId: string;
  dob?: Date|undefined;
  address?: { line1: string; city: string; state: string; pincode: string }|undefined;
};

type updatePersonalDetailsOutput={
  userId:string;
  dob: Date|undefined;
  address: { line1: string; city: string; state: string; pincode: string }|undefined;

}

export class UpdatePersonalDetailsUsecase {
  constructor(
    private userProfileRepo: IProfileRepository,
  ) {}

  async execute(input: updatePersonalDetailsInput): Promise<updatePersonalDetailsOutput> {
    let profile = await this.userProfileRepo.findProfileByUserId(input.userId);
    if (!profile) {
      throw new Error("Profile not found"); 
    }

    if (input.dob) {
      profile.updateDOB(input.dob);
    }
    if (input.address) {
      const address = new AddressVO(
        input.address.line1,
        input.address.city,
        input.address.state,
        input.address.pincode
      );
      profile.updateAddress(address);
    }
    profile =await this.userProfileRepo.update(profile)
    return {
      userId:profile.getUserId(),
      dob:profile.getDob(),
      address:profile.getAddress()?profile.getAddress()?.toPrimitives():undefined
    }
  }
}
