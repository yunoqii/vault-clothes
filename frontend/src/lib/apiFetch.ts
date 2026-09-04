const API_BASE_URL = "http://localhost:3000";

export const apiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });
};
