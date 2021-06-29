import axios from 'axios';

export async function fetchGetJSON<T>(url: string): Promise<T> {
    try {
        const res = await axios.get<T>(url);
        return res.data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function fetchPostJSON<T, R>(url: string, data?: T): Promise<R> {
    try {
        // Default options are marked with *
        const res = await axios.post<R>(url, data, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return res.data; // parses JSON response into native JavaScript objects
    } catch (err) {
        throw new Error(err.message);
    }
}
