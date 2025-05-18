// auth.ts
export interface UserCreate {
    user_name: string;
    email: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserRead {
    id: number;
    user_name: string;
    email: string;
    created_at: string;
    last_login: string;
}

const API_URL = 'http://localhost:8000/users';

// Đăng ký người dùng mới
export const signUp = async (userData: UserCreate): Promise<UserRead> => {
    const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Đăng ký thất bại');
    }

    return response.json();
};

// Đăng nhập
export const login = async (credentials: UserLogin): Promise<UserRead> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Đăng nhập thất bại');
    }

    return response.json();
};

// Lấy danh sách người dùng (cần auth token)
export const getUsers = async (token: string): Promise<UserRead[]> => {
    const response = await fetch(`${API_URL}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Lỗi khi lấy danh sách người dùng');
    }

    return response.json();
};