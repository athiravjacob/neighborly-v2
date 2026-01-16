import { GoogleUserPayload, IGoogleTokenVerifier } from "../../application/port/IGoogleTokenVerifier";
import { OAuth2Client } from "google-auth-library";


export class GoogleTokenVerifier implements IGoogleTokenVerifier {
  private client: OAuth2Client;

  constructor(private readonly clientId: string) {
    this.client = new OAuth2Client(clientId);
  }

  async verify(idToken: string): Promise<GoogleUserPayload | null> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) return null;

      return {
        googleId: payload.sub!,        // unique Google user ID
        email: payload.email!,
        name: payload.name ?? "",
      };
    } catch (error) {
      throw new Error("Google token verification failed");
      return null;
    }
  }
}
