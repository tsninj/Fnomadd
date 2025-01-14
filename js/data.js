export const fetchBooksData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Books data oldsongui ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Aldaa garlaa', error);
        throw error;
    }
};
