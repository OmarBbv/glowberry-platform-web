export const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Tarayıcınız konum servislerini desteklemiyor.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => {
                reject("Konum alınamadı: " + err.message);
            }
        );
    });
};
