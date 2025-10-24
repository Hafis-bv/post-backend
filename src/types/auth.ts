export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}
