import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DEFAULT_BUNDLE = path.join(ROOT, "knowledge");
const args = process.argv.slice(2);
const has = (name) => args.includes(name);
const value = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+?)["']?\\s*$`, "m"));
  return match ? match[1].trim() : "";
}
function list(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*\\n((?:[ \\t]+-\\s*[^\\n]+\\n?)*)`, "m"));
  return match ? [...match[1].matchAll(/^[ \\t]+-\\s*["']?([^"'\\n]+?)["']?\\s*$/gm)].map((m) => m[1].trim()) : [];
}
function parse(file, bundle) {
  const text = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
  const boundary = text.indexOf("\n---\n", 4);
  if (!text.startsWith("---\n") || boundary < 0) return null;
  const frontmatter = text.slice(4, boundary);
  const relative = path.relative(bundle, file).split(path.sep).join("/");
  return {
    id: relative,
    path: relative,
    type: scalar(frontmatter, "type"),
    title: scalar(frontmatter, "title") || relative,
    description: scalar(frontmatter, "description"),
    status: scalar(frontmatter, "status") || "stable",
    authority: scalar(frontmatter, "authority"),
    knowledge_role: scalar(frontmatter, "knowledge_role"),
    tags: list(frontmatter, "tags"),
    body: text.slice(boundary + 5),
  };
}
function build(bundle) {
  const files = walk(bundle).filter((file) => path.extname(file) === ".md" && !["index.md", "log.md"].includes(path.basename(file)));
  const nodes = files.map((file) => parse(file, bundle)).filter(Boolean);
  const known = new Set(nodes.map((node) => node.id));
  const edges = [];
  for (const file of files) {
    const record = parse(file, bundle);
    if (!record) continue;
    for (const match of record.body.matchAll(/\[[^\]\n]+\]\(([^)\n]+\.md)(?:#[^)]*)?\)/g)) {
      const raw = decodeURI(match[1].split("#")[0]);
      const target = raw.startsWith("/") ? raw.slice(1) : path.posix.normalize(path.posix.join(record.id.replace(/\/[^/]+$/, ""), raw));
      if (known.has(target)) edges.push({ source: record.id, target });
    }
  }
  const palette = {};
  const colors = ["#1a73e8", "#9334e6", "#188038", "#e37400", "#c5221f", "#00838f", "#5f6368"];
  [...new Set(nodes.map((node) => node.type))].sort().forEach((type, index) => {
    palette[type] = colors[index % colors.length];
  });
  const backlinks = Object.fromEntries(nodes.map((node) => [node.id, edges.filter((edge) => edge.target === node.id).map((edge) => edge.source)]));
  return { nodes, edges, backlinks, palette };
}
function html(payload, name) {
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  const title = JSON.stringify(name).replace(/</g, "\\u003c");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RIM OKF Visualize</title><style>body{font:14px system-ui,sans-serif;margin:0;color:#202124;background:#f8f9fa}header{padding:14px 18px;background:#1a73e8;color:white}header h1{margin:0 0 10px;font-size:20px}header input,header select{padding:8px;margin-right:6px;max-width:100%;border:0;border-radius:4px}main{display:grid;grid-template-columns:minmax(240px,30%) 1fr;min-height:calc(100vh - 94px)}aside,section{padding:14px;overflow:auto}aside{background:white;border-right:1px solid #dadce0}h2,h3{margin:0 0 8px}#count{color:#5f6368;margin:0 0 8px}.summary{padding:12px;background:#fff;border:1px solid #dadce0;border-radius:6px;margin-bottom:12px}.summary p{margin:4px 0}.type-counts{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 12px;margin:8px 0 0}.type-counts dt{overflow-wrap:anywhere}.type-counts dd{margin:0;text-align:right;color:#5f6368}.node-list{max-height:calc(100vh - 280px);overflow:auto}button{display:block;border:0;background:white;text-align:left;padding:7px;width:100%;cursor:pointer;border-bottom:1px solid #eee}button:hover{background:#e8f0fe}.muted,.edge{color:#5f6368;font-size:12px}.graph-status{padding:14px;background:white;border:1px solid #dadce0;border-radius:6px;color:#5f6368}.graph-wrap{display:none}.graph-wrap.active{display:block}#graph{display:block;width:100%;height:640px;background:white;border:1px solid #dadce0;border-radius:6px;cursor:pointer}#detail{margin-top:12px;padding:14px;background:white;border:1px solid #dadce0;border-radius:6px}#detail h2{margin-top:0}pre{white-space:pre-wrap;overflow-wrap:anywhere}@media(max-width:760px){main{display:block}aside{border-right:0;border-bottom:1px solid #dadce0}.node-list{max-height:35vh}section{padding-top:10px}header input,header select{margin-bottom:6px;width:100%;box-sizing:border-box}}</style></head><body><header><h1 id="heading"></h1><input id="q" placeholder="検索（タイトル・説明・タグ）"><select id="type"><option value="">すべてのタイプ</option></select></header><main><aside><div class="summary"><h2>全体概要</h2><p id="total"></p><dl id="type-counts" class="type-counts"></dl></div><p id="count"></p><div id="list" class="node-list"></div></aside><section><div id="graph-status" class="graph-status"></div><div id="graph-wrap" class="graph-wrap"><canvas id="graph" aria-label="絞り込み対象の関係グラフ"></canvas></div><div id="detail"><p class="muted">一覧またはグラフのノードを選択してください。</p></div></section></main><script>const data=${json},name=${title};const q=document.querySelector('#q'),type=document.querySelector('#type'),listEl=document.querySelector('#list'),countEl=document.querySelector('#count'),detail=document.querySelector('#detail'),canvas=document.querySelector('#graph'),ctx=canvas.getContext('2d'),graphWrap=document.querySelector('#graph-wrap'),graphStatus=document.querySelector('#graph-status');document.querySelector('#heading').textContent=name;document.querySelector('#total').textContent='全 '+data.nodes.length.toLocaleString('ja-JP')+' 概念';const byId=new Map(data.nodes.map(n=>[n.id,n]));const typeCounts=new Map();data.nodes.forEach(n=>typeCounts.set(n.type,(typeCounts.get(n.type)||0)+1));[...typeCounts.keys()].sort().forEach(t=>{const option=document.createElement('option');option.value=t;option.textContent=t+' ('+typeCounts.get(t)+')';type.appendChild(option);const label=document.createElement('dt');label.textContent=t;const count=document.createElement('dd');count.textContent=typeCounts.get(t).toLocaleString('ja-JP');document.querySelector('#type-counts').append(label,count);});function visible(){const query=q.value.trim().toLocaleLowerCase(),filter=type.value;return data.nodes.filter(n=>(!filter||n.type===filter)&&[n.title,n.description,n.type,...(n.tags||[])].join(' ').toLocaleLowerCase().includes(query));}function addText(parent,tag,text,className){const el=document.createElement(tag);if(className)el.className=className;el.textContent=text;parent.appendChild(el);return el;}function show(n){window.selectedId=n.id;detail.replaceChildren();addText(detail,'h2',n.title);addText(detail,'p',n.description||'');addText(detail,'p',[(n.type||'Unknown'),(n.status||'stable'),n.authority||'',n.knowledge_role||''].filter(Boolean).join(' / '),'muted');addText(detail,'p','Tags: '+(n.tags||[]).join(', '));const outgoing=data.edges.filter(e=>e.source===n.id).map(e=>byId.get(e.target)?.title||e.target),incoming=(data.backlinks[n.id]||[]).map(id=>byId.get(id)?.title||id);addText(detail,'h3','Graph');addText(detail,'p','Links: '+(outgoing.join(', ')||'なし'),'edge');addText(detail,'p','Backlinks: '+(incoming.join(', ')||'なし'),'edge');const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Node payload';details.appendChild(summary);const pre=document.createElement('pre');pre.textContent=JSON.stringify(n,null,2);details.appendChild(pre);detail.appendChild(details);draw();}function draw(){const nodes=visible(),active=Boolean(q.value.trim()||type.value),maxNodes=140;graphWrap.classList.toggle('active',active&&nodes.length>0&&nodes.length<=maxNodes);if(!active){graphStatus.textContent='検索またはタイプを選択すると、対象概念の関係グラフを表示します。';return;}if(!nodes.length){graphStatus.textContent='該当する概念がありません。検索条件を変更してください。';return;}if(nodes.length>maxNodes){graphStatus.textContent=nodes.length.toLocaleString('ja-JP')+' 概念が該当しています。さらに検索で絞り込むと、最大 '+maxNodes+' ノードの関係グラフを表示できます。';return;}graphStatus.textContent=nodes.length+' ノードの関係グラフ';const w=Math.max(canvas.clientWidth,320),h=640,dpr=window.devicePixelRatio||1;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);const columns=Math.max(1,Math.ceil(Math.sqrt(nodes.length))),rows=Math.ceil(nodes.length/columns),xStep=w/columns,yStep=h/rows,positions=new Map(nodes.map((n,i)=>[n.id,{x:(i%columns+.5)*xStep,y:(Math.floor(i/columns)+.5)*yStep}])),visibleIds=new Set(nodes.map(n=>n.id));ctx.clearRect(0,0,w,h);ctx.strokeStyle='rgba(95,99,104,.22)';ctx.lineWidth=1;data.edges.forEach(e=>{if(!visibleIds.has(e.source)||!visibleIds.has(e.target))return;const a=positions.get(e.source),b=positions.get(e.target);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();});nodes.forEach(n=>{const p=positions.get(n.id);ctx.fillStyle=(data.palette&&data.palette[n.type])||'#94a3b8';ctx.beginPath();ctx.arc(p.x,p.y,Math.max(5,Math.min(9,220/Math.sqrt(nodes.length))),0,Math.PI*2);ctx.fill();if(n.id===window.selectedId){ctx.strokeStyle='#d93025';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.stroke();}});canvas.onclick=event=>{const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*canvas.clientWidth/rect.width,y=(event.clientY-rect.top)*640/rect.height;let closest=null,best=Infinity;positions.forEach((p,id)=>{const d=Math.hypot(p.x-x,p.y-y);if(d<best){best=d;closest=byId.get(id);}});if(closest&&best<18)show(closest);};}function render(){const nodes=visible();countEl.textContent='現在の対象: '+nodes.length.toLocaleString('ja-JP')+' / 全 '+data.nodes.length.toLocaleString('ja-JP')+' 概念';listEl.replaceChildren();nodes.slice().sort((a,b)=>a.title.localeCompare(b.title,'ja')).forEach(n=>{const b=document.createElement('button');b.textContent=n.title;b.title=n.id;b.onclick=()=>show(n);listEl.appendChild(b);});draw();}q.oninput=render;type.onchange=render;window.addEventListener('resize',draw);render();</script></body></html>`;
}
const allowed = new Set(["--bundle", "--out", "--name", "--self-test"]);
if (args.some((arg) => arg.startsWith("--") && !allowed.has(arg)) || (has("--self-test") && args.length !== 1)) {
  console.error("使用法: node knowledge/tools/visualize-okf.mjs [--bundle DIR] [--out FILE] [--name TITLE] [--self-test]");
  process.exit(2);
}
const bundle = path.resolve(value("--bundle", DEFAULT_BUNDLE));
if (!fs.existsSync(bundle)) { console.error(`bundleがありません: ${bundle}`); process.exit(1); }
const payload = build(bundle);
if (has("--self-test")) {
  if (!payload.nodes.length || !payload.edges.length || !payload.nodes.some((node) => node.description && node.title)) throw new Error("nodes/edges/detail payloadが不足しています");
  console.log(`Visualize self-testに合格しました: nodes=${payload.nodes.length}, edges=${payload.edges.length}, detailPayload=ok`);
  process.exit(0);
}
const out = path.resolve(value("--out", path.join(bundle, "navigation/okf-viz.html")));
fs.mkdirSync(path.dirname(out), { recursive: true });
const markup = html(payload, value("--name", "RIM OKF Visualize")).replace("Math.max(canvas.clientWidth,320)", "Math.max(canvas.clientWidth,1)");
fs.writeFileSync(out, markup, "utf8");
console.log(`Visualizeを生成しました: ${out} (nodes=${payload.nodes.length}, edges=${payload.edges.length})`);
