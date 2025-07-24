interface IAuthUser {
    id: string;
    phoneNumber: string;
    role: 'USER'
}

interface IAuthSeller {
    id: string,
    phoneNumber: string;
    isCompleted: boolean,
    role: 'SELLER'
}

interface IAuthUserResponse {
    message: string;
    token: string;
    refreshToken: string;
    user: IAuthUser;
}

interface IAuthSellerResponse {
    message: string,
    refreshToken: string,
    seller: IAuthSeller,
    token: string
}

type IAuthResponse = IAuthUserResponse | IAuthSellerResponse