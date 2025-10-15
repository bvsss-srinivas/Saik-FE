const BACKEND_BASE = (import.meta?.env?.VITE_BACKEND_URL) || 'http://localhost:8024'

export function resolveImage(src) {
  if (!src) return '/vite.svg'
  // already absolute
  if (typeof src !== 'string') return '/vite.svg'
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  // if it's already an absolute path from backend like /uploads/..., prefix origin
  if (src.startsWith('/')) return `${BACKEND_BASE}${src}`
  // otherwise assume relative path (uploads/...), prefix base
  return `${BACKEND_BASE}/${src}`
}

export default resolveImage
