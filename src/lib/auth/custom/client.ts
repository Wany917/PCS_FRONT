'use client';

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Cette fonctionalité est en cours de développement.' };
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }
}

export const authClient = new AuthClient();
