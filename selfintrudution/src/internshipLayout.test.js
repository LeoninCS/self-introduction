import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('internship cards use normal document flow instead of the sticky stack', async () => {
  const [source, styles] = await Promise.all([
    readFile(new URL('./main.jsx', import.meta.url), 'utf8'),
    readFile(new URL('./styles.css', import.meta.url), 'utf8'),
  ]);

  assert.match(source, /function Internship\(\)[\s\S]*stacked=\{false\}/);
  assert.match(source, /querySelectorAll\('\.get-stack:not\(\.is-flow\)'\)/);
  assert.match(styles, /\.get-stack\.is-flow \.get-card\s*{[\s\S]*position:\s*relative/);
  assert.match(styles, /\.get-stack\.is-flow \.get-card\s*{[\s\S]*top:\s*auto/);
  assert.match(styles, /#internship \.get-stack\.is-flow\s*{[\s\S]*width:\s*min\(920px, 100%\)/);
  assert.match(styles, /#internship \.get-stack\.is-flow \.get-copy\s*{[\s\S]*padding:\s*36px 40px/);
  assert.match(styles, /#internship \.get-card\.minimax-card\s*{[\s\S]*height:\s*560px/);
  assert.match(styles, /#internship \.get-card\.sealos-card\s*{[\s\S]*height:\s*560px/);
});
