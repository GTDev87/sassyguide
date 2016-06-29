const fs = require('fs');
var sass = require('node-sass');
var css = require('css');
var entries = require('object.entries');

if (!Object.entries) { entries.shim(); }

const filterArray = [
  // (sel) => sel.length === 1,
  (sel) => /^\./.test(sel[0])
];

const filters = (selector) => filterArray.reduce((sel, fil) => sel && fil(sel) && sel, selector)

const groupBy = (arr, groupFn) => (arr.reduce((memo, ele) => {
  const group = groupFn(ele);
  return Object.assign({}, memo, { [group]: (memo[group] || []).concat([ele])});
}, {}));

const constructTree = (partsArray) => 
  Object
    .entries(groupBy(partsArray, (arr) => arr[0]))
    .map((pair) => {
      const tree = constructTree(pair[1]
        .map((ele) => ele.slice(1))
        .filter((ele) => ele.length));
      return Object.assign({name: pair[0]}, tree.length ? {data: tree} : {})
    });

const createDefaultComponentDefault = (classNames, defaultString) => 
  `${defaultString} { ${classNames.map((name) => `&${name} { /* empty */ }`).join(" ") } }`;

const createDefaultGlue = (classNames, defaultString) => 
  classNames.map((name) => `${name} { @extend ${name}${defaultString}; }`).join(" ");

const classNamesWrapper = (componentCss, classNames) => (utilityCssPath, mapping) => {
  const utilityCss = fs.readFileSync(utilityCssPath, "utf-8");

  const defaultDefault = createDefaultComponentDefault(classNames, ".default");
  const defaultGlue = createDefaultGlue(classNames, ".default");

  return sass.renderSync({data: `${componentCss} ${defaultDefault} ${defaultGlue} ${mapping === true ? utilityCss : ""}`}).css.toString();
};

module.exports = {
  componentCssBase: (componentCSSPath) => {
    const componentCssFile = fs.readFileSync(componentCSSPath, "utf-8");

    const componentCss = sass.renderSync({data: componentCssFile}).css.toString();

    var result = css.parse(componentCss)
      .stylesheet
      .rules
      .map((rule) => rule.selectors)
      .filter(filters)
      .map((sel) => sel[0]);

    const selParts = result.map((ele) => ele.split(' '));    
    const resTree = constructTree(selParts);
    const classNames = resTree.map((sel) => sel.name);

    return {classNames: classNames, parse: classNamesWrapper(componentCss, classNames)};
  }
};