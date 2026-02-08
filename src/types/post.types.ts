export interface CreatePostDTO {
    content: string;
    type?: 'text' | 'image' | 'multi_image';
}

export interface UpdatePostDTO {
    content: string;
}

export interface Post {
    id: number;
    user_id: number;
    content: string;
    image_url?: string;
    images?: string[];
    type: string;
    likes_count: number;
    comments_count: number;
    created_at: Date;
    username?: string;
    full_name?: string;
    profile_picture?: string;
    is_liked?: boolean;
    is_saved?: boolean;
}