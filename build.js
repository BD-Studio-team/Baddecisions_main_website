#!/usr/bin/env node

// Build script — inlines section partials into page templates
// Replaces client-side fetch() assembly with pre-rendered HTML

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TEMPLATES_DIR = path.join(ROOT, 'templates');

// Regex to match <div data-include="/sections/xyz.html"></div>
const INCLUDE_RE = /<div\s+data-include="(\/sections\/[^"]+)"\s*><\/div>/g;

// Regex to match the inline loader IIFE script block
const LOADER_IIFE_RE = /\s*<script>\s*\(function\(\)\s*\{[\s\S]*?sections-loaded[\s\S]*?\}\)\(\);\s*<\/script>/;

// Regex to match <script src="/js/loader.js"></script>
const LOADER_SCRIPT_RE = /\s*<script\s+src="\/js\/loader\.js"\s*><\/script>/;

// Inject globals.css before style.css (regex matches both plain and fetchpriority variants)
const STYLE_LINK_RE = /<link rel="stylesheet" href="\/css\/style\.css"([^>]*?)\s*\/?\s*>/;
const GLOBALS_INJECT = (match, attrs) => {
  const cleanAttrs = attrs.trim();
  const styleTag = cleanAttrs
    ? `<link rel="stylesheet" href="/css/style.css" ${cleanAttrs} />`
    : `<link rel="stylesheet" href="/css/style.css" />`;
  return `<link rel="stylesheet" href="/css/globals.css" />\n  ${styleTag}`;
};

function buildPage(templateFile) {
  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  let html = fs.readFileSync(templatePath, 'utf8');

  // 1. Inline all section partials
  html = html.replace(INCLUDE_RE, (match, sectionPath) => {
    const filePath = path.join(ROOT, sectionPath);
    if (!fs.existsSync(filePath)) {
      // Fail loud: missing includes should break the build, not silently produce broken HTML
      throw new Error(`Missing section include: ${sectionPath} (referenced in ${templateFile})`);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return content.trim();
  });

  // 2. Remove the inline loader IIFE
  html = html.replace(LOADER_IIFE_RE, '');

  // 3. Remove <script src="/js/loader.js"></script>
  html = html.replace(LOADER_SCRIPT_RE, '');

  // 4. Inject globals.css before style.css
  if (!STYLE_LINK_RE.test(html)) {
    throw new Error(`Template ${templateFile} is missing /css/style.css link — cannot inject globals.css`);
  }
  html = html.replace(STYLE_LINK_RE, GLOBALS_INJECT);

  // 5. Write to output (preserving subdirectory structure)
  const outPath = path.join(ROOT, templateFile);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`  Built: ${templateFile}`);
}

// Recursively find all .html files in templates/
function findTemplates(dir, prefix) {
  prefix = prefix || '';
  var results = [];
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(function(entry) {
    var rel = prefix ? prefix + '/' + entry.name : entry.name;
    if (entry.isDirectory()) {
      results = results.concat(findTemplates(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.html')) {
      results.push(rel);
    }
  });
  return results;
}

// Run
console.log('Building BDS pages...');
var templates = findTemplates(TEMPLATES_DIR);

if (templates.length === 0) {
  console.error('No templates found in templates/');
  process.exit(1);
}

templates.forEach(buildPage);
console.log(`Done. ${templates.length} pages built.`);
