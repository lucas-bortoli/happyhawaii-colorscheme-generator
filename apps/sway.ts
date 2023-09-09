import { Palette } from "../palette.ts";

const generatedMatch = /# GENERATED(.+)# END GENERATED/gsm;

export async function modifySwayConfig(
  configLocation: string,
  palette: Palette,
  wallpaper: string,
) {
  const rawConfig = await Deno.readTextFileSync(configLocation);
  const userConfig = rawConfig.replace(generatedMatch, "").trim();

  const focusBorderColor = palette.mainColor.saturate(0.25);
  const unfocusBorderColor = palette.secondaryColor.darken(0.5);

  const newConfig = `# GENERATED
set $border_color "${focusBorderColor.hexa()}"
set $unfocus_border_color "${unfocusBorderColor.hexa()}"
set $wallpaper ${wallpaper}
# END GENERATED

${userConfig}`;

  await Deno.writeTextFile(configLocation, newConfig);
}

export async function reloadSwayConfig() {
  try {
    return await new Deno.Command("swaymsg", { args: ["reload"] }).spawn()
      .status;
  } catch (_) {
    // Ignore error
  }
}
