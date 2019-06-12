import request from '@/utils/request'
export function fetchTemplateList(params) {
  return request({
    url:'/zuul/resource/resource/templatelib',
    method:'get',
    params:params
  })
}

export function creatActivity(data) {
  return request({
    url:'/zuul/activity/activity/basic/add/info',
    method:'post',
    data:data
  })
}

export function fetchActivityList(data) {
  return request({
    url:'/zuul/activity/activity/basic/search',
    method:'post',
    data:data
  })
}

export function getActivity(id) {
  return request({
    url:'/zuul/activity/activity/basic/updateinfo?activityId=' + id,
    method:'get',
  })
}

export function getActivityStaticData(params) {
  return request({
    url:'/zuul/activity/activity/basic/static',
    method:'get',
    params:params
  })
}

export function cancleActivity(params) {
  return request({
    url:'/zuul/activity/activity/basic/cancle?activityId=' + params,
    method:'get'
  })
}

export function getStatisticByDays(data) {
  return request({
    url:'/zuul/user/user/static/days',
    method:'post',
    data:data
  })
}

export function getStatisticByHours(data) {
  return request({
    url:'/zuul/user/user/static/hours',
    method:'post',
    data:data
  })
}

export function getOtherStatistic(params) {
  return request({
    url:'/zuul/user/user/static/other',
    method:'get',
    params:params
  })
}

export function getBasicStatistic(params) {
  return request({
    url:'/zuul/user/user/static/basic',
    method:'get',
    params:params
  })
}

export function fetchPreuploadInfo(data) {
  return request({
    url:'/zuul/resource/resource/preupload',
    method:'post',
    data:data
  })
}

export function uploadToOss(url, data) {
  return request({
    url: url,
    method:'post',
    data: data,
    dataType: "text",
    headers: { 'Content-Type': 'multipart/form-data;boundary={boundary}' }
  })
}

