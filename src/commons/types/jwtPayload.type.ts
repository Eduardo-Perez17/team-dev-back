export type JwtPayload = {
  user: any;
  role: string;
  sub: number;
  iat: number;
  exp: number;
};
