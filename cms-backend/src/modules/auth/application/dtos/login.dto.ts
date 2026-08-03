export class LoginDto {
  username: string;
  password: string;
}

export class TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}
