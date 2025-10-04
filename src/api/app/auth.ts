import { apiClient, setApiToken, clearApiToken } from "./config";
import { decodeJWT, UserInfo } from "./jwt-utils";

// Token management
class TokenManager {
	private accessTokenKey = "accessToken";
	private refreshTokenKey = "refreshToken";
	private userUpdateCallback?: (token: string) => void;

	// Set callback for user updates
	setUserUpdateCallback(callback: (token: string) => void) {
		this.userUpdateCallback = callback;
	}

	// Store tokens securely
	storeTokens(accessToken: string, refreshToken: string) {
		setApiToken(accessToken);

		// Store tokens in localStorage
		localStorage.setItem(this.accessTokenKey, accessToken);
		localStorage.setItem(this.refreshTokenKey, refreshToken);

		// Update user info from access token
		if (this.userUpdateCallback) {
			this.userUpdateCallback(accessToken);
		}
	}

	// Get stored refresh token
	getRefreshToken(): string | null {
		return localStorage.getItem(this.refreshTokenKey);
	}

	// Get stored access token
	getAccessToken(): string | null {
		return localStorage.getItem(this.accessTokenKey);
	}

	// Check if token is expired
	isTokenExpired(): boolean {
		const accessToken = localStorage.getItem(this.accessTokenKey);
		if (!accessToken) return false;

		const userInfo = decodeJWT(accessToken);
		if (!userInfo || !userInfo.exp) return false;

		return Date.now() > userInfo.exp * 1000;
	}

	// Refresh access token
	async refreshAccessToken(): Promise<boolean> {
		const refreshToken = this.getRefreshToken();
		if (!refreshToken) return false;

		try {
			const response = await apiClient.refreshToken({ refreshToken });

			if (response.meta?.success && response.data?.accessToken) {
				this.storeTokens(response.data.accessToken, response.data.refreshToken!);
				return true;
			}
		} catch (error) {
			console.error("Failed to refresh token:", error);
			this.clearTokens();
		}

		return false;
	}

	// Clear all tokens
	clearTokens() {
		clearApiToken();
		localStorage.removeItem(this.accessTokenKey);
		localStorage.removeItem(this.refreshTokenKey);
	}

	// Get current user info from stored token
	getCurrentUserInfo(): UserInfo | null {
		const accessToken = this.getAccessToken();
		if (accessToken) {
			return decodeJWT(accessToken);
		}
		return null;
	}

	// Auto refresh token if needed
	async ensureValidToken(): Promise<boolean> {
		if (this.isTokenExpired()) {
			return await this.refreshAccessToken();
		}
		return true;
	}

	// Initialize token on app start
	initializeToken() {
		const refreshToken = this.getRefreshToken();
		if (refreshToken && this.isTokenExpired()) {
			this.refreshAccessToken();
		}
	}
}

export const tokenManager = new TokenManager();
