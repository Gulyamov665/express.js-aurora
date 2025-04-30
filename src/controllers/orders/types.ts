import { Request } from "express";

export type TypedRequest<T> = Request<{}, {}, T>;

export type UserInfoType = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  avatar?: null;
  user_registered_at: string;
  is_active: boolean;
  is_user: boolean;
  is_vendor: boolean;
  location: UserLocationType;
};

export type UserLocationType = {
  lat: string;
  long: string;
  house?: string;
  apartment?: string;
  floor?: string;
  entrance?: string;
  address: string;
  comment?: string;
  name?: string;
  is_active?: boolean;
  street?: string;
  user: number;
};
