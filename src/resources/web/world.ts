namespace World {
	export const HEIGHT = 64;
	export const SIZE = 256;
	const cubes = new Uint32Array(SIZE * SIZE * HEIGHT);

	export function get(x: number, y: number, z: number) {
		if (x >= SIZE || x < 0 || y >= HEIGHT || y < 0 || z >= SIZE || z < 0) {
			return 0;
		}

		return cubes[x + y * SIZE + z * HEIGHT * SIZE];
	}

	export function set(x: number, y: number, z: number, value: number) {
		if (x >= SIZE || x < 0 || y >= HEIGHT || y < 0 || z >= SIZE || z < 0) {
			throw "Index out of bounds";
		}

		cubes[x + y * SIZE + z * HEIGHT * SIZE] = value;
	}
}