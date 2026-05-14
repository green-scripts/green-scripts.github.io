getKey()

async function getKey() {
  const response = await fetch('https://getkey.greenscriptshub.workers.dev/', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}}
  )

  if(!response.ok)
  {
    esconderLoader()
    throw 'error'
  }

  const data = await response.json()
  window.location.href = `https://lootdest.org/s?R7kwAcf8&data=${data.finalUrlEncrypt}`;
}



function esconderLoader() {
    const loader = document.getElementById('loader');
    loader.classList.add('loader-hide');
    setTimeout(() => loader.remove(), 600);
}

setTimeout(esconderLoader, 10000);