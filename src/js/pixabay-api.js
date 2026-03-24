import axios from 'axios';

const API_KEY = '55066588-ed2d39315576c70ee50c91166';
const BASE_URL = 'https://pixabay.com/api/';

export function getImagesByQuery(query, page = 1) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=12&page=${page}`;
  return axios.get(url).then(response => response.data);
}
