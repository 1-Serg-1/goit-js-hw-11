import 'modern-normalize';
import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { markupCardPage } from './js/markupCardPage';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const button = document.querySelector('.load-more');

button.classList.add('is-hidden');

let imageName;
let page = 1;

form.addEventListener('submit', event => {
    event.preventDefault();
    imageName = form.elements.searchQuery.value;
    if (imageName === '') {
        return Notify.info('Oops! The field cannot be empty')
    }
  gallery.innerHTML = '';
  page = 1;
  getImages(imageName);   
});

button.addEventListener('click', () => {
  imageName = form.elements.searchQuery.value;
  page += 1;
  getImages(imageName);
  });

const getImages = (imageName) => {
  const BASE_URL = 'https://pixabay.com/api/';
  const searchParams = new URLSearchParams({
    key: '28414366-d85075a16e83c1a2e8dc41671',
    q: `${imageName}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page,
    per_page: '40'
  });

  axios.get(`${BASE_URL}?${searchParams}`)
    .then(res => {
      if (res.data.hits.length === 0) {
        return Notify.info('Sorry, there are no images matching your search query. Please try again.')
      } Notify.info(`Hooray! We found ${res.data.totalHits} images.`);
      button.classList.remove('is-hidden');
      countSearch(res.data);
      const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt',
    captionDelay: 250 });
    })
    .catch((error) => Notify.failure(error.message));

  function countSearch(data) {
    if (data.totalHits < 40) {
      gallery.insertAdjacentHTML('beforeend', markupCardPage(data.hits));
      Notify.info("We're sorry, but you've reached the end of search results.")
      button.classList.add('is-hidden');    
    } gallery.insertAdjacentHTML('beforeend', markupCardPage(data.hits));
  }
}


  