interface IApiLocationResponse {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address: Address;
    boundingbox: string[];
  }
  interface Address {
    hamlet: string;
    village: string;
    state_district: string;
    'ISO3166-2-lvl5': string;
    postcode: string;
    country: string;
    country_code: string;
  }