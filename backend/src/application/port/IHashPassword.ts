export interface IHashPassword{
    hash(password:string):Promise<string>
}