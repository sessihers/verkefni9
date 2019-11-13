const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  const displayBox = document.querySelector('.results');

  function el(type, className) {
    const element = document.createElement(type);
    element.classList.add(className);
    return element;
  }

  function clearDisplayBox() {
    while (displayBox.firstChild) {
      displayBox.firstChild.remove();
    }
  }

  function displayError(msg) {
    clearDisplayBox();
    displayBox.appendChild(document.createTextNode(msg));
  }

  function loading() {
    clearDisplayBox();
    const loadingElement = el('div', 'loading');
    const gifElement = el('img');
    gifElement.src = 'loading.gif';
    loadingElement.appendChild(gifElement);
    displayBox.appendChild(loadingElement);
  }

  function displayCompany(company) {
    if (company.length === 0) {
      displayError('Ekkert fyrirtæki fannst fyrir leitarstreng');
    } else {
      clearDisplayBox();

      for (let i = 0; i < company.length; i += 1) {
        const obj = company[i];
        const divElement = el('div', 'company');
        const dlElement = el('dl');
        let dtElement;
        let ddElement;
        // Name
        dtElement = el('dt');
        dtElement.appendChild(document.createTextNode('Nafn'));
        dlElement.appendChild(dtElement);
        ddElement = el('dd');
        ddElement.appendChild(document.createTextNode(obj.name));
        dlElement.appendChild(ddElement);
        // Sn
        dtElement = el('dt');
        dtElement.appendChild(document.createTextNode('Kennitala'));
        dlElement.appendChild(dtElement);
        ddElement = el('dd');
        ddElement.appendChild(document.createTextNode(obj.sn));
        dlElement.appendChild(ddElement);
        if (obj.active === 1) {
          // Adress
          dtElement = el('dt');
          dtElement.appendChild(document.createTextNode('Heimilsfang'));
          dlElement.appendChild(dtElement);
          ddElement = el('dd');
          ddElement.appendChild(document.createTextNode(obj.address));
          dlElement.appendChild(ddElement);
          divElement.classList.add('company--active');
        } else {
          divElement.classList.add('company--inactive');
        }
        divElement.appendChild(dlElement);
        displayBox.appendChild(divElement);
      }
    }
  }

  function fetchData(company) {
    loading();
    fetch(`${API_URL}${company}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('Villa við að sækja gögn');
      })
      .then((data) => {
        displayCompany(data.results);
      })
      .catch(() => {
        displayError('Villa við að sækja gögn');
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input.value === '') {
      displayError('Lén verður að vera strengur');
    } else {
      fetchData(input.value);
    }
  }

  function init(companies) {
    const form = companies.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('main');
  program.init(companies);
});
