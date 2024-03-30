// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const colorName = ["primary", "secondary", "warning", "danger"];

const colorOrigin = ["blue", "gray", "yellow", "red"];

const cssStyle = ["bg", "border", "outline", "text"];

const cssStyleOrigin = ["background-color", "border", "outline", "color"];

function produceStyle() {
  let fullText = ``;
  cssStyle.forEach((style, idx1) => {
    let texts1 = ``;
    colorName.forEach((color, idx2) => {
      let texts = ``;
      for (let i = 1; i <= 9; i++) {
        texts = `${texts} .${style}-${color}-${i}  {@apply ${style}-${colorOrigin[idx2]}-${i}00}`;
      }
      texts1 = `${texts1} ${texts}`;
    });
    fullText = `${fullText} ${texts1}`;
  });

  console.log(fullText);

  fs.writeFile(
    "./src/styles/auto.css",
    `@layer base { ${fullText} } @tailwind base;`,
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
