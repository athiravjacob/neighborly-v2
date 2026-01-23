import { GetOrCreateUsecase } from "../../application/usecase/userProfile/GetOrCreateProfileUsecase";
import { UpdatePersonalDetailsUsecase } from "../../application/usecase/userProfile/UpdatePersonalDetailsUsecase";
import { UpdateProfilePictureUsecase } from "../../application/usecase/userProfile/UpdateProfilePictureUsecase";
import { ProfileController } from "../../interface/controllers/ProfileController";
import { ProfileRepository } from "../persistence/mongo/repositories/ProfileRepository";
import { CloudinaryStorage } from "../services/CloudinaryStorage";

const profileRepository = new ProfileRepository()
const cloudinaryStorage = new CloudinaryStorage()


const getProfileUsecase = new GetOrCreateUsecase(profileRepository)
const updatePersonalDetailsUsecase = new UpdatePersonalDetailsUsecase(profileRepository)
const updateProfilePictureUsecase = new UpdateProfilePictureUsecase(profileRepository,cloudinaryStorage)

export const profileController = new ProfileController(getProfileUsecase,updatePersonalDetailsUsecase,updateProfilePictureUsecase)