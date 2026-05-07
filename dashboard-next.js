const tabsContainer = document.getElementById('tabs')

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
  `
}

function renderESSEC() {
  document.getElementById('essec').innerHTML = `
    <h2>ESSEC</h2>
    <p class="muted">Deux espaces distincts : l'entretien oral d'un côté, les tests psychotechniques de l'autre.</p>

    <div class="grid" style="grid-template-columns:1fr 1fr;">
      <a class="stat" href="/essec#oral" style="min-height:180px;display:flex;flex-direction:column;justify-content:center;">
        <h3 style="font-size:1.25rem;">🎙️ Entretien de personnalité</h3>
        <p>Simulation du jury ESSEC, mise en situation et entraînement oral.</p>
      </a>

      <a class="stat" href="/essec#psycho" style="min-height:180px;display:flex;flex-direction:column;justify-content:center;">
        <h3 style="font-size:1.25rem;">🧠 Mon espace tests psychotechniques</h3>
        <p>Cours, exercices, mini-fiches, tests chronométrés et futurs PDF.</p>
      </a>
    </div>

    <div class="card">
      <h3>Dans l’espace psychotechnique</h3>
      <p class="muted">Tu retrouveras ensuite les sous-parties : cours & méthodes, exercices par thème, mini-fiches, test chrono et fiches PDF.</p>
      <a class="btn blue" href="/essec#psycho">Ouvrir les tests psychotechniques</a>
    </div>
  `
}

addAdminLinkIfNeeded()
renderESCP()
renderEM()
renderESSEC()
