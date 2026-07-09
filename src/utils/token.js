import { jwtDecode } from "jwt-decode";

const REFRESH_THRESHOLD = 10; // detik

export const shouldRefreshToken = (token) => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);

    const now = Math.floor(Date.now() / 1000);

    return exp - now <= REFRESH_THRESHOLD;
  } catch (error) {
    return true;
  }
};