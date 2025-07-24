import { reverseGeocode } from "@/services/locationService";
import { getLocation } from "@/utils/getLocation";

export const useLocation = async () => {
    try {
        const location = await getLocation();
        const result = await reverseGeocode(location.lat, location.lng);
        console.log(result?.display_name);
    } catch (error) {
        console.error('Konum hatası:', error);
    }
};