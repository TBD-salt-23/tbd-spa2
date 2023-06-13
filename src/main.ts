/* eslint-disable */
import './style.css';
const template = document.getElementById('template');
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
    const imgClone = document.importNode(template, true);
    imgClone.content.querySelector('.image').setAttribute('src', source);
    const clone = imgClone.content.cloneNode(true);
    document.querySelector('.imageCards').append(clone);
  });
};

showImg();

/* eslint-disable */
