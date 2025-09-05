export type ApiResponse<T> =
    | { success: true; data: T }
    | { success: false; message: string };

export type CreateUserBody = { name: string; email: string; password: string };
