// Alias cho kiểu char_name
type ASLCharName = string;

export interface ASLCreate {
    char_name: ASLCharName;
    char_image_url: string;
    char_tutorial_text?: string;
    char_tutorial_url?: string;
}

export interface ASLRead {
    char_name: ASLCharName;
    char_image_url: string;
    char_tutorial_text?: string;
    char_tutorial_url?: string;
}

export interface ASLUpdate {
    char_name: ASLCharName;
    char_image_url?: string;
    char_tutorial_text?: string;
    char_tutorial_url?: string;
}

export interface ASLDelete {
    char_name: ASLCharName;
}
