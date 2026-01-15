export type GoogleUserPayload = {
    googleId: string
    email: string
    name: string
    phone?: string
  }
export interface IGoogleTokenVerifier{
    verify(idToken:string):Promise<GoogleUserPayload | null>
}