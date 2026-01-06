import { AuthProvider } from "../enums/AuthProvider";

export class AuthCredentials{
    private constructor(
        private readonly provider:AuthProvider,
        private readonly passwordHash?:string,
        private readonly googleId?:string
    ){}

    static email(passwordHash:string):AuthCredentials{
        if(!passwordHash) throw new Error("Password is required")

        return new AuthCredentials( AuthProvider.EMAIL,passwordHash,undefined)
    }

    static google(googleId:string):AuthCredentials{
        if(!googleId) throw new Error("Google id required")

        return new AuthCredentials(AuthProvider.GOOGLE,undefined,googleId)
    }

    getProvider():AuthProvider{
        return this.provider
    }
    getPasswordHash():string|undefined{
        return this.passwordHash
    }

    getGoogleId():string|undefined{
        return this.googleId
    }
}