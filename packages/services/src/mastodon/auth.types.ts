export interface CreateApplicationBody {
    client_name: string;
    redirect_uris: string;
    scopes: string;
    website: string;
}

export interface CreateApplicationData {
    id: string;
    name: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    website: string;
}

export interface GetTokenBody {
    client_id: string;
    client_secret: string;
    grant_type: "authorization_code";
    redirect_uri: string;
    code: string;
}

export interface GetTokenData {
    access_token: string;
    token_type: string;
    scope: string;
    created_at: number;
}

export interface GetTokenQuery {
    client_id: string;
    client_secret: string;
    grant_type: "authorization_code";
    code: string;
    redirect_uri: string;
}
