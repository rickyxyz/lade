export const md = require("markdown-it")({
  html: false,
}).disable(["link", "image", "heading"]);
export const mathjax3 = require("markdown-it-mathjax3");
