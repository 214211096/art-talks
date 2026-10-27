import { API_URL } from './config';

export async function fetchPictures(signal) {
    const response = await fetch(`${API_URL}/api/pictures`, { signal });
    if (!response.ok) {
        throw new Error(`Failed to load pictures (${response.status})`);
    }
    return response.json();
}
