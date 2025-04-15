export async function fetcher<Response>(url: string, options?: RequestInit): Promise<{ data: Response | null; error: any }> {
    try {
        const res = await fetch(url, options);

        // If the response is not OK, handle it based on the status code
        if (!res.ok) {
            if (res.status === 404) {
                // Handle 404 as a common case by returning null data
                return { data: null, error: { status: res.status, message: "Resource not found" } };
            }

            // For other non-2xx status codes, return a structured error
            const errorData = await res.json(); // Attempt to parse error details from the response
            return { data: null, error: { status: res.status, message: errorData.message || "An error occurred" } };
        }

        // Parse and return the successful response data
        const data: Response = await res.json();
        return { data, error: null };
    } catch (err: any) {
        // Handle network or unexpected errors
        return { data: null, error: { status: null, message: err.message || "A network error occurred" } };
    }
}