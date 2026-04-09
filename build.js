#!/usr/bin/env node

// Build script — inlines section partials into page templates
// Replaces client-side fetch() assembly with pre-rendered HTML

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const SECTIONS_DIR = path.join(ROOT, 'sections');

// Regex to match <div data-include="/sections/xyz.html"></div>
const INCLUDE_RE = /<div\s+data-include="(\/sections\/[^"]+)"\s*><\/div>/g;

// Regex to match the inline loader IIFE script block
const LOADER_IIFE_RE = /\s*<script>\s*\(function\(\)\s*\{[\s\S]*?sections-loaded[\s\S]*?\}\)\(\);\s*<\/script>/;

// Regex to match <script src="/js/loader.js"></script>
const LOADER_SCRIPT_RE = /\s*<script\s+src="\/js\/loader\.js"\s*><\/script>/;

// Inject globals.css before style.css
const STYLE_LINK = '<link rel="stylesheet" href="/css/style.css" />';
const GLOBALS_INJECT = '<link rel="stylesheet" href="/css/globals.css" />\n  <link rel="stylesheet" href="/css/style.css" />';

function buildPage(templateFile) {
  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  let html = fs.readFileSync(templatePath, 'utf8');

  // 1. Inline all section partials
  html = html.replace(INCLUDE_RE, (match, sectionPath) => {
    const filePath = path.join(ROOT, sectionPath);
    if (!fs.existsSync(filePath)) {
      console.warn(`  Warning: ${sectionPath} not found, skipping`);
      return `<!-- missing: ${sectionPath} -->`;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return content.trim();
  });

  // 2. Remove the inline loader IIFE
  html = html.replace(LOADER_IIFE_RE, '');

  // 3. Remove <script src="/js/loader.js"></script>
  html = html.replace(LOADER_SCRIPT_RE, '');

  // 4. Inject globals.css before style.css
  html = html.replace(STYLE_LINK, GLOBALS_INJECT);

  // 5. Write to root
  const outPath = path.join(ROOT, templateFile);
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`  Built: ${templateFile}`);
}

// Run
console.log('Building BDS pages...');
const templates = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.html'));

if (templates.length === 0) {
  console.error('No templates found in templates/');
  process.exit(1);
}

templates.forEach(buildPage);
console.log(`Done. ${templates.length} pages built.`);
