#!/usr/bin/env -S deno run -A

import { join } from "https://deno.land/std@0.201.0/path/join.ts";
import { Palette } from "./palette.ts";
import { modifyKittyConfig, reloadKittyConfig } from "./apps/kitty.ts";
import { modifySwayConfig, reloadSwayConfig } from "./apps/sway.ts";

function chooseRandomWallpaper(sourceDirectory: string) {
  const wallpaperList = [...Deno.readDirSync(sourceDirectory)].filter(
    (f) => f.isFile || f.isSymlink
  );
  const chosenWallpaper = wallpaperList[Math.floor(Math.random() * wallpaperList.length)];

  return join(sourceDirectory, chosenWallpaper.name);
}

async function main() {
  const HOME = Deno.env.get("HOME")!;
  const WALLPAPER_DIRECTORY = join(HOME, "Pictures/Wallpapers/rotation");

  const newWallpaper = chooseRandomWallpaper(WALLPAPER_DIRECTORY);
  const palette = await Palette.fromImage(newWallpaper);

  console.log(palette.asConsoleAnsiCodes());

  await modifySwayConfig(join(HOME, ".config/sway/config"), palette, newWallpaper);
  await modifyKittyConfig(join(HOME, ".config/kitty/kitty.conf"), palette);

  await reloadSwayConfig();
  await reloadKittyConfig();
}

main();
