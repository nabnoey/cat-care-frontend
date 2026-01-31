export interface Cat {
  _id: string;
  name: string;
  ageYears: number;
  ageMonths: number;
  imageUrl?: string;
  owner: string;
}

export interface Service {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  type?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
}

export interface Booking {
  _id: string;
  cat: Cat;
  service: Service;
  bookingDate: string;
  status?: string;
  owner: string | User;
}