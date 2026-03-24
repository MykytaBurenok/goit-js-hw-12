import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const input = form.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

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
  loadMoreBtn.classList.add('is-hidden');
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

    // Показуємо, скільки всього знайдено
    iziToast.success({
      message: `Hooray! We found ${totalHits} images.`,
    });

    // Якщо є ще сторінки — показуємо кнопку
    if (page * PER_PAGE < totalHits) {
      loadMoreBtn.classList.remove('is-hidden');
    } else {
      loadMoreBtn.classList.add('is-hidden');
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

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (!data.hits.length) {
      loadMoreBtn.classList.add('is-hidden');
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
      return;
    }

    // Висота картки до додавання нових
    const firstCard = document.querySelector('.gallery a');
    const cardHeight = firstCard ? firstCard.getBoundingClientRect().height : 0;

    createGallery(data.hits);

    // Плавний скролл на дві висоти картки
    if (cardHeight) {
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    // Перевіряємо, чи залишилися ще сторінки
    if (page * PER_PAGE >= totalHits) {
      loadMoreBtn.classList.add('is-hidden');
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
  }
});
