import { fetchImages } from '../js/fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
const input = document.querySelector('.search-form-input');
const btnSearch = document.querySelector('.search-form-button');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');
btnLoadMore.style.display = 'none';

let pageNumber = 1;

btnSearch.addEventListener('click', e => {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = input.value.trim();
  if (trimmedValue !== '') {
    fetchImages(trimmedValue, pageNumber).then(foundData => {
      if (foundData.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImageList(foundData.hits);
        Notiflix.Notify.success(
          `Hooray! We found ${foundData.totalHits} images.`
        );
        // if (foundData.hits.length > 40) {
        //   btnLoadMore.style.display = 'block';
        // }
        btnLoadMore.style.display = 'block';
        if (foundData.hits.length < 40) {
          btnLoadMore.style.display = 'none';
        }
        // console.log(foundData.hits.length)
        gallerySimpleLightbox.refresh();
      }
    });
  }
});

btnLoadMore.addEventListener('click', () => {
  pageNumber++;
  const trimmedValue = input.value.trim();
  btnLoadMore.style.display = 'none';
  fetchImages(trimmedValue, pageNumber).then(foundData => {
    // if (foundData.hits.length === 0) {
    //   Notiflix.Notify.failure(
    //     'Sorry, there are no images matching your search query. Please try again.'
    //   );
    // } else {
      renderImageList(foundData.hits);
    //   Notiflix.Notify.success(
    //     `Hooray! We found ${foundData.totalHits} images.`
    //   );
    //   btnLoadMore.style.display = 'block';
    //   if (40 * pageNumber >= foundData.totalHits) {
    //     btnLoadMore.style.display = 'none';
    //   }
    // }
    btnLoadMore.style.display = 'block';
      if (40 * pageNumber >= foundData.totalHits) {
        btnLoadMore.style.display = 'none';
      }
  });
});

function renderImageList(images) {
  console.log(images, 'images');
  const markup = images
    .map(image => {
      console.log('img', image);
      return `<div class="photo-card">
       <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
        <div class="info">
           <p class="info-item">
    <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${image.views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${image.comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${image.downloads}</span> 
            </p>
        </div>
    </div>`;
    })
    .join('');
  gallery.innerHTML += markup;
}

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  btnLoadMore.style.display = 'none';
}
