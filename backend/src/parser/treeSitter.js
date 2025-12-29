import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";
import Python from "tree-sitter-python";
import HTML from "tree-sitter-html";

const parser = new Parser();

export const LANGUAGES = {
  javascript: JavaScript,
  jsx: JavaScript, // tree-sitter-javascript handles JSX
  python: Python,
  html: HTML,
};

export function setLanguage(lang) {
  const grammar = LANGUAGES[lang];
  if (grammar) {
    parser.setLanguage(grammar);
    return true;
  }
  return false;
}

export function parseCode(code) {
  return parser.parse(code);
}

export { parser };
