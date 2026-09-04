import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import path from "path";

/**
 * Copy all package config files into the application config directory.
 */
const configPath: string = path.resolve(__dirname, "config");

/** Match JavaScript and TypeScript config file extensions. */
const regex: RegExp = /\.(m?js|ts)$/;

/** The list of config files found in the package config directory. */
const configs: Array<string> = Array.from(
    new Bun.Glob("**/*").scanSync({
        cwd: configPath
    })
).filter((value) => regex.test(value) && !value.endsWith(".d.ts"));

for (const config of configs) {
    const destination = config.replace(regex, ".ts");

    await Bun.write(
        App.Path.configPath(destination),
        await Bun.file(path.resolve(configPath, config)).text()
    );

    Logger.setContext("CONFIGURE").info(`Copying ${config} into config/${destination}`);
}
