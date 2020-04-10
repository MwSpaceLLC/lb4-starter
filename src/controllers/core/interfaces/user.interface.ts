// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export interface LoginUserRequest {
    email: string;
    password: string;
    remember?: boolean
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    agreement?: boolean
}

export interface UserTokenResponse {
}
