import request from '@/utils/request';

export async function query(obj): Promise<any> {
  return request('/api/searchList?page='+obj.page+'&count='+obj.count);
}
