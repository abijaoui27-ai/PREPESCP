const tabsContainer = document.getElementById('tabs')
const studentId = localStorage.getItem('student_id')

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
      <a class="btn blue" href="/essec#oral">Lancer l'entretien ESSEC</a>
    </div>
    <div class="card">
      <h3>🧠 Tests psychotechniques</h3>
      <p>Cours, exercices, mini-fiches, tests chronométrés et fiches PDF.</p>
      <a class="btn blue" href="/essec#psycho">Ouvrir mon espace tests</a>
    </div>
  `
}

function toggleQuestionnaire(){
  const box=document.getElementById('questionnaireBox')
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
  const body={student_id:studentId,centres_interet:q1.value,fierte:q2.value,experience_travail:q3.value,experience_cultures:q4.value,experience_marquante:q5.value,autres_infos:q6.value}
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
  }catch(e){
    const a=document.getElementById('listESCP'), b=document.getElementById('listEMLYON')
    if(a) a.innerHTML='<p class="muted">Impossible de charger l’historique.</p>'
    if(b) b.innerHTML='<p class="muted">Impossible de charger l’historique.</p>'
  }
}

function renderFeedbackList(id,items){
  const box=document.getElementById(id)
  if(!box) return
  if(!items.length){box.innerHTML='<p class="muted">Aucun feedback pour le moment.</p>';return}
  box.innerHTML=items.map((fb,i)=>`
    <div style="border:1px solid rgba(201,169,110,.13);padding:14px;margin-top:10px;background:#0f0f18">
      <strong>Entretien #${items.length-i}</strong> — <span style="color:#c9a96e">${fb.note || '—'}/20</span>
      <p class="muted" style="margin-top:6px">${fb.verdict_jury || fb.analyse_personnalisee || 'Feedback disponible.'}</p>
    </div>
  `).join('')
}

addAdminLinkIfNeeded()
renderESCP()
renderEM()
renderESSEC()
loadQuestionnaire()
loadFeedbacks()
