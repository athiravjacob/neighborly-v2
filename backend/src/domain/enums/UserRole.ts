export enum UserRole{
    SEEKER ="SEEKER",
    HELPER ="HELPER",
    ADMIN ="ADMIN"
}
export type SignupRole = UserRole.HELPER | UserRole.SEEKER;
