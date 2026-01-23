import { Profile } from "../entities/user/Profile";
export interface IProfileRepository{
  findProfileByUserId(userId: string): Promise<Profile | null>;
  create(userId:string):Promise<Profile>
  update(input: Profile): Promise<Profile>;
}
