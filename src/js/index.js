const apiURL = 'https://api.exchangeratesapi.io';
const $table = document.querySelector('.exchanges');
const $button = document.querySelector('#submitBase');

function fetchCoins(base = 'EUR', date = 'latest') {
  return fetch(`${apiURL}/${date}?base=${base}`)
    .then((response) => response.json())
    .then((response) => response.rates);
}

function getCoins() {
  return fetchCoins().then((rates) => Object.keys(rates).concat('EUR'));
}

function showCoins(coins) {
  const $baseList = document.querySelector('#baseList');
  coins.forEach((coin) => {
    const $option = document.createElement('option');
    $option.textContent = `${coin}`;
    $option.dataset.base = `${coin}`;
    $baseList.appendChild($option);
  });
  document.querySelector('option[data-base=EUR]').setAttribute('selected', 1);
}

function dateConfig() {
  const $date = document.querySelector('#datePick');
  const today = (new Date()).toISOString().split('T')[0];
  $date.setAttribute('max', today);
  $date.setAttribute('min', '2000-01-01');
  $date.setAttribute('value', today);
}

function loading() {
  document.querySelector('tbody').innerHTML = 'Loading...';
}

function loadExchanges() {
  loading();
  fetchCoins(getBase(), getDate()).then((rates) => {
    document.querySelector('tbody').innerHTML = '';
    Object.keys(rates).sort().forEach((base) => {
      const $row = document.createElement('tr');
      const $base = document.createElement('td');
      const $exchange = document.createElement('td');

      $base.textContent = base;
      $exchange.textContent = rates[base];
      $row.appendChild($base);
      $row.appendChild($exchange);
      $table.appendChild($row);
    });
  });
}

function getBase() {
  const $base = document.querySelector('#baseList').value;
  if ($base !== '') {
    return $base;
  }

  return undefined;
}
function getDate() {
  const $date = document.querySelector('#datePick').value;
  if ($date !== '') {
    return $date;
  }

  return undefined;
}

function start() {
  getCoins().then((coins) => {
    showCoins(coins.sort());
  });
  dateConfig();

  $button.addEventListener('click', loadExchanges);
}
start();
