import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/zuul/resource/resource/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/zuul/resource/resource/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/zuul/resource/resource/logout',
    method: 'post'
  })
}
