export interface NewUserRequest {
    email: string;
    password: string;
    roles: string[];
    name: string;
}

export interface UserTokenResponse {
    userProfile: object;
    token: {
        value: string,
        expiredAt: Date
    }
}
