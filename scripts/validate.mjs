import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const icons = fs.readFileSync(path.join(root, 'icons.js'), 'utf8');
const shortcutsSource = fs.readFileSync(path.join(root, 'shortcuts.js'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const failures = [];

const requiredHtml = [
  '지금 가장 많이 쓰는 단축키',
  '업무와 일상에서 바로 써먹을 수 있는 단축키만 모았습니다.',
  '알아두면 일이 빨라지는 단축키',
  '저장한 단축키',
  'data-category="all"',
  '#인터넷',
  'id="largeModal"',
  'id="keyboardModal"',
  'href="./styles.css"',
  'src="./icons.js"',
  'src="./shortcuts.js"',
  'src="./app.js"'
];
for (const text of requiredHtml) if (!html.includes(text)) failures.push(`HTML 필수 항목 누락: ${text}`);

const forbidden = ['⚡ 지금 가장 많이 쓰는 단축키', '🚀 알아두면 일이 빨라지는 단축키', '먼저 익힐 단축키 8개', '핵심 8개', 'id="basicPairSection"', 'class="card-category"'];
for (const text of forbidden) if (html.includes(text) || js.includes(text)) failures.push(`삭제 대상 잔존: ${text}`);

const shortcutIds = [...shortcutsSource.matchAll(/\{ id: "([^"]+)", title:/g)].map((m) => m[1]);
if (shortcutIds.length !== 30) failures.push(`단축키 데이터 수 오류: ${shortcutIds.length}개`);
if (new Set(shortcutIds).size !== shortcutIds.length) failures.push('중복 단축키 ID 발견');
for (const [source, filename] of [[icons, 'icons.js'], [shortcutsSource, 'shortcuts.js'], [js, 'app.js']]) {
  try { new vm.Script(source, { filename }); }
  catch (error) { failures.push(`JavaScript 문법 오류 (${filename}): ${error.message}`); }
}

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) failures.push(`중복 HTML id: ${[...new Set(duplicateIds)].join(', ')}`);

for (const [needle, label] of [
  ['baroki-saved-shortcuts', '영구 저장 처리'],
  ['dataset.action = "save"', '카드 저장 버튼'],
  ['event.key === "Escape"', 'ESC 닫기 처리'],
  ['event.target === event.currentTarget', '바깥 영역 클릭 닫기 처리']
]) if (!js.includes(needle)) failures.push(`${label} 누락`);

for (const [needle, label] of [
  ['grid-auto-rows: 1fr', '같은 행 카드 높이 정렬'],
  ['margin-top: auto', '버튼 하단 정렬'],
  ['@media (max-width: 560px)', '모바일 반응형']
]) if (!css.includes(needle)) failures.push(`${label} 규칙 누락`);

if (failures.length) {
  console.error('\n검증 실패');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`정적 검증 통과: 단축키 ${shortcutIds.length}개, HTML id ${ids.length}개, JavaScript 문법 정상`);
