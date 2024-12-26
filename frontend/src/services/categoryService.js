import http from './httpService';


export function getCategoryAPI() {
  return http.get('/category/list').then(({data}) => data.data);
}
