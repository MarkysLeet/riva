/**
 * Passkeys & WebAuthn helper module for client-side registration & authentication.
 * Supports Windows Hello, Touch ID, Face ID, and security keys (YubiKey).
 */

const PASSKEY_STORAGE_KEY = 'riva_passkey_credentials_v1';
const PASSKEY_LAST_USER_KEY = 'riva_passkey_last_email_v1';

export interface StoredPasskeyCredential {
  id: string; // base64url credential ID
  rawId: string;
  name: string; // friendly name, e.g. Windows Hello / Touch ID
  createdAt: string;
  lastUsedAt?: string;
  userEmail: string;
}

// Convert base64url / base64 string to Uint8Array / ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convert ArrayBuffer to base64url string
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Checks if the current browser and platform support WebAuthn / Passkeys.
 */
export async function isPasskeySupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!window.PublicKeyCredential) return false;
  try {
    if (PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves the list of locally registered passkeys.
 */
export function getStoredPasskeys(userEmail?: string): StoredPasskeyCredential[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PASSKEY_STORAGE_KEY);
    if (!raw) return [];
    const list: StoredPasskeyCredential[] = JSON.parse(raw);
    if (userEmail) {
      return list.filter((k) => k.userEmail.toLowerCase() === userEmail.toLowerCase());
    }
    return list;
  } catch {
    return [];
  }
}

/**
 * Gets the last email associated with a passkey on this device.
 */
export function getLastPasskeyEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PASSKEY_LAST_USER_KEY);
}

/**
 * Registers a new Passkey / WebAuthn credential on the device (Windows Hello / Touch ID).
 */
export async function registerDevicePasskey(
  userEmail: string,
  displayName?: string
): Promise<{ success: boolean; credential?: StoredPasskeyCredential; error?: string }> {
  if (typeof window === 'undefined' || !window.navigator.credentials) {
    return { success: false, error: 'WebAuthn не поддерживается в этом браузере' };
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userIdBytes = new Uint8Array(16);
    window.crypto.getRandomValues(userIdBytes);

    const rpName = 'Riva Beauty Platform';
    const rpId = window.location.hostname;

    const creationOptions: CredentialCreationOptions = {
      publicKey: {
        challenge,
        rp: {
          name: rpName,
          ...(rpId !== 'localhost' ? { id: rpId } : {}),
        },
        user: {
          id: userIdBytes,
          name: userEmail,
          displayName: displayName || userEmail.split('@')[0],
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred',
          residentKey: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      },
    };

    const newCredential = (await navigator.credentials.create(
      creationOptions
    )) as PublicKeyCredential | null;

    if (!newCredential) {
      return { success: false, error: 'Не удалось создать ключ доступа' };
    }

    const credId = newCredential.id;
    const rawIdBase64 = bufferToBase64(newCredential.rawId);

    let deviceName = 'Ключ доступа устройства';
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      if (/Windows/i.test(navigator.userAgent)) deviceName = 'Windows Hello (Пин/Биометрия)';
      else if (/Macintosh|iPhone|iPad/i.test(navigator.userAgent)) deviceName = 'Touch ID / Face ID';
      else if (/Android/i.test(navigator.userAgent)) deviceName = 'Биометрия Android';
    }

    const storedItem: StoredPasskeyCredential = {
      id: credId,
      rawId: rawIdBase64,
      name: deviceName,
      createdAt: new Date().toISOString(),
      userEmail,
    };

    const existing = getStoredPasskeys();
    const updated = [storedItem, ...existing.filter((k) => k.id !== credId)];
    localStorage.setItem(PASSKEY_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(PASSKEY_LAST_USER_KEY, userEmail);

    return { success: true, credential: storedItem };
  } catch (err: unknown) {
    const error = err as Error;
    if (error.name === 'NotAllowedError') {
      return { success: false, error: 'Регистрация ключа отменена пользователем' };
    }
    return { success: false, error: error.message || 'Ошибка регистрации ключа доступа' };
  }
}

/**
 * Prompts user for Passkey verification (Windows Hello / Touch ID) and authenticates.
 */
export async function authenticateWithPasskey(
  userEmail?: string
): Promise<{ success: boolean; email?: string; error?: string }> {
  if (typeof window === 'undefined' || !window.navigator.credentials) {
    return { success: false, error: 'WebAuthn не поддерживается в этом браузере' };
  }

  try {
    const existingKeys = getStoredPasskeys(userEmail);
    const targetEmail = userEmail || getLastPasskeyEmail() || (existingKeys[0]?.userEmail ?? null);

    if (existingKeys.length === 0 && !targetEmail) {
      return {
        success: false,
        error: 'На этом устройстве еще не зарегистрирован ключ доступа. Войдите сначала по почте и привяжите ключ в настройках профиля (раздел «Безопасность»).',
      };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const allowCredentials: PublicKeyCredentialDescriptor[] = existingKeys.map((k) => ({
      type: 'public-key',
      id: base64ToBuffer(k.rawId),
      transports: ['internal'],
    }));

    const rpId = window.location.hostname;

    const requestOptions: CredentialRequestOptions = {
      publicKey: {
        challenge,
        ...(rpId !== 'localhost' ? { id: rpId } : {}),
        allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
        userVerification: 'preferred',
        timeout: 60000,
      },
    };

    const assertion = (await navigator.credentials.get(
      requestOptions
    )) as PublicKeyCredential | null;

    if (!assertion) {
      return { success: false, error: 'Не удалось подтвердить ключ доступа' };
    }

    const allKeys = getStoredPasskeys();
    const updated = allKeys.map((k) =>
      k.id === assertion.id ? { ...k, lastUsedAt: new Date().toISOString() } : k
    );
    localStorage.setItem(PASSKEY_STORAGE_KEY, JSON.stringify(updated));

    const resolvedEmail =
      allKeys.find((k) => k.id === assertion.id)?.userEmail || targetEmail || '';

    if (resolvedEmail) {
      localStorage.setItem(PASSKEY_LAST_USER_KEY, resolvedEmail);
    }

    return {
      success: true,
      email: resolvedEmail,
    };
  } catch (err: unknown) {
    const error = err as Error;
    if (error.name === 'NotAllowedError') {
      return { success: false, error: 'Авторизация по ключу доступа отменена пользователем' };
    }
    return { success: false, error: error.message || 'Ошибка авторизации по ключу доступа' };
  }
}

/**
 * Removes a stored passkey by ID.
 */
export function removeStoredPasskey(credentialId: string): void {
  if (typeof window === 'undefined') return;
  const existing = getStoredPasskeys();
  const filtered = existing.filter((k) => k.id !== credentialId);
  localStorage.setItem(PASSKEY_STORAGE_KEY, JSON.stringify(filtered));
}
