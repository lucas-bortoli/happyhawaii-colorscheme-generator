import ColorThief from "npm:colorthief";
// @deno-types="npm:@types/color"
import Color from "npm:color";

import * as ansi from "./ansiEscape.ts";

export type Rgb = [number, number, number];

export class Palette {
  colors: Color[];

  private constructor(colors: Color[]) {
    this.colors = colors.sort((a, b) => b.luminosity() - a.luminosity());
  }

  /**
   * Returns the ANSI representation of this Palette, for printing to a
   * true color capable terminal.
   */
  asConsoleAnsiCodes(colorWidth = 6) {
    const colors = [];

    for (const color of this.colors) {
      colors.push(
        ansi.setBgColor(color.red(), color.green(), color.blue()) + " ".repeat(colorWidth)
      );
    }

    return colors.join("") + ansi.resetColors();
  }

  /**
   * Gets the "main color" from this Palette.
   * This is defined as the second most luminous color.
   */
  get mainColor() {
    return this.colors.at(1)!;
  }

  /**
   * Gets the "secondary color" from this Palette.
   * This is defined as the second to last most luminous color.
   */
  get secondaryColor() {
    return this.colors.at(-2)!;
  }

  get averageSaturation() {
    const hueSum = this.colors.map((color) => color.saturationv()).reduce((acc, hue) => acc + hue);

    return hueSum / this.colors.length;
  }

  static async fromImage(imageLocation: string): Promise<Palette> {
    const colorsRaw = (await ColorThief.getPalette(imageLocation, 6)) as Rgb[];

    return new Palette(colorsRaw.map((c) => Color.rgb(...c)));
  }
}
