import './sass/main.scss';
import { fetchImages } from './js/fetchImg';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
/* const axios = require('axios');

axios.defaults.baseURL = 'https://pixabay.com/api/'; */
const form = document.querySelector('#search-form');
/* const searchButton = document.querySelector('.submit'); */
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const toTopBtn = document.querySelector('.btn-to-top');

function renderGallery(images) {
    const markup = images
      .map(image => {
        const { id, largeImageURL, webformatURL, tags, likes, views, comments, downloads } = image;
        return `
          <a class="gallery__link" href="${largeImageURL}">
            <div class="gallery-item" id="${id}">
              <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
              <div class="info">
                <p class="info-item"><b>Likes</b>${likes}</p>
                <p class="info-item"><b>Views</b>${views}</p>
                <p class="info-item"><b>Comments</b>${comments}</p>
                <p class="info-item"><b>Downloads</b>${downloads}</p>
              </div>
            </div>
          </a>
        `;
      })
      .join('');
  
    gallery.insertAdjacentHTML('beforeend', markup);
  }


  let query = '';
  let page = 1;
  let simpleLightBox;
  const perPage = 40;


  form.addEventListener('submit', onSearchForm);
  loadMoreBtn.addEventListener('click', onLoadMoreBtn);

  onScroll();
  onToTopBtn();

  function onSearchForm(event){
      event.preventDefault();
      window.scrollTo({ top: 0});
      page= 1;
      query = event.currentTarget.searchQuery.value.trim();
      gallery.innerHTML = '';
      loadMoreBtn.classList.add('is-hidden');

      if (query === ''){
        Notiflix.Notify.failure('Oops!Enter some words');
    return;
      }
      
      fetchImages(query, page, perPage)
      .then(({data}) => {
          if (data.totalHits === 0) {
            Notiflix.Notify.failure(  'Sorry, there are no images matching your search query. Please try again.',);
          } else {
              renderGallery(data.hits);
              simpleLightBox = new SimpleLightbox('.gallery a').refresh();
              Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
       
              if (data.totalHits > perPage) {
                  loadMoreBtn.classList.remove('is-hidden');
              }
            }
          
      })
      .catch(error => console.log(error))
      .finally(()=> {
          form.reset();
      });
  }

  function onLoadMoreBtn() {
    page += 1;
    simpleLightBox.destroy();
  
    fetchImages(query, page, perPage)
      .then(({ data }) => {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
  
        const totalPages = Math.ceil(data.totalHits / perPage);
  
        if (page > totalPages) {
          loadMoreBtn.classList.add('is-hidden');
          Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        }
      })
      .catch(error => console.log(error));
  }
  


  window.addEventListener('scroll', onScroll);
  toTopBtn.addEventListener('click', onToTopBtn);
  
  function onScroll() {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;
  
    if (scrolled > coords) {
      toTopBtn.classList.add('btn-to-top--visible');
    }
    if (scrolled < coords) {
      toTopBtn.classList.remove('btn-to-top--visible');
    }
  }
  
  function onToTopBtn() {
    if (window.pageYOffset > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }