// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const colors = ["primary", "secondary", "warning", "success", "danger"];

const variants = ["solid", "outline", "outline-2", "ghost"];

function styleTemplate(style, color) {
  const SOLID = [
    `bg-${color}-5 text-white`,
    `hover:bg-${color}-6`,
    `active:bg-${color}-7`,
  ];

  const GHOST = [
    `text-${color}-6`,
    `hover:bg-${color}-1`,
    `active:bg-${color}-2`,
  ];

  const OUTLINE = [...GHOST, `border border-${color}-6`];

  const OUTLINE_COLORLESS = [...GHOST, `border border-gray-300`];

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
    "./src/consts/style/button.json",
    JSON.stringify(collection),
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
