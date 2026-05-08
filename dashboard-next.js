const tabsContainer = document.getElementById('tabs')
const studentId = localStorage.getItem('student_id')
let FEEDBACK_STORE = {}

function addAdminLinkIfNeeded() {
  const email = localStorage.getItem('email')
  if (email !== 'abijaoui@icloud.com') return
  const nav = document.querySelector('nav')
  if (!nav || document.getElementById('adminLink')) return
  const logout = document.querySelector('.nav-logout')
  const admin = document.createElement('a')
  admin.id = 'adminLink'
  admin.href = '/admin'
  admin.textContent = '⚙️ Admin'
  admin.style.cssText = 'color:#c9a96e;border:1px solid rgba(201,169,110,.25);padding:7px 16px;text-decoration:none;font-size:.78rem;margin-right:12px;'
  if (logout) logout.parentNode.insertBefore(admin, logout)
  else nav.appendChild(admin)
}

const tabs = [
  { id: 'escp', label: 'ESCP' },
  { id: 'emlyon', label: 'EM Lyon' },
  { id: 'essec', label: 'ESSEC' }
]

tabs.forEach((tab, index) => {
  const btn = document.createElement('button')
  btn.className = 'tab' + (index === 0 ? ' active' : '')
  btn.innerText = tab.label
  btn.onclick = () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'))
    btn.classList.add('active')
    document.getElementById(tab.id).classList.add('active')
  }
  tabsContainer.appendChild(btn)
})

function renderESCP() {
  const data = window.PREP_DATA.escp
  document.getElementById('escp').innerHTML = `
    <h2>${data.title}</h2>
    <p class="muted">${data.description}</p>
    <div class="card">
      <h3>🎙️ Entretien IA</h3>
      <p>Simulation réaliste du jury ESCP avec Jean-Marc Delaunay.</p>
      <a class="btn" href="${data.button}">${data.buttonText}</a>
    </div>
    <div class="card">
      <h3>📋 Questionnaire ESCP</h3>
      <p class="muted">Ce dossier permet au jury IA de personnaliser les questions.</p>
      <button class="btn" style="border:0;cursor:pointer" onclick="toggleQuestionnaire()">Remplir / modifier</button>
      <div id="questionnaireBox" style="display:none;margin-top:22px">
        ${['Centres d’intérêt et activités extrascolaires','Réalisation dont vous êtes fier(e)','Expérience du monde du travail','Expériences de différentes cultures','Une expérience marquante','Autres informations utiles'].map((label,i)=>`
          <div style="margin-bottom:14px">
            <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:1px;color:#c9a96e;margin-bottom:6px">${i+1}. ${label}</div>
            <textarea id="q${i+1}" style="width:100%;min-height:70px;background:#0f0f18;color:#f0ede8;border:1px solid rgba(201,169,110,.13);padding:10px;font-family:Outfit,sans-serif"></textarea>
          </div>
        `).join('')}
        <button class="btn" style="border:0;cursor:pointer" onclick="saveQuestionnaire()">Sauvegarder</button>
        <span id="qSaved" style="display:none;color:#4ade80;margin-left:12px">Sauvegardé ✅</span>
      </div>
    </div>
    <div class="card">
      <h3>📈 Feedbacks ESCP</h3>
      <div id="listESCP"><p class="muted">Chargement de l’historique…</p></div>
    </div>
  `
}

function renderEM() {
  const data = window.PREP_DATA.emlyon
  document.getElementById('emlyon').innerHTML = `
    <h2>${data.title}</h2>
    <p class="muted">${data.description}</p>
    <div class="card">
      <h3>🃏 Simulation EM Lyon</h3>
      <p>Cartes, créativité, projet et valeurs emlyon.</p>
      <a class="btn red" href="${data.button}">${data.buttonText}</a>
    </div>
    <div class="card">
      <h3>📈 Feedbacks EM Lyon</h3>
      <div id="listEMLYON"><p class="muted">Chargement de l’historique…</p></div>
    </div>
  `
}

function renderESSEC() {
  document.getElementById('essec').innerHTML = `
    <h2>ESSEC</h2>
    <p class="muted">Choisis ton espace ESSEC.</p>
    <div class="card">
      <h3>🎙️ Entretien de personnalité</h3>
      <p>Simulation du jury ESSEC, mise en situation et entraînement oral.</p>
      <a class="btn blue" href="/essec">Lancer l'entretien ESSEC</a>
    </div>
    <div class="card">
      <h3>🧠 Tests psychotechniques</h3>
      <p>Cours, exercices, mini-fiches, tests chronométrés et fiches intégrées directement dans la plateforme.</p>
      <a class="btn blue" href="/essec-psycho">Ouvrir mon espace tests</a>
    </div>
    <div class="card">
      <h3>📈 Feedbacks ESSEC</h3>
      <p class="muted">Diagnostic jury + plan de progression personnalisé pour l’oral ESSEC.</p>
      <div id="listESSEC"><p class="muted">Chargement de l’historique…</p></div>
    </div>
  `
}

function toggleQuestionnaire(){
  const box=document.getElementById('questionnaireBox')
  if (!box) return
  box.style.display=box.style.display==='none'?'block':'none'
}

async function loadQuestionnaire(){
  if(!studentId) return
  try{
    const res=await fetch('/api/questionnaire?student_id='+studentId)
    const d=await res.json()
    if(!d) return
    const vals=[d.centres_interet,d.fierte,d.experience_travail,d.experience_cultures,d.experience_marquante,d.autres_infos]
    vals.forEach((v,i)=>{const el=document.getElementById('q'+(i+1)); if(el) el.value=v||''})
  }catch(e){console.error(e)}
}

async function saveQuestionnaire(){
  if(!studentId) return
  const body={
    student_id:studentId,
    centres_interet:q1.value,
    fierte:q2.value,
    experience_travail:q3.value,
    experience_cultures:q4.value,
    experience_marquante:q5.value,
    autres_infos:q6.value
  }
  try{
    await fetch('/api/questionnaire',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    qSaved.style.display='inline'
    setTimeout(()=>qSaved.style.display='none',2500)
  }catch(e){console.error(e)}
}

async function loadFeedbacks(){
  if(!studentId) return
  try{
    const res=await fetch('/api/feedbacks?student_id='+studentId)
    const data=await res.json()
    renderFeedbackList('listESCP', data.filter(f=>!f.ecole || f.ecole==='ESCP'))
    renderFeedbackList('listEMLYON', data.filter(f=>f.ecole==='EM Lyon'))
    renderFeedbackList('listESSEC', data.filter(f=>f.ecole==='ESSEC'))
  }catch(e){
    const a=document.getElementById('listESCP'), b=document.getElementById('listEMLYON'), c=document.getElementById('listESSEC')
    if(a) a.innerHTML='<p class="muted">Impossible de charger l’historique.</p>'
    if(b) b.innerHTML='<p class="muted">Impossible de charger l’historique.</p>'
    if(c) c.innerHTML='<p class="muted">Impossible de charger l’historique.</p>'
  }
}

function esc(value){
  if(value === null || value === undefined || value === '') return ''
  return String(value)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;')
}

function field(label, value){
  if(value === null || value === undefined || value === '') return ''
  return `
    <div style="margin-top:14px;border-top:1px solid rgba(201,169,110,.08);padding-top:12px">
      <div style="font-size:.68rem;text-transform:uppercase;letter-spacing:1.3px;color:#c9a96e;margin-bottom:5px">${label}</div>
      <div style="font-size:.84rem;color:#d9d4cc;line-height:1.65;white-space:pre-wrap">${esc(value)}</div>
    </div>
  `
}

function buildESSECFeedbackDetails(fb){
  return `
    ${field('Diagnostic global du jury', fb.diagnostic_global)}
    ${field('Présentation initiale', fb.presentation_initiale)}
    ${field('Expression et clarté', fb.expression_clarte || fb.qualite_expression)}
    ${field('Curiosité et ouverture', fb.curiosite_ouverture)}
    ${field('Lucidité personnelle', fb.lucidite_personnelle)}
    ${field('Leadership et engagement', fb.leadership_engagement)}
    ${field('Mise en situation', fb.mise_en_situation)}
    ${field('Réflexe éthique', fb.reflexe_ethique)}
    ${field('Esprit collectif', fb.esprit_collectif)}
    ${field('Décision dans le flou', fb.decision_dans_le_flou)}
    ${field('Sens de l’exécution', fb.sens_de_l_execution)}
    ${field('Imagination pragmatique', fb.imagination_pragmatique)}
    ${field('Connaissance de l’ESSEC', fb.connaissance_ecole)}
    ${field('Adéquation avec l’ESSEC', fb.adequation_essec)}
    ${field('Question finale', fb.question_finale)}
    ${field('Points forts', fb.points_forts)}
    ${field('Points faibles', fb.points_faibles)}
    ${field('Axes d’amélioration', fb.axes_amelioration)}
    ${field('Plan de progression personnalisé', fb.plan_de_progression)}
    ${field('Arguments ESSEC à ajouter', fb.arguments_essec_a_ajouter)}
    ${field('Formulations à retravailler', fb.formulations_a_retravailler)}
    ${field('Ressources ESSEC recommandées', fb.ressources_essec_recommandees)}
    ${field('Comparaison avec le précédent', fb.comparaison_precedent)}
  `
}

function buildFeedbackDetails(fb){
  if (fb.ecole === 'ESSEC') return buildESSECFeedbackDetails(fb)
  return `
    ${field('Verdict du jury', fb.verdict_jury)}
    ${field('Présentation initiale', fb.presentation_initiale)}
    ${field('Qualité d’expression', fb.qualite_expression)}
    ${field('Connaissance de l’école', fb.connaissance_ecole)}
    ${field('Dynamique de l’échange', fb.dynamique_echange)}
    ${field('Triangle liens', fb.triangle_liens)}
    ${field('Fond ESCP', fb.fond_escp)}
    ${field('Exploitation du questionnaire', fb.exploitation_questionnaire)}
    ${field('Analyse personnalisée', fb.analyse_personnalisee)}
    ${field('Question finale', fb.question_finale)}
    ${field('Comparaison avec le précédent', fb.comparaison_precedent)}
    ${field('Points forts', fb.points_forts)}
    ${field('Points faibles', fb.points_faibles)}
    ${field('Axes d’amélioration', fb.axes_amelioration)}
    ${field('Carte personnalité', fb.carte_personnalite)}
    ${field('Carte expériences', fb.carte_experiences)}
    ${field('Carte projets', fb.carte_projets)}
    ${field('Carte créativité', fb.carte_creativite)}
    ${field('Valeurs EM Lyon', fb.valeurs_emlyon)}
    ${field('Échange final', fb.echange_final)}
  `
}

function toggleFeedbackDetail(key){
  const el=document.getElementById('feedback-detail-'+key)
  const btn=document.getElementById('feedback-btn-'+key)
  if(!el) return
  const open=el.style.display==='block'
  el.style.display=open?'none':'block'
  if(btn) btn.textContent=open?'Voir le debrief complet':'Masquer le debrief'
}

function renderFeedbackList(id,items){
  const box=document.getElementById(id)
  if(!box) return
  if(!items.length){box.innerHTML='<p class="muted">Aucun feedback pour le moment.</p>';return}
  FEEDBACK_STORE[id]=items
  box.innerHTML=items.map((fb,i)=>{
    const key=id+'-'+i
    const date=fb.created_at ? new Date(fb.created_at).toLocaleDateString('fr-FR') : ''
    const summary=fb.verdict_jury || fb.diagnostic_global || fb.analyse_personnalisee || fb.points_forts || 'Feedback disponible.'
    return `
      <div style="border:1px solid rgba(201,169,110,.13);padding:16px;margin-top:12px;background:#0f0f18">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">
          <div>
            <strong>Entretien #${items.length-i}</strong> ${date ? `<span class="muted">— ${date}</span>` : ''}
            <div style="color:#c9a96e;margin-top:4px;font-weight:700">${esc(fb.note || '—')}/20</div>
          </div>
          <button id="feedback-btn-${key}" onclick="toggleFeedbackDetail('${key}')" style="border:1px solid rgba(201,169,110,.18);background:#16161f;color:#c9a96e;padding:8px 12px;cursor:pointer;font-family:Outfit,sans-serif;font-size:.78rem">Voir le debrief complet</button>
        </div>
        <p class="muted" style="margin-top:10px">${esc(summary)}</p>
        <div id="feedback-detail-${key}" style="display:none;margin-top:14px;background:#07070c;border:1px solid rgba(201,169,110,.08);padding:16px">
          ${buildFeedbackDetails(fb) || '<p class="muted">Aucun détail supplémentaire disponible.</p>'}
        </div>
      </div>
    `
  }).join('')
}

addAdminLinkIfNeeded()
renderESCP()
renderEM()
renderESSEC()
loadQuestionnaire()
loadFeedbacks()
