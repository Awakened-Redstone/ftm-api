export interface TwitchResponse {}

export interface GetUsersResponse extends TwitchResponse {
    data: User[]
}

export interface User {
    id: string,
    login: string,
    display_name: string,
    type: 'staff' | 'admin' | 'global_mod' | '',
    broadcaster_type: 'partner' | 'affiliate' | '',
    description: string,
    profile_image_url: string,
    offline_image_url: string,
    view_count: 0,
    created_at: string,
}
