import { axiosInstance } from "../axios"


export interface LoginCredentials {
  username: string
  password: string
}
export interface IToken{
  token:string;
}
export interface LoginResponse {
  id?: string
  username?: string
  email?: string
  accessToken: IToken
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Mock response for testing
      if (credentials.username === "test@test.com" && credentials.password === "123456") {
        return {
          id: "1",
          username: "test",
          email: "test@test.com",
          accessToken: {token:"mock_token_123456"}
        };
      }

      const response = await axiosInstance.post("/Users/panel/users/login", credentials)
      console.log(response,"responseeee")
      return response.data.responseValue
    } catch (error: any) {
      console.log(error.response?.data.error.message , "error message")
      // Throw the actual error message from the API
      throw new Error(error.response?.data?.error?.message || 'Login failed');
    }
  },

  async logout(): Promise<void> {
    // Implement logout logic if needed
  },


}
