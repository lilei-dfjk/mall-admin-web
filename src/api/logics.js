import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/logics/pageList',
    method:'get',
    params:params
  })
}
export function deleteLogicsRule(data) {
  return request({
    url:'/logics/delete/',
    method:'post',
    data:data
  })
}
export function createLogicsRule(data) {
  return request({
    url:'/logics/create',
    method:'post',
    data:data
  })
}
export function viewLogicsRule(id) {
  return request({
    url:'/logics/query/'+id,
    method:'get',
  })
}

export function updateLogicsRule(id,data) {
  return request({
    url:'/logics/update/'+id,
    method:'post',
    data:data
  })
}
