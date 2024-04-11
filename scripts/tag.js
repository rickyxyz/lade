// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const colors = ["primary", "secondary", "warning", "success", "danger"];

function styleTemplate(color) {
  return [`bg-${color}-100 text-${color}-600`];
}

function produceStyle() {
  console.log("Producing Style");

  const collection = {};

  colors.forEach((color) => {
    collection[color] = styleTemplate(color);
  });

  fs.writeFile(
    "./src/consts/style/tag.ts",
    `import { GenericColorType } from "@/types"\nexport const TAG_COLOR_STYLE: Record<GenericColorType, string[]> = ${JSON.stringify(
      collection
    )};`,
    (err) => {
      if (err) {
        console.error(err);
      } else {
        // file written successfully
      }
    }
  );
}

produceStyle();
