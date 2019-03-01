import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/code/typePageList',
    method:'get',
    params:params
  })
}
export function deleteType(data) {
  return request({
    url:'/code/deleteType/',
    method:'post',
    data:data
  })
}
export function createType(data) {
  return request({
    url:'/code/createType',
    method:'post',
    data:data
  })
}
export function viewType(id) {
  return request({
    url:'/code/query/'+id,
    method:'get',
  })
}
export function updateType(id,data) {
  return request({
    url:'/code/updateType/'+id,
    method:'post',
    data:data
  })
}
export function fetchCodeList(typeCode,params) {
  return request({
    url:'/code/codePageList/'+typeCode,
    method:'get',
    params:params
  })
}
export function deleteCode(data) {
  return request({
    url:'/code/deleteCode/',
    method:'post',
    data:data
  })
}
export function createCode(data) {
  return request({
    url:'/code/createCode',
    method:'post',
    data:data
  })
}
export function viewCode(id) {
  return request({
    url:'/code/viewCode/'+id,
    method:'get',
  })
}
export function updateCode(id,data) {
  return request({
    url:'/code/updateCode/'+id,
    method:'post',
    data:data
  })
}
