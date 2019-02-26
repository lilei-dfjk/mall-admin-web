import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/member/pageList',
    method:'get',
    params:params
  })
}
export function deleteMember(data) {
  return request({
    url:'/member/delete/',
    method:'post',
    data:data
  })
}
export function createMember(data) {
  return request({
    url:'/member/create',
    method:'post',
    data:data
  })
}
export function viewMember(id) {
  return request({
    url:'/member/query/'+id,
    method:'get',
  })
}

export function updateMember(id,data) {
  return request({
    url:'/member/update/'+id,
    method:'post',
    data:data
  })
}
