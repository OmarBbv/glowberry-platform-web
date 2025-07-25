import { reverseGeocode } from "@/services/locationService";
import { getLocation } from "./getLocation";

export const fetchAndSetLocation = async (
    setLocation: React.Dispatch<React.SetStateAction<string | null>>
) => {
    try {
        const location = await getLocation();
        const result: IApiLocationResponse = await reverseGeocode(location.lat, location.lng);
        if (!result) return null;

        const loc = result.address.state_district.split(' ');

        localStorage.setItem('location', loc?.[0]);

        window.dispatchEvent(new Event('localStorageChange'));

        console.log('result', result);

        setLocation(result.address.state_district);
    } catch (error) {
        console.error('Konum hatası:', error);
    }
};
