import { useState, useEffect } from 'react'
import axios from 'axios'

export function useArticles(params = {}) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const query = new URLSearchParams(params).toString()
    axios.get(`/api/articles/?${query}`)
      .then(r => setArticles(r.data))
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])

  return { articles, loading, error }
}

export function useArticle(slug) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    axios.get(`/api/articles/${slug}`)
      .then(r => setArticle(r.data))
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [slug])

  return { article, loading, error }
}
