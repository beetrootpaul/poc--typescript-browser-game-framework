#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const argv = require("yargs")
  .strict()
  .scriptName("beetpx")
  .command(
    ["dev", "$0"],
    "Start the game in a dev mode, with hot reloading and a sample HTML page."
  )
  .command("build", "Builds a production-ready bundle with the game.")
  .command("preview", "Starts a production-ready bundle of the game.")
  .command(
    "zip",
    "Generates a ZIP file with a previously built production-ready bundle and static assets in it. Ready to be uploaded to e.g. itch.io."
  )
  .alias({
    h: "help",
  })
  .showHelpOnFail(true)
  .help().argv;

const beetPxCodebaseDir = path.resolve(__dirname, "..");
const gameCodebaseDir = process.cwd();
const tmpBeetPxDir = ".beetpx/";
const gameHtml = "index.html";
const itchIoSimulationHtml = "itch_io_simulation.html";
const buildOutDirAsExpectedByVitePreview = "dist/";
const distZipDir = "dist/";
const distZipFile = "game.zip";

if (argv._.includes("dev")) {
  runDevCommand();
} else if (argv._.includes("build")) {
  runBuildCommand();
} else if (argv._.includes("preview")) {
  runPreviewCommand();
} else if (argv._.includes("zip")) {
  runZipCommand();
} else {
  throw Error("This code should not be reached :-)");
}

function runDevCommand() {
  fs.mkdirSync(path.resolve(gameCodebaseDir, tmpBeetPxDir), {
    recursive: true,
  });

  // TODO: Find a way to put HTML files inside `.beetpx/` and still make everything work OK. Maybe some server middleware for route resolution?
  fs.copyFileSync(
    path.resolve(beetPxCodebaseDir, "html_templates", itchIoSimulationHtml),
    path.resolve(gameCodebaseDir, itchIoSimulationHtml)
  );
  fs.copyFileSync(
    path.resolve(beetPxCodebaseDir, "html_templates", gameHtml),
    path.resolve(gameCodebaseDir, gameHtml)
  );

  // Vite docs:
  //   - https://vitejs.dev/guide/api-javascript.html#createserver
  //   - https://vitejs.dev/config/shared-options.html
  //   - https://vitejs.dev/config/server-options.html
  require("vite")
    .createServer({
      configFile: false,
      root: gameCodebaseDir,
      publicDir: path.resolve(gameCodebaseDir, "public"),
      cacheDir: path.resolve(gameCodebaseDir, tmpBeetPxDir, ".vite"),
      // Base `./` is crucial for itch.io, since it produces
      //     <script type="module" crossOrigin src="./assets/index-<hash>.js"></script>
      //   instead of
      //     <script type="module" crossOrigin src="/assets/index-<hash>.js"></script>
      //   and the latter does not work there.
      base: "./",
      resolve: {
        alias: {
          // needed for itch.io simulation page to import jQuery from this codebase here instead of the game's codebase
          jquery: path.resolve(beetPxCodebaseDir, "node_modules/jquery"),
        },
      },
      server: {
        open: itchIoSimulationHtml,
        hmr: true,
      },
      logLevel: "info",
    })
    .then((devServer) =>
      devServer.listen().then(() => {
        devServer.printUrls();
      })
    )
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

function runBuildCommand() {
  fs.mkdirSync(path.resolve(gameCodebaseDir, tmpBeetPxDir), {
    recursive: true,
  });

  // TODO: Find a way to put HTML files inside `.beetpx/` and still make everything work OK. Maybe some server middleware for route resolution?
  fs.copyFileSync(
    path.resolve(beetPxCodebaseDir, "html_templates", gameHtml),
    path.resolve(gameCodebaseDir, gameHtml)
  );

  // Vite docs:
  //   - https://vitejs.dev/guide/api-javascript.html#build
  //   - https://vitejs.dev/config/shared-options.html
  //   - https://vitejs.dev/config/build-options.html
  require("vite")
    .build({
      configFile: false,
      root: gameCodebaseDir,
      publicDir: path.resolve(gameCodebaseDir, "public"),
      cacheDir: path.resolve(gameCodebaseDir, tmpBeetPxDir, ".vite"),
      base: "./",
      build: {
        outDir: path.resolve(
          gameCodebaseDir,
          tmpBeetPxDir,
          buildOutDirAsExpectedByVitePreview
        ),
        emptyOutDir: true,
      },
      logLevel: "info",
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

function runPreviewCommand() {
  fs.mkdirSync(path.resolve(gameCodebaseDir, tmpBeetPxDir), {
    recursive: true,
  });

  // Vite docs:
  //   - https://vitejs.dev/guide/api-javascript.html#preview
  //   - https://vitejs.dev/config/shared-options.html
  //   - https://vitejs.dev/config/preview-options.html
  require("vite")
    .preview({
      configFile: false,
      root: path.resolve(gameCodebaseDir, tmpBeetPxDir),
      cacheDir: path.resolve(gameCodebaseDir, tmpBeetPxDir, ".vite"),
      base: "./",
      preview: {
        open: true,
      },
      logLevel: "info",
    })
    .then((previewServer) => {
      previewServer.printUrls();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

function runZipCommand() {
  // TODO: throw error if "build" was not invoked before or rather there are no files to zip
  fs.mkdirSync(path.resolve(gameCodebaseDir, distZipDir), {
    recursive: true,
  });

  require("cross-zip").zipSync(
    path.resolve(
      gameCodebaseDir,
      tmpBeetPxDir,
      buildOutDirAsExpectedByVitePreview
    ),
    path.resolve(gameCodebaseDir, distZipDir, distZipFile)
  );

  console.log(
    `Zip got created in: ${path.relative(
      process.cwd(),
      path.resolve(gameCodebaseDir, distZipDir, distZipFile)
    )}`
  );
}
