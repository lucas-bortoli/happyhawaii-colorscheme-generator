import { Palette } from "../palette.ts";

const generatedMatch = /# GENERATED(.+)# END GENERATED/gms;

export async function modifyKittyConfig(configLocation: string, palette: Palette) {
  const rawConfig = await Deno.readTextFileSync(configLocation);
  const userConfig = rawConfig.replace(generatedMatch, "").trim();

  const cursorBgColor = palette.mainColor.saturate(0.8);
  const cursorFgColor = cursorBgColor.saturate(1.0).negate().grayscale();

  const newConfig = `# GENERATED
cursor ${palette.mainColor.saturate(0.25).hex()}
cursor_text_color ${cursorFgColor.hex()}
${[
  [0, "red"],
  [120, "green"],
  [78, "yellow"],
  [250, "blue"],
  [306, "purple"],
  [210, "cyan"],
]
  .map((v, i, colorTable) => {
    const [hue, name] = v as [number, string];
    const color = palette.mainColor.hue(hue).saturationv(palette.averageSaturation * 1.1);

    return [
      `# ${name}`,
      `color${i + 8 + 1} ${color.darken(0.5).hex()}`,
      `# dark ${name}`,
      `color${i + 1} ${color.hex()}`,
    ].join("\n");
  })
  .join("\n")}
# black
color0 ${palette.mainColor.saturate(-1).darken(0.75).hex()}
# dark gray
color8 ${palette.mainColor.saturate(-1).darken(0.5).hex()}
# white
color7 ${palette.mainColor.saturate(-1).lighten(0.5).hex()}
# light gray
color15 ${palette.mainColor.saturate(-1).darken(0.25).hex()}

foreground ${palette.mainColor.saturate(-1).lighten(0.5).hex()}
background ${palette.mainColor.saturate(-1).darken(0.75).hex()}
# END GENERATED

${userConfig}`;

  await Deno.writeTextFile(configLocation, newConfig);
}

export async function reloadKittyConfig() {
  try {
    await new Deno.Command("killall", {
      args: ["-s", "SIGUSR1", "kitty"],
    }).spawn().status;
  } catch (_) {
    // Ignore error
  }
}
