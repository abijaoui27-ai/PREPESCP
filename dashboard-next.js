const tabsContainer = document.getElementById('tabs')

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
      <h3>Entretien IA</h3>
      <p>Simulation réaliste du jury ESCP.</p>
      <a class="btn" href="${data.button}">
        ${data.buttonText}
      </a>
    </div>
  `
}

function renderEM() {
  const data = window.PREP_DATA.emlyon

  document.getElementById('emlyon').innerHTML = `
    <h2>${data.title}</h2>
    <p class="muted">${data.description}</p>

    <div class="card">
      <h3>Simulation EM Lyon</h3>
      <p>Cartes, créativité et valeurs emlyon.</p>

      <a class="btn blue" href="${data.button}">
        ${data.buttonText}
      </a>
    </div>
  `
}

function renderESSEC() {
  const data = window.PREP_DATA.essec

  document.getElementById('essec').innerHTML = `
    <h2>${data.title}</h2>
    <p class="muted">${data.description}</p>

    <div class="grid">
      ${data.sections.map(section => `
        <div class="stat">
          <h3>${section.name}</h3>
          <p>${section.count} exercices</p>
        </div>
      `).join('')}
    </div>

    <div class="card">
      <h3>Objectif</h3>
      <p>
        Ajouter progressivement :
      </p>

      <ul>
        <li>cours ultra détaillés</li>
        <li>100+ questions par thème</li>
        <li>tests chronométrés</li>
        <li>PDF imprimables</li>
        <li>statistiques de progression</li>
      </ul>
    </div>
  `
}

renderESCP()
renderEM()
renderESSEC()
