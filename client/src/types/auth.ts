export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  COMPANY = 'company',
}

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse {
  user: IUser;
  tokens: IAuthTokens;
}

export interface ILoginDto {
  email: string;
  password: string;
}

