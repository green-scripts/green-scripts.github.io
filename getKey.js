const TEMPO = 15;
const circunferencia = 2 * Math.PI * 34;

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
let keyIsGenerate = false

//Faz a requisição get para obter o getElementById

let ID = getCookie('sessions_id')

if (!ID) {
  (async () => {
    ID = await GetID()
    if (ID) {
      setCookie('sessions_id', ID, 10)

      setInterval(() => {
        if (!getCookie('sessions_id') && !keyIsGenerate) location.reload()
      }, 5000)
    }
  })()
}



const intervalo = setInterval(() => {
  restante--;

  const progresso = (TEMPO - restante) / TEMPO;

  ringFill.style.strokeDashoffset = (circunferencia * progresso);

  timerNumber.textContent = restante;
  timerSeg.textContent    = restante;

  progressBar.style.width = (progresso * 100) + '%';

  if (progresso < 0.4) {
    progressLabel.textContent = 'Verificando acesso...';
  } else if (progresso < 0.75) {
    progressLabel.textContent = 'Validando sessão...';
  } else {
    progressLabel.textContent = 'Quase lá...';
  }

  if (restante <= 0) {
    clearInterval(intervalo);
    setTimeout(() => {
      liberarBotao();
    }, 1000);
    
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

async function gerarKey() {
  setBtnLoading(true);

  const key = await GetKey(ID);

  setBtnLoading(false);

  if (!key) {
    showToast('Erro ao gerar a chave. Tente novamente.', 'error');
    return;
  }

  deleteCookie("sessions_id");
  keyIsGenerate = true;

  document.getElementById('keyValue').textContent = key;
  keyResult.classList.add('visivel');
  btnGerar.disabled = true;
  btnGerar.style.opacity = '0.3';

  showToast('Chave gerada com sucesso!', 'success');
}

function showToast(message, type = 'success') {
  const existing = document.getElementById('gs-toast');
  if (existing) existing.remove();

  const colors = {
    success: { border: 'rgba(34,255,102,0.4)',  bg: 'rgba(34,255,102,0.07)',  text: '#22ff66' },
    error:   { border: 'rgba(255,80,80,0.4)',   bg: 'rgba(255,80,80,0.07)',   text: 'rgba(255,100,100,0.95)' },
  };
  const c = colors[type];

  const icons = {
    success: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="${c.text}" stroke-width="1.5"/><polyline points="5,8.5 7,10.5 11,6" stroke="${c.text}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    error:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="${c.text}" stroke-width="1.5"/><line x1="8" y1="4.5" x2="8" y2="8.5" stroke="${c.text}" stroke-width="1.8" stroke-linecap="round"/><circle cx="8" cy="11" r="1" fill="${c.text}"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.id = 'gs-toast';
  toast.style.cssText = `
    all: unset;
    display: flex;
    align-items: center;
    gap: 10px;
    position: fixed;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 20px;
    background: ${c.bg};
    border: 1px solid ${c.border};
    border-radius: 12px;
    color: ${c.text};
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: bold;
    white-space: nowrap;
    z-index: 9999;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    transition: top 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease;
    opacity: 0;
  `;

  toast.innerHTML = icons[type] + `<span>${message}</span>`;
  document.body.appendChild(toast);

  // Desce
  requestAnimationFrame(() => {
    toast.style.top = '24px';
    toast.style.opacity = '1';
  });

  // Some após 3.5s
  setTimeout(() => {
    toast.style.top = '-80px';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function setBtnLoading(loading) {
  if (loading) {
    btnGerar.disabled = true;
    btnGerar.style.cursor = 'not-allowed';
    btnGerar.innerHTML = `
      <span class="btn-label">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          style="animation: spinBtn 0.8s linear infinite; flex-shrink:0;">
          <circle cx="8" cy="8" r="6" stroke="rgba(34,255,102,0.2)" stroke-width="2.5"/>
          <path d="M8 2 A6 6 0 0 1 14 8" stroke="#22ff66" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        Gerando...
      </span>`;
  } else {
    btnGerar.disabled = false;
    btnGerar.style.cursor = 'pointer';
    btnGerar.innerHTML = `
      <span class="btn-label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Gerar Key
      </span>`;
  }
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


async function GetID()
{
  const URL = 'https://btdbraicotnkhfkexwyh.supabase.co/functions/v1/GenerateKey'
  const anomKey = 'REMOVED_KEY'

  try
  {
    const response = await fetch(URL,
    {
      method: 'GET',
      headers: {'Authorization': `Bearer ${anomKey}`, 'Content-Type': 'application/json'}
    })
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Detalhe do Erro no Banco:', errorData);
      throw new Error(`Status: ${response.status} - ${errorData.error}`);
    }

    const data = await response.json()
    return data.id
  } catch (error)
  {
    window.alert("Ocorreu um erro no nosso servidor, tente novamente mais tarde")
    return null
  }
}


async function GetKey(id)
{
  const URL = 'https://btdbraicotnkhfkexwyh.supabase.co/functions/v1/GenerateKey'
  const anomKey = 'REMOVED_KEY'

  try
  {
    const response = await fetch(URL,
    {
      method: 'POST',
      headers: {'Authorization': `Bearer ${anomKey}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({id})
    })
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Detalhe do Erro no Banco:', errorData);
      throw new Error(`Status: ${response.status} - ${errorData.error}`);
    }

    const data = await response.json()
    return data.key
  } catch (error)
  {
    window.alert("Ocorreu um erro no nosso servidor, tente novamente mais tarde")
    console.log(error)
    return null
  }
}


//COOKIES

function getCookie(name) {
  return document.cookie.split('; ').find(r => r.startsWith(name + '='))?.split('=')[1] ?? null
}

function setCookie(name,value,minutes)
{
  const expires = new Date(Date.now() + minutes * 60000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict`
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}