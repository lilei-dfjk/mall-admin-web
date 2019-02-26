import request from '@/utils/request'
export function fetchList() {
  return request({
    url:'/memberLevel/list',
    method:'get'
  })
}
export function pageList(params) {
  return request({
    url:'/memberLevel/pageList',
    method:'get',
    params:params
  })
}
export function deleteMemberLevel(data) {
  return request({
    url:'/memberLevel/delete/',
    method:'post',
    data:data
  })
}
export function createMemberLevel(data) {
  return request({
    url:'/memberLevel/create',
    method:'post',
    data:data
  })
}
export function viewMemberLevel(id) {
  return request({
    url:'/memberLevel/view/'+id,
    method:'get',
  })
}

export function updateMemberLevel(id,data) {
  return request({
    url:'/memberLevel/update/'+id,
    method:'post',
    data:data
  })
}
