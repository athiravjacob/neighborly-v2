import { AddressVO } from "../../../domain/valueObjects/AddressVO";
import { IFileStorage } from "../../port/IFileStorage";
import { IProfileRepository } from "../../../domain/repositories/IProfileRepository";

type upsertProfileInput = {
  userId: string;
  dob?: Date;
  address?: { line1: string; city: string; state: string; pincode: string };
  profilePicture?: {
    buffer: Buffer;
    
  };
};
export class UpsertProfileUsecase {
  constructor(
    private userProfileRepo: IProfileRepository,
    private fileStorage: IFileStorage
  ) {}

  async execute(input: upsertProfileInput): Promise<void> {
    let profile = await this.userProfileRepo.findProfileByUserId(input.userId);
    if (!profile) {
      profile = await this.userProfileRepo.create(input.userId);
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

    if (input.profilePicture) {
      const imageUrl = await this.fileStorage.uploadProfileImage(
        input.profilePicture.buffer,
        `${input.userId}-${Date.now()}`
      );
      profile.updateProfilePictureUrl(imageUrl);
    }

    await this.userProfileRepo.update(profile)
  }
}
