const API_BASE_URL = "http://localhost:3000";

export const apiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem("token");
    const isFormData = options.body instanceof FormData;

    const headers = {
        // FormData (file uploads) needs the browser to set its own
        // multipart Content-Type with a boundary — never set it manually.
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });
};
