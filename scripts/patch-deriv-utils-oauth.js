const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', '@deriv-com', 'utils', 'dist', 'deriv-utils.js');

if (!fs.existsSync(target)) {
  console.warn('[patch-deriv-utils-oauth] target not found, skipping:', target);
  process.exit(0);
}

let source = fs.readFileSync(target, 'utf8');

if (source.includes('NEXT_PUBLIC_OAUTH_REDIRECT_URL') && source.includes('oauth_state')) {
  console.log('[patch-deriv-utils-oauth] already patched');
  process.exit(0);
}

const legacyReturn = 'return `https://oauth.deriv.com/oauth2/authorize?app_id=${K()}&l=${e}&brand=${a}`;';
const patchedReturn = 'const t=(typeof process!=="undefined"&&process.env&&process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL)||`${window.location.origin}${(typeof process!=="undefined"&&process.env&&process.env.NEXT_PUBLIC_BASE_PATH||"").replace(/\\/$/,"")}/`;let n=B("oauth_state")||Math.random().toString(36).slice(2);try{sessionStorage.setItem("oauth_state",n),localStorage.setItem("oauth_state",n)}catch{}return `https://oauth.deriv.com/oauth2/authorize?app_id=${K()}&redirect_uri=${encodeURIComponent(t)}&state=${encodeURIComponent(n)}&l=${e}&brand=${a}`;';

if (!source.includes(legacyReturn)) {
  throw new Error('[patch-deriv-utils-oauth] expected authorize helper pattern not found');
}

source = source.replace(legacyReturn, patchedReturn);
fs.writeFileSync(target, source);
console.log('[patch-deriv-utils-oauth] patched Deriv utility OAuth authorize helper');
