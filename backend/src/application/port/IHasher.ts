export interface IHasher{
    hash(password:string):Promise<string>
    verify(plain:string,hash:string):Promise<boolean>
}