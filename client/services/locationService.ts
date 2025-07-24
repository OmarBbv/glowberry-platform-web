export const reverseGeocode = async (lat: number, lng: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'my-app',
            },
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Ters geocode hatası:', err);
        return null;
    }
};
