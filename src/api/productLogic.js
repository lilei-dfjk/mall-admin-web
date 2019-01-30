
import request from '@/utils/request'

export function getProductLogics(id) {
  return request({
    url:'/product/updateInfo/'+id,
    method:'get',
  })
}

