const TEMPO = 15;
const circunferencia = 2 * Math.PI * 34; // raio 34

const ringFill    = document.getElementById('ringFill');
const timerNumber = document.getElementById('timerNumber');
const timerSeg    = document.getElementById('timerSeg');
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const btnGerar    = document.getElementById('btnGerar');
const keyResult   = document.getElementById('keyResult');

ringFill.style.strokeDasharray  = circunferencia;
ringFill.style.strokeDashoffset = 0;

let restante = TEMPO;

const intervalo = setInterval(() => {
  restante--;

  const progresso = (TEMPO - restante) / TEMPO;

  // Anel SVG
  ringFill.style.strokeDashoffset = circunferencia * progresso;

  // Número
  timerNumber.textContent = restante;
  timerSeg.textContent    = restante;

  // Barra
  progressBar.style.width = (progresso * 100) + '%';

  // Labels de status
  if (progresso < 0.4) {
    progressLabel.textContent = 'Verificando acesso...';
  } else if (progresso < 0.75) {
    progressLabel.textContent = 'Validando sessão...';
  } else {
    progressLabel.textContent = 'Quase lá...';
  }

  if (restante <= 0) {
    clearInterval(intervalo);
    liberarBotao();
  }
}, 1000);

function liberarBotao() {
  timerNumber.textContent = '✓';
  timerNumber.style.fontSize = '1rem';
  progressBar.style.width = '100%';
  progressLabel.textContent = 'Pronto! Clique para gerar.';
  btnGerar.disabled = false;
  btnGerar.addEventListener('click', gerarKey);
}

function gerarKey() {
  const key = '12345';
  document.getElementById('keyValue').textContent = key;
  keyResult.classList.add('visivel');
  btnGerar.disabled = true;
  btnGerar.style.opacity = '0.3';
}

function copiarKey() {
  const key = document.getElementById('keyValue').textContent;
  navigator.clipboard.writeText(key).then(() => {
    const btn = document.getElementById('btnCopiar');
    btn.textContent = '✓ Copiado!';
    btn.classList.add('copiado');
    setTimeout(() => {
      btn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.8"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="1.8"/>
        </svg>
        Copiar`;
      btn.classList.remove('copiado');
    }, 2000);
  });
}