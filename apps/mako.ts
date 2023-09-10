import { Palette } from "../palette.ts";

const generatedMatch = /# GENERATED(.+)# END GENERATED/gms;

export async function modifyMakoConfig(configLocation: string, palette: Palette) {
  const rawConfig = await Deno.readTextFileSync(configLocation);
  const userConfig = rawConfig.replace(generatedMatch, "").trim();

  const newConfig = `# GENERATED
border-color=${palette.mainColor.saturate(0.25).hex()}
text-color=${palette.mainColor.saturate(-1).lighten(0.5).hex()}
background-color=${palette.mainColor.saturate(-1).darken(0.75).alpha(0.8).hexa()}
# END GENERATED

${userConfig}`;

  await Deno.writeTextFile(configLocation, newConfig);
}

export async function reloadMakoConfig() {
  try {
    await new Deno.Command("killall", {
      args: ["mako"],
    }).spawn().status;
  } catch (_) {
    // Ignore error
  }
}
