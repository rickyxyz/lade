// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const colors = ["primary", "secondary", "warning", "success", "danger"];

const variants = ["solid", "outline", "outline-2", "ghost"];

function styleTemplate(style, color) {
  const SOLID = [
    `bg-${color}-500 text-white`,
    `hover:bg-${color}-600`,
    `active:bg-${color}-700 focus:bg-${color}-600`,
  ];

  const GHOST = [
    `text-${color}-600`,
    `hover:bg-${color}-100`,
    `active:bg-${color}-200 focus:bg-${color}-100`,
  ];

  const OUTLINE = [...GHOST, `border border-${color}-500`];

  const OUTLINE_COLORLESS = [...GHOST, `border border-secondary-300`];

  switch (style) {
    case "solid":
      return SOLID;
    case "outline":
      return OUTLINE_COLORLESS;
    case "outline-2":
      return OUTLINE;
    default:
      return GHOST;
  }
}

function produceStyle() {
  console.log("Producing Style");

  const collection = {};

  variants.forEach((variant) => {
    const currentVariantCollection = {};
    colors.forEach((color) => {
      currentVariantCollection[color] = styleTemplate(variant, color);
    });
    collection[variant] = currentVariantCollection;
  });

  fs.writeFile(
    "./src/consts/style/button.ts",
    `import { ButtonVariantType, GenericColorType } from "@/types"\nexport const BUTTON_VARIOUS_STYLE: Record<ButtonVariantType, Record<GenericColorType, string[]>> = ${JSON.stringify(
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
