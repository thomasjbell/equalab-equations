import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient()
  
  // Get all public equations
  const { data: equations } = await supabase
    .from('equations')
    .select('id, name, category, updated_at')
    .eq('is_public', true)

  const baseUrl = 'https://equations.equalab.uk'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/favourites`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/settings`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Dynamic equation pages
  const equationPages = equations?.map((equation) => ({
    url: `${baseUrl}/equation/${equation.id}`,
    lastModified: new Date(equation.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  })) || []

  // Category pages (for SEO)
  const categories = [...new Set(equations?.map(eq => eq.category) || [])]
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...equationPages,
    ...categoryPages,
  ]
}