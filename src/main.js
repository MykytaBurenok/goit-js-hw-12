import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const input = form.querySelector('input[name="search-text"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
const PER_PAGE = 15;
let totalHits = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();

  query = input.value.trim();
  page = 1;

  if (query === '') {
    iziToast.error({
      message: 'Please enter a search query.',
    });
    return;
  }

  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (!data.hits.length) {
      iziToast.error({
        message: 'Sorry, no images found. Try a different search query.',
      });
      return;
    }

    createGallery(data.hits);

    iziToast.success({
      message: `Hooray! We found ${totalHits} images.`,
    });

    if (page * PER_PAGE < totalHits) {
      showLoadMoreBtn();
    } else {
      hideLoadMoreBtn();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again.',
    });
    console.error(error);
  } finally {
    hideLoader();
    input.value = '';
  }
});

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', async () => {
    page += 1;

    hideLoadMoreBtn();
    showLoader();

    try {
      const data = await getImagesByQuery(query, page);

      if (!data.hits.length) {
        hideLoadMoreBtn();
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
        });
        return;
      }

      const firstCard = gallery.firstElementChild;
      const cardHeight = firstCard
        ? firstCard.getBoundingClientRect().height
        : 0;

      createGallery(data.hits);

      if (cardHeight) {
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }

      if (page * PER_PAGE < totalHits) {
        showLoadMoreBtn();
      } else {
        hideLoadMoreBtn();
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
        });
      }
    } catch (error) {
      iziToast.error({
        message: 'Something went wrong. Please try again.',
      });
      console.error(error);
      hideLoadMoreBtn();
    } finally {
      hideLoader();
    }
  });
}
