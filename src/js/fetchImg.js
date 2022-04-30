const axios = require('axios');

axios.defaults.baseURL  = 'https://pixabay.com/api/';
const KEY = '27079085-9660399119846a5966293c219';

export async function fetchImages(query, page, perPage) {
    const respons = await axios.get(
        `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,

    );
    return respons;
}