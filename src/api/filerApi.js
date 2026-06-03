import axios from 'axios'

const getToken = () => localStorage.getItem('filer_token')
const authHeaders = () => {
  const t = getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export const uploadFile = (file, onProgress) => {
  const fd = new FormData()
  fd.append('file', file)
  return axios.post('/api/files/upload', fd, {
    headers: authHeaders(),
    onUploadProgress: e =>
      onProgress?.(Math.round(e.loaded / e.total * 100))
  }).then(r => r.data.data)
}

export const createJob = (payload) =>
  axios.post('/api/jobs', payload, { headers: authHeaders() }).then(r => r.data.data)

export const getJob = (jobId) =>
  axios.get(`/api/jobs/${jobId}`, { headers: authHeaders() }).then(r => r.data.data)

export const listJobs = () =>
  axios.get('/api/jobs', { headers: authHeaders() }).then(r => r.data.data)

export const listFiles = () =>
  axios.get('/api/files', { headers: authHeaders() }).then(r => r.data.data)

export const downloadUrl = (fileId) => `/api/files/${fileId}/download`

export const createShareLink = (fileId) =>
  axios.post(`/api/share/${fileId}`, {}, { headers: authHeaders() }).then(r => r.data.data)

export const listPresets = () =>
  axios.get('/api/presets', { headers: authHeaders() }).then(r => r.data.data)

export const createPreset = (data) =>
  axios.post('/api/presets', data, { headers: authHeaders() }).then(r => r.data.data)

export const deletePreset = (id) =>
  axios.delete(`/api/presets/${id}`, { headers: authHeaders() })

export const pollJob = (jobId, onUpdate, interval = 1500) => {
  const timer = setInterval(async () => {
    try {
      const job = await getJob(jobId)
      onUpdate(job)
      if (job.status === 'COMPLETED' || job.status === 'FAILED') {
        clearInterval(timer)
      }
    } catch {
      clearInterval(timer)
    }
  }, interval)
  return () => clearInterval(timer)
}
