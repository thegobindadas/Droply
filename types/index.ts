
export interface UserSignUpData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
}


export interface UserProfile {
  name: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  emailAddress: string | undefined;
  avatar: string | undefined;
}