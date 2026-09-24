import { WebSearchResult } from '../../src/types/research.ts';

export async function searchAcademicWeb(query: string, projectId: string): Promise<WebSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const results: WebSearchResult[] = [];
  const timestamp = new Date().toISOString();

  // 1. Query Crossref API for open academic metadata
  try {
    const crossrefUrl = `https://api.crossref.org/works?query=${encodeURIComponent(trimmed)}&rows=4&select=DOI,title,URL,author,abstract,created,container-title`;
    const response = await fetch(crossrefUrl, {
      headers: {
        'User-Agent': 'ResearchFlowAI/1.0 (academic-research-tool; mailto:research@example.org)'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const items = data.message?.items || [];
      for (const item of items) {
        const title = Array.isArray(item.title) ? item.title[0] : item.title || 'Scholarly Publication';
        const url = item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : '');
        const journal = Array.isArray(item['container-title']) ? item['container-title'][0] : 'Academic Publication';
        const authors = (item.author || []).map((a: any) => `${a.family || ''} ${a.given || ''}`.trim()).filter(Boolean).slice(0, 3).join(', ');
        const excerpt = item.abstract
          ? item.abstract.replace(/<[^>]+>/g, '').slice(0, 300) + '...'
          : `Published in ${journal}${authors ? ` by ${authors}` : ''}. Indexed in Crossref DOI registry.`;

        results.push({
          id: `web-cr-${Date.now()}-${results.length}`,
          projectId,
          query: trimmed,
          title,
          url: url || `https://doi.org/${item.DOI}`,
          source: `Crossref Academic Index (${journal})`,
          retrievalTimestamp: timestamp,
          excerpt
        });
      }
    }
  } catch (err) {
    console.warn('[webSearchService] Crossref fetch error:', err);
  }

  // 2. Query arXiv API or Wikipedia API if needed
  if (results.length < 3) {
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(trimmed)}&format=json&origin=*&srlimit=3`;
      const response = await fetch(wikiUrl);
      if (response.ok) {
        const data = await response.json();
        const searchList = data.query?.search || [];
        for (const item of searchList) {
          const title = item.title;
          const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;
          const snippet = item.snippet?.replace(/<[^>]+>/g, '') || '';

          results.push({
            id: `web-wiki-${Date.now()}-${results.length}`,
            projectId,
            query: trimmed,
            title: `${title} - Scientific Reference`,
            url,
            source: 'Wikipedia Academic / Technical Index',
            retrievalTimestamp: timestamp,
            excerpt: snippet ? `${snippet}...` : 'Technical reference documentation.'
          });
        }
      }
    } catch (wikiErr) {
      console.warn('[webSearchService] Wikipedia fetch error:', wikiErr);
    }
  }

  // If both external network calls fail or returned empty, provide grounded scholarly fallback result
  if (results.length === 0) {
    results.push({
      id: `web-fallback-${Date.now()}`,
      projectId,
      query: trimmed,
      title: `Scholarly Search Query Index: "${trimmed}"`,
      url: `https://scholar.google.com/scholar?q=${encodeURIComponent(trimmed)}`,
      source: 'Google Scholar Search Reference',
      retrievalTimestamp: timestamp,
      excerpt: `Targeted academic literature queries for "${trimmed}". Verify citation indices on Google Scholar, IEEE Xplore, or ScienceDirect.`
    });
  }

  return results;
}
