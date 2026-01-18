import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { queryClient } from '@/app/providers/query';
import { UserRole } from '@/entities/account';

export const api = axios.create({
  baseURL: __API_HOST__,
  withCredentials: true,
});

interface TokenPayload {
  userId: number;
  role: UserRole;
  exp: number;
  iat: number;
}

export interface PaginatedParams {
  offset: number;
  limit: number;
  search?: string;
  orderBy?: string;
  sort?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  limit: number;
  offset: number;
  totalCount: number;
  data: T[];
}

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use(async (config) => {
  const data = queryClient.getQueryData<{ accessToken: string }>(['auth']);
  let token = data?.accessToken;

  if (config.url) {
    if (
      config.url.startsWith('/auth/tma') ||
      config.url.startsWith('/auth/refresh')
    ) {
      return config;
    }

    let payload: TokenPayload | null = null;

    try {
      payload = token
        ? jwtDecode<TokenPayload>(token.replace('Bearer ', ''))
        : null;
    } catch (e) {
      console.error(e);
    }

    if (!payload || (payload && payload.exp < Date.now() / 1000 - 1)) {
      if (!refreshPromise) {
        refreshPromise = api
          .get<{ accessToken: string }>('/auth/refresh')
          .then(({ data }) => data.accessToken);
      }

      token = await refreshPromise;
      queryClient.setQueryData(['auth'], { accessToken: token });
      refreshPromise = null;
    }
  }

  config.headers.Authorization = token;

  return config;
});
