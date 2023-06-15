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


interface Storage {
  history: State[]
}

interface State {
  query: string
}

let state: State = {
  query: ''
}

const button = document.querySelector('.searchBtn') as HTMLButtonElement
const template = document.querySelector('template') as Node
const searchField = document.querySelector(
  '.searchBar__field'
) as HTMLInputElement
const searchSuggestions = document.querySelector('.searchEntries')


const baseURL = 'https://api.unsplash.com/search/photos';
const API_KEY: string = import.meta.env.VITE_DB_API_KEY;

let listOfImages: UnsplashObject[] = []

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

const retrieveLocalStorage = (): Storage => {
  let storedItems = localStorage.getItem('searchParam') ?? false
  if (storedItems === false) {
    localStorage.setItem('searchParam', JSON.stringify({ history: [] }))
    storedItems = localStorage.getItem('searchParam') as string
    return JSON.parse(storedItems) as Storage
  }
  return JSON.parse(storedItems) as Storage
}

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


const suggestionsListHtml = (): string => {
  return `<ul class="searchEntries__list">${retrieveLocalStorage()
    .history.map(state => `<li>${state.query}</li>`)
    .slice(-5)
    .join('\n')}</ul>`
}

const updateSearchSuggestions = (): void => {
  if (searchSuggestions == null) return
  searchSuggestions.innerHTML = suggestionsListHtml()

  document.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      console.log('We are inside the click');
      const searchBar = document.querySelector(
        '.searchBar__field'

      ) as HTMLInputElement
      console.log('This is searchBar', searchBar)
      searchBar.value = ''
      if (li.textContent === null) return
      console.log('This is li text content', li.textContent)
      searchBar.value = li.textContent
    })
  })
}

const update = (newState: State): void => {
  state = { ...state, ...newState }
  window.dispatchEvent(new Event('statechange'))
}

const fireSearch = (): void => {
  fetchImages(searchField.value).catch(error => {
    console.log(error)
  })
  const parsedStorage = retrieveLocalStorage()
  parsedStorage.history.push({
    query: searchField.value
  })
  const storageToSave = JSON.stringify(parsedStorage)
  localStorage.setItem('searchParam', storageToSave)
  update({ query: searchField.value })
}

window.addEventListener('statechange', () => {
  updateSearchSuggestions()
})

updateSearchSuggestions()

button.addEventListener('click', fireSearch)

searchField.onkeydown = ({ key }) => {
  if (key === 'Enter') fireSearch()
}

