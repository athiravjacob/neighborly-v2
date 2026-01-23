export interface IFileStorage{
    uploadProfileImage(buffer:Buffer,filename:string):Promise<string>
}