const KeyDisplay = document.getElementById('chave')
const CopyKeyButton = document.getElementById('copyBtn')
const title = document.getElementById('CardTitle')


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
const urlToken = urlParams.get('token')

const tokenValido = false

GetToken(urlToken);

async function GetToken(token)
{
    if (!token)
    {
        KeyDisplay.innerText = 'Não foi possivel gerar a chave. (token not found)'
        KeyDisplay.style.color = 'rgb(210,43,37)'
        CopyKeyButton.disabled = true
        CopyKeyButton.style.pointerEvents = 'none'
        CopyKeyButton.style.filter = 'brightness(40%)'
        title.style.color = 'rgb(210,43,37)'
        title.style.fontWeight = 'bold'
        sconderLoader();
    }
    else
    {
        const key = await VerifyToken(token)
        if (key !== false)
        {
            KeyDisplay.innerText = key
            KeyDisplay.style.color = 'rgb(0,255,0)'
            title.style.color = 'rgb(0,255,0)'
            CopyKeyButton.style.filter = 'brightness(120%)'
            title.style.fontWeight = 'bold'
            title.innerText = 'Chave Gerada'
            esconderLoader();
        }
        else
        {
            KeyDisplay.innerText = 'Não foi possivel gerar a chave. (invalid token)'
            KeyDisplay.style.color = 'rgb(210,43,37)'
            CopyKeyButton.disabled = true
            CopyKeyButton.style.pointerEvents = 'none'
            CopyKeyButton.style.filter = 'brightness(40%)'
            title.style.color = 'rgb(210,43,37)'
            title.style.fontWeight = 'bold'
            title.innerText = 'Token Invalido'
            sconderLoader();
        }
    }
}

async function VerifyToken(token) {
    
  const URL = 'REMOVED_ENDPOINT_3'
  const anomKey = 'REMOVED_KEY'

  try
  {
    const response = await fetch(URL,
    {
      method: 'POST',
      headers: {'Authorization': `Bearer ${anomKey}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({token})
    })
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Detalhe do Erro no Banco:', errorData);
      esconderLoader();
      return false
    }

    const data = await response.json()
    return data.key
  } catch (error)
  {
    window.alert("Ocorreu um erro no nosso servidor, tente novamente mais tarde")
    esconderLoader();
    console.log(error)
    return false
  }
}

function esconderLoader() {
    const loader = document.getElementById('loader');
    loader.classList.add('loader-hide');
    setTimeout(() => loader.remove(), 600);
}

setTimeout(esconderLoader, 5000);