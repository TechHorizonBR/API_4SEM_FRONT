export interface User {
    id: number,
    nome: string, 
    coordenadas: Coordinate[]
}
export interface Coordinate {
    lat: number;
    lng: number;
  }