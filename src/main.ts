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

let listOfImages: UnsplashObject[] = [];

const baseURL = 'https://api.unsplash.com/search/photos';
const API_KEY: string = import.meta.env.VITE_DB_API_KEY;

const fetchImages = async (query: string): Promise<void> => {
  const pictures = (
    await axios({
      method: 'get',
      url: `${baseURL}/?client_id=${API_KEY}&query=${query}&per_page=9`,
    })
  ).data;
  pictures.results.forEach((picture: UnsplashObject) =>
    listOfImages.push(picture)
  );
  console.log('Here is the array of our things', listOfImages);
  showImg();
};

const showImg = (): void => {
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

interface Storage {
  history: State[];
}

interface State {
  query: string;
}

let state: State = {
  query: 'is it me?',
};

const appendHTMLToState = (state: State[]): void => {
  const searchSuggestions = document.querySelector('.searchEntries');
  if (searchSuggestions == null) return;
  searchSuggestions.innerHTML = `<ul class="searchEntries__list">${state
    .map(state => `<li>${state.query}</li>`)
    .slice(-5)
    .join('\n')}</ul>`;
  document.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      console.log('We are inside the click');
      const searchBar = document.querySelector(
        '.searchBar__field'
      ) as HTMLInputElement;
      console.log('This is searchBar', searchBar);
      searchBar.value = '';
      if (li.textContent === null) return;
      console.log('This is li text content', li.textContent);
      searchBar.value = li.textContent;
    });
  });
};
// const render = (htmlString: string, el: Element) => {
//   el.innerHTML = htmlString;
// };
const update = (newState: State): void => {
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
  fetchImages(searchParam.value).catch(error => {
    console.log(error);
  });

  update({ query: searchParam.value });

  const parsedStorage = retrieveLocalStorage();

  parsedStorage.history.push({
    query: searchParam.value,
  });

  const storageToSave = JSON.stringify(parsedStorage);
  localStorage.setItem('searchParam', storageToSave);
});

const retrieveLocalStorage = (): Storage => {
  let storedItems = localStorage.getItem('searchParam') as string;
  if (storedItems.length < 0) {
    localStorage.setItem('searchParam', JSON.stringify({ history: [] }));
    storedItems = localStorage.getItem('searchParam') as string;
  }

  return JSON.parse(storedItems) as Storage;
};

searchBar?.addEventListener('focus', () => {
  appendHTMLToState(retrieveLocalStorage().history);
});
