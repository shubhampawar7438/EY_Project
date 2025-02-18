export interface UserRegistration {
  fullName: string;
  email: string;
  password: string;
  age: number;
  educationLevel: string;
  currentlyStudying: string;
}

export interface UserLogin {
  email: string;
  password: string;
}