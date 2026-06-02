import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 120_000,
})

export const uploadFile = (file, onProgress) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.post('/files/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: e => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  })
}

export const createJob = (payload) => api.post('/jobs', payload)

export const getJob = (jobId) => api.get(`/jobs/${jobId}`)

export const listJobs = () => api.get('/jobs')

export const listFiles = () => api.get('/files')

export const downloadUrl = (fileId) => `/api/files/${fileId}/download`

export const pollJob = (jobId, onUpdate, intervalMs = 1500) => {
  const id = setInterval(async () => {
    try {
      const { data } = await getJob(jobId)
      const job = data.data
      onUpdate(job)
      if (job.status === 'COMPLETED' || job.status === 'FAILED' || job.status === 'CANCELLED') {
        clearInterval(id)
      }
    } catch (e) {
      clearInterval(id)
    }
  }, intervalMs)
  return () => clearInterval(id)
}
