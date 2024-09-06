import { Coordinates } from "./Coordinates";

export interface Bounds {
    north_west_corner: Coordinates;
    size_degrees: number;
}

export interface Environment {
    perimeter: Array<Coordinates>;
    cells: Array<Bounds>;
}
