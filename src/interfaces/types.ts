export interface User {
    id: number,
    nome: string, 
    coordenadas: Coordinate[]
}
export interface Coordinate {
    lat: number;
    lng: number;
  }
export interface Location {
    dataInicio: string,
    dataFim: string,
    longitudeInicio: number,
    longitudeFim: number,
    latitudeInicio: number
    latitudeFim: number
}