import { MetadataRoute } from 'next'
import { getAllEquations, getCategories } from '@/data/equations'

export default function sitemap(): MetadataRoute.Sitemap {
  const equations = getAllEquations();
  const categories = getCategories();
  const baseUrl = 'https://equations.equalab.uk';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/favourites`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/settings`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const equationPages: MetadataRoute.Sitemap = equations.map((eq) => ({
    url: `${baseUrl}/equation/${eq.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...equationPages, ...categoryPages];
}
