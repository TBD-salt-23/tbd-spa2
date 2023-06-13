/* eslint-disable */
import './style.css';
const template = document.querySelector('template') as Node;
const source = 'https://picsum.photos/200';
const listOfImages = [
  source,
  source,
  source,
  source,
  source,
  source,
  source,
  source,
  source,
];

const showImg = () => {
  listOfImages.forEach(() => {
    const imgClone = document.importNode(template, true) as any; //CHANGE THIS AT SOME POINT
    imgClone.content.querySelector('.image').setAttribute('src', source);
    const clone = imgClone.content.cloneNode(true);
    document.querySelector('.imageCards')?.append(clone);
  });
};

showImg();
const searchHistory: string[] = [];
const storageObject = {
  history: [],
};

type Storage = {
  history: string[];
};

type State = {
  title?: string;
  message: string;
  count?: number;
};

let state: State = {
  title: 'hello',
  message: 'is it me?',
};

const appendHTMLToState = (state: State) => {
  return `<h3>${state.title}</h3>
  <p>${state.message}</p>`;
};
const render = (htmlString: string, el: Element) => {
  el.innerHTML = htmlString;
};
const update = (newState: State) => {
  const count = window.history.state?.count || 0;
  window.history.pushState(
    { ...state, count: count + 1 },
    'HISTORY',
    `index.html#${count}`
  );
  state = { ...state, ...newState };
  window.dispatchEvent(new Event('statechange'));
};

window.addEventListener('statechange', () => {
  const elementToUpdate = document.querySelector('#app');
  if (!elementToUpdate) return;
  render(appendHTMLToState(state), elementToUpdate);
});

const button = document.querySelector('.searchBtn') as HTMLButtonElement;
button.addEventListener('click', () => {
  const searchParam = document.querySelector(
    '.searchBar__field'
  ) as HTMLInputElement;
  if (!searchParam.value) return;
  update({ message: searchParam.value });

  let storedItems = localStorage.getItem('searchParam') as any;
  if (!storedItems) {
    localStorage.setItem('searchParam', JSON.stringify({ history: [] }));
    storedItems = localStorage.getItem('searchParam') as any;
  }

  const parsedStorage = JSON.parse(storedItems) as Storage;
  parsedStorage.history.push(searchParam.value);
  const storageToSave = JSON.stringify(parsedStorage);
  searchHistory.push(searchParam.value);

  localStorage.setItem('searchParam', storageToSave);
});

/* eslint-disable */
