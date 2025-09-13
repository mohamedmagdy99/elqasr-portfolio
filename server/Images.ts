export const getAllImages = async () => {
    try {
        const res = await fetch('https://alqasr-backend.onrender.com/api/gallery');
        const json = await res.json();
        // Return only the image array
        return Array.isArray(json.data) ? json.data : [];

    } catch (err) {
        console.error("Failed to fetch gallery:", err);
        return [];
    }
};