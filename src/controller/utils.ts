/**
 * The function `componentToHex` converts a number to its hexadecimal representation.
 * @param {number} c - The parameter `c` in the `componentToHex` function is a number representing a
 * color component value.
 * @returns The function `componentToHex` returns a string representing the hexadecimal value of the
 * input number `c`. If the hexadecimal value is a single digit, the function adds a leading zero to
 * ensure it is two characters long.
 */
export function componentToHex(c: number) {
	var hex = c.toString(16);
	return hex.length === 1 ? "0" + hex : hex;
}

/**
 * It takes a string in the format of `rgb(r, g, b)` and returns a hexadecimal string in the format of
 * `0xRRGGBB`
 * @param {string} rgb - The RGB string to convert to hex.
 * @returns A hexadecimal number
 */
export function rgbToHex(rgb: string): string {
	const [r,g,b] = rgbStringToRgbArray(rgb);
	let hex = componentToHex(r) + componentToHex(g) + componentToHex(b);
    return "#" + hex;
}

/**
 * The function takes a string representing an RGB color value and converts it into an array of RGB
 * components.
 * @param {string} rgb - The `rgb` parameter is a string representing an RGB color value in the format
 * "rgb(r, g, b)", where r, g, and b are integers between 0 and 255.
 * @returns an array of strings representing the RGB components of the input RGB string.
 */
export function rgbStringToRgbArray(rgb: string) {
	let rgbComponents: string | string[] = rgb.split("(")[1].split(")")[0];
	rgbComponents = rgbComponents.split(',');
	let result = rgbComponents.map((component) => parseFloat(component));
	return result;
}

/**
 * The function `isNumeric` checks if a given input is a numeric value, handling different data types
 * and string parsing.
 * @param {unknown} str - The `str` parameter in the `isNumeric` function is used to check if a given
 * value is numeric. The function returns `true` if the value is a number or a bigint, or if the string
 * representation of the value can be parsed into a valid number. If the `str`
 * @returns The function `isNumeric` returns a boolean value indicating whether the input `str` is
 * numeric or not.
 */
export function isNumeric(str: unknown): boolean {
	if (str === undefined) return false;
	if (typeof str === 'number' || typeof str === 'bigint') return true;
	if (typeof str !== "string") return false // we only process strings!  
	return !Number.isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		   !Number.isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

/**
 * The function `lerp` performs linear interpolation between two numbers `a` and `b` based on a
 * parameter `t`.
 * @param {number} a - The parameter `a` represents the starting value from which you want to
 * interpolate.
 * @param {number} b - The parameter `b` represents the end value or target value that you want to
 * interpolate towards in the linear interpolation function.
 * @param {number} t - The parameter `t` in the `lerp` function represents the interpolation factor. It
 * is a value between 0 and 1 that determines how much of the interpolation should be between `a` and
 * `b`. A `t` value of 0 will result in the output being equal to
 * @returns the linear interpolation value between `a` and `b` based on the parameter `t`.
 */
export function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}