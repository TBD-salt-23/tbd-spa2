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
const button = document.querySelector('.searchBtn') as HTMLButtonElement;
button.addEventListener('click', () => {
  const searchParam = document.querySelector(
    '.searchBar__field'
  ) as HTMLInputElement;
  if (!searchParam.value) return;
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
