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

  ringFill.style.strokeDashoffset = circunferencia * progresso;

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

async function gerarKey() {
  const key = await GetKey(ID);

  if (!key) return

  deleteCookie("sessions_id");
  keyIsGenerate = true

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


async function GetID()
{
  const URL = 'https://btdbraicotnkhfkexwyh.supabase.co/functions/v1/GenerateKey'
  const anomKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0ZGJyYWljb3Rua2hma2V4d3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDY2MjcsImV4cCI6MjA5MzA4MjYyN30.ftV4X0vN3NRHJhsIyI_z4D0rm8sGPxVtwzhOux1jykA'

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
  const anomKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0ZGJyYWljb3Rua2hma2V4d3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDY2MjcsImV4cCI6MjA5MzA4MjYyN30.ftV4X0vN3NRHJhsIyI_z4D0rm8sGPxVtwzhOux1jykA'

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