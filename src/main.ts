import axios from 'axios';
import './style.css';

interface UnsplashObject {
  description: string;
  alt_description: string;
  urls: {
    small: string;
    thumb: string;
  };
}

const searchBar = document.querySelector('.searchBar__field');
const template = document.querySelector('template') as Node;
const source = 'https://picsum.photos/200';
const listOfMockImages = [
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

let listOfImages: UnsplashObject[] = [];

const baseURL = 'https://api.unsplash.com/search/photos';
const API_KEY = import.meta.env.VITE_DB_API_KEY;

const fetchImages = async (query: string) => {
  const pictures = (
    await axios({
      method: 'get',
      url: `${baseURL}/?client_id=${API_KEY}&query=${query}`,
    })
  ).data;
  pictures.results.forEach((picture: UnsplashObject) =>
    listOfImages.push(picture)
  );
  console.log('Here is the array of our things', listOfImages);
  showImg();
  console.log(pictures.results[0].id);
};

const showImg = () => {
  const htmlElement = document.createElement('div');
  htmlElement.setAttribute('class', 'image-cards');
  listOfImages.forEach(picture => {
    const imgClone = document.importNode(template, true) as any; // CHANGE THIS AT SOME POINT
    imgClone.content
      .querySelector('.result-image')
      .setAttribute('src', picture.urls.small);
    const clone = imgClone.content.cloneNode(true);
    htmlElement.appendChild(clone);
  });
  document.querySelector('.image-section')?.replaceChildren(htmlElement);
  listOfImages = [];
};

showImg();
const searchHistory: string[] = [];
const storageObject = {
  history: [],
};

interface Storage {
  history: State[];
}

interface State {
  query: string;
}

let state: State = {
  query: 'is it me?',
};

const appendHTMLToState = (state: State[]) => {
  const searchSuggestions = document.querySelector('.searchEntries');
  if (searchSuggestions == null) return;
  searchSuggestions.innerHTML = `<ul>${state
    .map(state => `<li>${state.query}</li>`)
    .join('\n')}</ul>`;
};
const render = (htmlString: string, el: Element) => {
  el.innerHTML = htmlString;
};
const update = (newState: State) => {
  state = { ...state, ...newState };

  window.dispatchEvent(new Event('statechange'));
};

// window.addEventListener('statechange', () => {
//   const elementToUpdate = document.querySelector('#app');
//   if (!elementToUpdate) return;
//   render(appendHTMLToState(state), elementToUpdate);
// });

const button = document.querySelector('.searchBtn') as HTMLButtonElement;
button.addEventListener('click', () => {
  const searchParam = document.querySelector(
    '.searchBar__field'
  ) as HTMLInputElement;
  if (!searchParam.value) return;

  fetchImages(searchParam.value);

  update({ query: searchParam.value });

  const parsedStorage = retrieveLocalStorage();

  parsedStorage.history.push({
    query: searchParam.value,
  });

  const storageToSave = JSON.stringify(parsedStorage);
  localStorage.setItem('searchParam', storageToSave);
});

const retrieveLocalStorage = () => {
  let storedItems = localStorage.getItem('searchParam') as any;
  if (!storedItems) {
    localStorage.setItem('searchParam', JSON.stringify({ history: [] }));
    storedItems = localStorage.getItem('searchParam') as any;
  }

  return JSON.parse(storedItems) as Storage;
};

searchBar?.addEventListener('focus', () => {
  appendHTMLToState(retrieveLocalStorage().history);
});
