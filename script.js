/* script.js */
(() => {
  "use strict";

  const C = window.APP_CONFIG;
  const F = window.APP_FALLBACK;

  const state = {
    players: [],
    coaches: [],
    aptitudeRules: {},
    boosters: {},
    selectedPlayer: null,
    allocations: Object.fromEntries(C.groups.map(g => [g.id, 0])),
    coachId: "",
    aptitude: "",
    normalBoosters: ["", ""],
    normalBoosterValues: [null, null],
    additionalBooster: "",
    additionalValue: null,
    edgeBooster: "",
    edgeValue: null,
    liveLink: ""
  };

  const $ = id => document.getElementById(id);
  const statNames = Object.fromEntries(C.stats);
  const allStatKeys = C.stats.map(([k]) => k);

  function deepClone(v){ return JSON.parse(JSON.stringify(v)); }

  function normalizePlayer(p){
    const out = {...p};
    out.height = Number(p.height);
    out.talentPoints = Number(p.talentPoints);
    for(const key of allStatKeys) out[key] = Number(p[key]);
    if(typeof p.ownedBoosters === "string"){
      out.ownedBoosters = p.ownedBoosters.trim() ? p.ownedBoosters.split("|").map(s=>s.trim()).filter(Boolean) : [];
    } else if(!Array.isArray(p.ownedBoosters)) out.ownedBoosters = [];
    if(typeof p.liveLinkTargets === "string"){
      out.liveLinkTargets = p.liveLinkTargets.trim() ? p.liveLinkTargets.split("|").map(s=>s.trim()).filter(Boolean) : [];
    } else if(!Array.isArray(p.liveLinkTargets)) out.liveLinkTargets = [];
    return out;
  }

  function parseCsv(text){
    const rows=[]; let row=[]; let cell=""; let quoted=false;
    for(let i=0;i<text.length;i++){
      const ch=text[i], next=text[i+1];
      if(quoted){
        if(ch === '"' && next === '"'){ cell+='"'; i++; }
        else if(ch === '"') quoted=false;
        else cell+=ch;
      }else{
        if(ch === '"') quoted=true;
        else if(ch === ','){ row.push(cell); cell=""; }
        else if(ch === '\n'){
          row.push(cell); rows.push(row); row=[]; cell="";
        }else if(ch !== '\r') cell+=ch;
      }
    }
    if(cell.length || row.length){ row.push(cell); rows.push(row); }
    if(!rows.length) return [];
    const headers=rows[0].map(h=>h.trim());
    return rows.slice(1).filter(r=>r.some(x=>String(x).trim()!=="")).map(r=>{
      const o={}; headers.forEach((h,i)=>o[h]=(r[i]??"").trim()); return o;
    });
  }

  function validatePlayers(players){
    const required = ["name","cardName","foot","height","weakFootFrequency","weakFootAccuracy","conditionWave","talentPoints","attackType","offensivePlayingStyle","defensivePlayingStyle",...allStatKeys];
    const errors=[];
    players.forEach((p,idx)=>{
      const line=idx+2;
      required.forEach(k=>{ if(p[k] === undefined || String(p[k]).trim()==="") errors.push(`CSV ${line}行目: ${k} が空です。`); });
      for(const k of ["height","talentPoints",...allStatKeys]){
        if(p[k] !== undefined && (p[k] === "" || Number.isNaN(Number(p[k])))) errors.push(`CSV ${line}行目: ${k} は数値で指定してください。`);
      }
      for(const k of allStatKeys){
        if(p[k] !== undefined && !Number.isNaN(Number(p[k])) && (Number(p[k])<40 || Number(p[k])>99)) errors.push(`CSV ${line}行目: ${k} は40～99の範囲で指定してください。`);
      }
      if(Number(p.height) < 0) errors.push(`CSV ${line}行目: height は0以上にしてください。`);
      if(Number(p.talentPoints) < 0) errors.push(`CSV ${line}行目: talentPoints は0以上にしてください。`);
      if(p.liveLinkTargets !== undefined && String(p.liveLinkTargets).trim()){
        String(p.liveLinkTargets).split("|").map(s=>s.trim()).filter(Boolean).forEach(k=>{
          if(!allStatKeys.includes(k)) errors.push(`CSV ${line}行目: liveLinkTargets に未定義の能力キー「${k}」があります。`);
        });
      }
    });
    return errors;
  }

  async function loadExternalData(){
    const results = await Promise.allSettled([
      fetch("players.csv", {cache:"no-store"}).then(r=>{if(!r.ok) throw new Error(r.status); return r.text()}),
      fetch("coaches.json", {cache:"no-store"}).then(r=>{if(!r.ok) throw new Error(r.status); return r.json()}),
      fetch("coachAptitude.json", {cache:"no-store"}).then(r=>{if(!r.ok) throw new Error(r.status); return r.json()}),
      fetch("boosters.json", {cache:"no-store"}).then(r=>{if(!r.ok) throw new Error(r.status); return r.json()})
    ]);
    const ok = results.every(x=>x.status==="fulfilled");
    if(!ok) throw new Error("外部データを読み込めませんでした。");
    const csvRows=parseCsv(results[0].value);
    const errors=validatePlayers(csvRows);
    if(errors.length) throw new Error(errors.join("\n"));
    state.players=csvRows.map(normalizePlayer);
    state.coaches=results[1].value;
    state.aptitudeRules=results[2].value;
    state.boosters=results[3].value;
    $("dataStatus").textContent=`外部データを読み込みました：選手${state.players.length}名 / 監督${state.coaches.length}名 / ブースター${Object.keys(state.boosters).length}種`;
  }

  function loadFallbackData(reason=""){
    state.players=deepClone(F.players).map(normalizePlayer);
    state.coaches=deepClone(F.coaches);
    state.aptitudeRules=deepClone(F.coachAptitude);
    state.boosters=deepClone(F.boosters);
    $("dataStatus").textContent=`ローカル確認用フォールバックデータを使用中（選手${state.players.length}名）。${reason ? "\n"+reason : ""}\n公開時は同フォルダのCSV/JSONが優先されます。`;
  }

  function fillSelect(select, items, placeholder="未選択"){
    select.innerHTML="";
    const opt=document.createElement("option"); opt.value=""; opt.textContent=placeholder; select.appendChild(opt);
    items.forEach(item=>{
      const o=document.createElement("option"); o.value=item.value; o.textContent=item.label; select.appendChild(o);
    });
  }

  function coachLabel(c){
    const entries=Object.entries(c.boosts||{}).map(([k,v])=>`${statNames[k]||k}+${v}`);
    return entries.length ? `${c.name}【${entries.join(", ")}】` : c.name;
  }

  function personalityTag(label, type, value){
    const color=C.personalityColors[type]?.[value] || "";
    const style=color ? ` style="--tag-color:${color}"` : "";
    return `<span class="tag personality-tag"${style}>${escapeHtml(label)} ${escapeHtml(value)}</span>`;
  }

  function renderControls(){
    fillSelect($("coachSelect"), state.coaches.map(c=>({value:c.id,label:coachLabel(c)})));
    $("coachSelect").value=state.coachId;
    fillSelect($("aptitudeSelect"), Object.keys(state.aptitudeRules).sort((a,b)=>Number(b)-Number(a)).map(v=>({value:v,label:v})));
    $("aptitudeSelect").value=state.aptitude;

    const boosterItems=Object.keys(state.boosters).map(name=>({value:name,label:name}));
    fillSelect($("additionalBooster"), boosterItems);
    $("additionalBooster").value=state.additionalBooster;

    document.querySelectorAll(".booster-select").forEach((s,i)=>{
      fillSelect(s,boosterItems);
      s.value=state.normalBoosters[i] || "";
    });
    fillSelect($("edgeBooster"), C.edgeStats.map(k=>({value:k,label:statNames[k]})));
    $("edgeBooster").value=state.edgeBooster;

    document.querySelectorAll("[data-live]").forEach(b=>b.classList.toggle("active", b.dataset.live===state.liveLink));
    document.querySelectorAll("[data-add-value]").forEach(b=>b.classList.toggle("active", Number(b.dataset.addValue)===state.additionalValue));
    document.querySelectorAll("[data-normal-values]").forEach(group=>{
      const slot=Number(group.dataset.normalValues);
      group.querySelectorAll("[data-normal-value]").forEach(b=>b.classList.toggle("active", Number(b.dataset.normalValue)===state.normalBoosterValues[slot]));
    });
    document.querySelectorAll("[data-edge-value]").forEach(b=>b.classList.toggle("active", Number(b.dataset.edgeValue)===state.edgeValue));
  }

  function renderPlayerSummary(){
    const el=$("playerSummary");
    if(!state.selectedPlayer){ el.className="player-summary empty"; el.textContent="選手を選択してください"; return; }
    const p=state.selectedPlayer;
    el.className="player-summary";
    el.innerHTML=`
      <div class="player-name">${escapeHtml(p.name)}${p.cardName && p.cardName!==p.name ? ` <span class="tag">${escapeHtml(p.cardName)}</span>`:""}</div>
      <div class="player-meta">
        <span class="tag">右/左：${escapeHtml(p.foot)}</span><span class="tag">身長 ${p.height}cm</span>
        ${personalityTag("逆足頻度", "weakFootFrequency", p.weakFootFrequency)}
        ${personalityTag("逆足精度", "weakFootAccuracy", p.weakFootAccuracy)}
        ${personalityTag("波", "conditionWave", p.conditionWave)}
        <span class="tag">TP ${p.talentPoints}</span>
        ${p.liveLinkTargets?.length ? `<span class="tag live-target-tag">ライブリンク対象：${p.liveLinkTargets.map(k=>escapeHtml(statNames[k]||k)).join("・")}</span>` : ""}
      </div>`;
  }

  function renderGroups(){
    const grid=$("groupGrid"); grid.innerHTML="";
    C.groups.forEach(g=>{
      const v=state.allocations[g.id]||0;
      const growth=v;
      const cost=calculateTalentCost(v);
      const card=document.createElement("div"); card.className="group-card";
      card.innerHTML=`
        <div class="group-icon"><svg viewBox="0 0 64 64" aria-label="${escapeHtml(g.name)}"><use href="icons.svg#${g.icon}"></use></svg></div>
        <div>
          <div class="group-name">${g.name}</div>
          <div class="group-detail">能力 +${growth} / 消費 ${cost}TP</div>
          <div class="stepper">
            <button type="button" aria-label="${g.name}を1減らす" data-dec="${g.id}">−</button>
            <div class="stepper-value">${v}<small>振り分け</small></div>
            <button type="button" aria-label="${g.name}を1増やす" data-inc="${g.id}">＋</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }

  function renderStats(){
    const grid=$("statsGrid"); grid.innerHTML="";
    if(!state.selectedPlayer){
      grid.innerHTML='<div class="data-status">選手を選択すると最終能力値が表示されます。</div>'; return;
    }
    const stats=calculateFinalStats();
    C.stats.forEach(([key,name])=>{
      const card=document.createElement("div"); card.className="stat-card";
      const value=stats[key];
      const cls=value<=69?"v-low":value<=79?"v-mid":value<=89?"v-high":"v-elite";
      card.innerHTML=`<span class="stat-name">${name}</span><span class="stat-value ${cls}">${value}</span>`;
      grid.appendChild(card);
    });
  }

  function calculateTalentCost(v){
    if(v<=0) return 0;
    let total=0;
    for(let i=1;i<=v;i++) total += C.talent.costPerPoint(i);
    return total;
  }

  function addBoost(map,key,value){ if(key) map[key]=(map[key]||0)+value; }

  // タレント振り分け値と能力上昇値は常に一致させる。
  // 例：4振り→+4、5振り→+5、9振り→+9、13振り→+13。
  // タレントポイントの消費コストは calculateTalentCost() 側で
  // 1～4=1TP、5～8=2TP、9～12=3TP、13～16=4TP…を別途計算する。
  function calculateTalentGrowthValue(allocation){
    const value = Number(allocation) || 0;
    return Math.max(0, value);
  }

  function calculateTalentGrowth(){
    const growth={};
    C.groups.forEach(g=>{
      const amount=calculateTalentGrowthValue(state.allocations[g.id]);
      g.stats.forEach(k=>addBoost(growth,k,amount));
    });
    return growth;
  }

  function calculateCoachAptitudeBonus(values){
    const bonus=Object.fromEntries(allStatKeys.map(k=>[k,0]));
    if(!state.aptitude) return bonus;
    const rules=state.aptitudeRules[String(state.aptitude)]||[];
    allStatKeys.forEach(k=>{
      const value=values[k];
      const rule=rules.find(r=>value>=r.min && (r.max===null || value<=r.max));
      if(rule) bonus[k]=Number(rule.bonus);
    });
    return bonus;
  }

  // 選手側ブースター（通常2枠・追加ブースター・エッジ）の合算。
  function calculateSelectedPlayerBoosterBonus(){
    const bonus=Object.fromEntries(allStatKeys.map(k=>[k,0]));
    state.normalBoosters.forEach((name,i)=>{
      const value=state.normalBoosterValues[i];
      if(!name || !value) return;
      (state.boosters[name]||[]).forEach(k=>addBoost(bonus,k,value));
    });
    if(state.additionalBooster && state.additionalValue){
      (state.boosters[state.additionalBooster]||[]).forEach(k=>addBoost(bonus,k,state.additionalValue));
    }
    if(state.edgeBooster && state.edgeValue) addBoost(bonus,state.edgeBooster,state.edgeValue);
    return bonus;
  }

  function playerBoosterTargetSet(){
    const set=new Set();
    state.normalBoosters.forEach((name,i)=>{
      if(!name || !state.normalBoosterValues[i]) return;
      (state.boosters[name]||[]).forEach(k=>set.add(k));
    });
    if(state.additionalBooster && state.additionalValue){
      (state.boosters[state.additionalBooster]||[]).forEach(k=>set.add(k));
    }
    if(state.edgeBooster && state.edgeValue) set.add(state.edgeBooster);
    if(state.liveLink && state.selectedPlayer){
      (state.selectedPlayer.liveLinkTargets||[]).forEach(k=>set.add(k));
    }
    return set;
  }

  function calculateLiveLinkBonus(){
    const bonus=Object.fromEntries(allStatKeys.map(k=>[k,0]));
    const live={A:3,B:1,C:0}[state.liveLink];
    if(!state.liveLink || !state.selectedPlayer || live === undefined) return bonus;
    (state.selectedPlayer.liveLinkTargets||[]).forEach(k=>addBoost(bonus,k,live));
    return bonus;
  }

  function calculateManagerBoosterBonus(){
    const bonus=Object.fromEntries(allStatKeys.map(k=>[k,0]));
    const coach=state.coaches.find(c=>c.id===state.coachId);
    if(coach) Object.entries(coach.boosts||{}).forEach(([k,v])=>addBoost(bonus,k,Number(v)));
    return bonus;
  }

  function calculateFinalStats(){
    const p=state.selectedPlayer;
    if(!p) return {};

    // 1. 初期能力
    // 2. タレントデザイン
    const talent=calculateTalentGrowth();
    const afterTalent=Object.fromEntries(allStatKeys.map(k=>[k,p[k]+(talent[k]||0)]));

    // 3. 選手側ブースター（通常・追加・エッジ・ライブリンク）
    const playerBoost=calculateSelectedPlayerBoosterBonus();
    const live=calculateLiveLinkBonus();
    const afterPlayerBoosters=Object.fromEntries(allStatKeys.map(k=>[
      k, afterTalent[k]+playerBoost[k]+live[k]
    ]));

    // 4. 選手側ブースター対象かどうかを確定し、ここで99上限を適用。
    const target=playerBoosterTargetSet();
    const afterCap=Object.fromEntries(allStatKeys.map(k=>[
      k, target.has(k) ? afterPlayerBoosters[k] : Math.min(afterPlayerBoosters[k],99)
    ]));

    // 5. 監督適性は上限処理後の値を入力として計算。
    const aptitude=calculateCoachAptitudeBonus(afterCap);
    const afterAptitude=Object.fromEntries(allStatKeys.map(k=>[
      k, afterCap[k]+aptitude[k]
    ]));

    // 6. 監督ブースターを最後に加算。監督ブースター自身は100突破条件を作らない。
    //    したがって最終値も、選手側ブースター対象か否かで99上限を判定する。
    const manager=calculateManagerBoosterBonus();
    return Object.fromEntries(allStatKeys.map(k=>{
      const finalValue=afterAptitude[k]+manager[k];
      return [k, target.has(k) ? finalValue : Math.min(finalValue,99)];
    }));
  }

  function remainingPoints(){
    if(!state.selectedPlayer) return 0;
    const spent=C.groups.reduce((sum,g)=>sum+calculateTalentCost(state.allocations[g.id]||0),0);
    return Number(state.selectedPlayer.talentPoints)-spent;
  }

  function renderAll(){
    renderPlayerSummary(); renderGroups(); renderStats();
    $("remainingPoints").textContent=state.selectedPlayer ? `${remainingPoints()} / ${state.selectedPlayer.talentPoints}` : "0 / 0";
  }

  function selectPlayer(p){
    state.selectedPlayer=p;
    resetBuild(true);
    state.selectedPlayer=p;
    renderControls(); renderAll();
  }

  function resetBuild(keepPlayer=true){
    state.allocations=Object.fromEntries(C.groups.map(g=>[g.id,0]));
    state.coachId=""; state.aptitude=""; state.normalBoosters=["",""]; state.normalBoosterValues=[null,null];
    state.additionalBooster=""; state.additionalValue=null; state.edgeBooster=""; state.edgeValue=null; state.liveLink="";
    if(!keepPlayer) state.selectedPlayer=null;
  }

  function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

  function searchPlayers(q){
    const term=q.trim().toLowerCase();
    const results=term ? state.players.filter(p=>p.name.toLowerCase().includes(term)||String(p.cardName||"").toLowerCase().includes(term)) : [];
    const box=$("searchResults"); box.innerHTML="";
    if(!term || !results.length){box.classList.add("hidden");return;}
    results.slice(0,30).forEach(p=>{
      const b=document.createElement("button"); b.type="button"; b.className="search-result";
      b.innerHTML=`${escapeHtml(p.name)}${p.cardName?`<small>${escapeHtml(p.cardName)}</small>`:""}`;
      b.addEventListener("click",()=>{selectPlayer(p); $("playerSearch").value=p.name; box.classList.add("hidden");});
      box.appendChild(b);
    });
    box.classList.remove("hidden");
  }

  $("playerSearch").addEventListener("input",e=>searchPlayers(e.target.value));
  document.addEventListener("click",e=>{if(!e.target.closest(".search-wrap")) $("searchResults").classList.add("hidden");});

  $("coachSelect").addEventListener("change",e=>{state.coachId=e.target.value;renderAll();});
  $("aptitudeSelect").addEventListener("change",e=>{state.aptitude=e.target.value;renderAll();});
  $("additionalBooster").addEventListener("change",e=>{state.additionalBooster=e.target.value;renderAll();});
  $("edgeBooster").addEventListener("change",e=>{state.edgeBooster=e.target.value;renderAll();});

  document.querySelectorAll(".booster-select").forEach((s,i)=>s.addEventListener("change",e=>{
    state.normalBoosters[i]=e.target.value;
    renderAll();
  }));

  document.querySelectorAll("[data-normal-value]").forEach(b=>b.addEventListener("click",()=>{
    const group=b.closest("[data-normal-values]");
    const slot=Number(group.dataset.normalValues);
    const value=Number(b.dataset.normalValue);
    state.normalBoosterValues[slot]=state.normalBoosterValues[slot]===value?null:value;
    renderControls(); renderAll();
  }));

  document.querySelectorAll("[data-edge-value]").forEach(b=>b.addEventListener("click",()=>{
    const value=Number(b.dataset.edgeValue);
    state.edgeValue=state.edgeValue===value?null:value;
    renderControls(); renderAll();
  }));
  document.querySelectorAll("[data-live]").forEach(b=>b.addEventListener("click",()=>{
    state.liveLink=state.liveLink===b.dataset.live?"":b.dataset.live; renderControls(); renderAll();
  }));
  document.querySelectorAll("[data-add-value]").forEach(b=>b.addEventListener("click",()=>{
    const v=Number(b.dataset.addValue); state.additionalValue=state.additionalValue===v?null:v; renderControls(); renderAll();
  }));

  $("groupGrid").addEventListener("click",e=>{
    const inc=e.target.closest("[data-inc]"), dec=e.target.closest("[data-dec]");
    if(!inc&&!dec)return;
    const id=(inc||dec).dataset[inc?"inc":"dec"];
    const next=(state.allocations[id]||0)+(inc?1:-1);
    if(next<0)return;
    state.allocations[id]=next; renderAll();
  });

  $("resetBtn").addEventListener("click",()=>{resetBuild(true);renderControls();renderAll();});
  $("reloadDataBtn").addEventListener("click",async()=>{
    try{await loadExternalData(); resetBuild(true); renderControls(); renderAll();}
    catch(e){$("dataStatus").textContent=`外部データ再読込エラー：${e.message}`;}
  });

  $("csvInput").addEventListener("change",async e=>{
    const file=e.target.files?.[0]; if(!file)return;
    try{
      const rows=parseCsv(await file.text()); const errors=validatePlayers(rows);
      if(errors.length){$("dataStatus").textContent=`CSVエラー\n${errors.join("\n")}`;return;}
      const imported=rows.map(normalizePlayer);
      state.players=[...state.players,...imported];
      $("dataStatus").textContent=`CSVから${imported.length}名を追加しました。現在の選手カード数：${state.players.length}。`;
      e.target.value="";
    }catch(err){$("dataStatus").textContent=`CSV読み込みエラー：${err.message}`;}
  });

  async function init(){
    try{await loadExternalData();}
    catch(e){loadFallbackData(e.message);}
    renderControls(); renderAll();
  }
  init();
})();
