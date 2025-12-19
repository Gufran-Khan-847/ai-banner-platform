import crypto from 'crypto';

/**
 * Generates an API token based on user's email and username.
 * 
 * @param email - The user's email.
 * @param username - The user's username.
 * @returns A hash-based string token.
 */
export function generateAPIToken(email: string, username: string): string {
  const secretKey = process.env.API_SECRET_KEY || 'default-secret-key'; // Replace with a strong secret key

  // Concatenate email and username
  const data = `${email}:${username}:${Date.now()}`;

  // Create a SHA-256 hash
  const hash = crypto.createHmac('sha256', secretKey)
                     .update(data)
                     .digest('hex');

  return hash;
}
