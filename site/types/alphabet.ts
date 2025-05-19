// Alias cho kiểu char_name
type ASLCharName = string;

export interface ASL {
    char_name: ASLCharName;
    char_image_url: string;
    char_tutorial_text?: string;
    char_tutorial_url?: string;
}
