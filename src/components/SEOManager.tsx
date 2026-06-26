import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_IMAGE, SITE_NAME, absoluteUrl, getSeoForPath } from '../lib/seo';

const JSON_LD_ID = 'azera-json-ld';

function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

export default function SEOManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(pathname);
    const canonicalUrl = absoluteUrl(seo.path);
    const robots = seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    document.documentElement.lang = 'id';
    document.title = seo.title;

    setMeta('description', seo.description);
    setMeta('robots', robots);
    setMeta('googlebot', robots);
    setMeta('application-name', SITE_NAME);
    setMeta('theme-color', '#6728e4');

    if (seo.keywords) setMeta('keywords', seo.keywords);

    setMeta('og:site_name', SITE_NAME, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:title', seo.title, 'property');
    setMeta('og:description', seo.description, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:image', DEFAULT_IMAGE, 'property');
    setMeta('og:locale', 'id_ID', 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', seo.title);
    setMeta('twitter:description', seo.description);
    setMeta('twitter:image', DEFAULT_IMAGE);

    setLink('canonical', canonicalUrl);

    document.getElementById(JSON_LD_ID)?.remove();
    if (seo.jsonLd && !seo.noindex) {
      const script = document.createElement('script');
      script.id = JSON_LD_ID;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(seo.jsonLd);
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
}
