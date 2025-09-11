export const getAllImages = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/gallery');
        const json = await res.json();
        // Return only the image array
        return Array.isArray(json.data) ? json.data : [];

    } catch (err) {
        console.error("Failed to fetch gallery:", err);
        return [];
    }
};