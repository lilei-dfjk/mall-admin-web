import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/product/logistic/rule/list',
    method:'get',
    params:params
  })
}
