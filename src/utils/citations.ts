import { CitationStyle, Source } from '../types/research.ts';

export function formatCitation(source: Source, style: CitationStyle, index = 1): string {
  const authors = source.authors && source.authors.length > 0 ? source.authors : null;
  const title = source.title || 'Untitled Document';
  const year = source.publicationDate ? source.publicationDate.slice(0, 4) : null;
  const doi = source.doi ? `doi: ${source.doi}` : null;
  const url = source.url || null;

  switch (style) {
    case 'IEEE': {
      // IEEE format: [1] J. K. Author and A. B. Researcher, "Title of paper," Periodical / Source, Year, doi: xx.
      let authorStr = 'Metadata unavailable';
      if (authors) {
        if (authors.length === 1) authorStr = authors[0];
        else if (authors.length === 2) authorStr = `${authors[0]} and ${authors[1]}`;
        else authorStr = `${authors[0]} et al.`;
      }

      const yearStr = year || 'Metadata unavailable';
      const locStr = doi || url || 'Metadata unavailable';

      return `[${index}] ${authorStr}, "${title}," ${source.sourceType}, ${yearStr}, ${locStr}.`;
    }

    case 'APA': {
      // APA: Author, A. (Year). Title. Source. URL/DOI
      let authorStr = 'Metadata unavailable';
      if (authors) {
        authorStr = authors.join(', ');
      }
      const yearStr = year ? `(${year})` : '(n.d.)';
      const sourceStr = `${source.sourceType}`;
      const linkStr = doi ? `https://doi.org/${source.doi}` : url || 'Metadata unavailable';

      return `${authorStr} ${yearStr}. ${title}. ${sourceStr}. ${linkStr}`;
    }

    case 'MLA': {
      // MLA: Author. "Title." Source, Year, URL.
      let authorStr = 'Metadata unavailable.';
      if (authors) {
        authorStr = `${authors[0]}${authors.length > 1 ? ', et al.' : '.'}`;
      }
      const yearStr = year || 'Metadata unavailable';
      const linkStr = url || doi || 'Metadata unavailable';

      return `${authorStr} "${title}." ${source.sourceType}, ${yearStr}, ${linkStr}.`;
    }

    default:
      return `${source.title} (${source.publicationDate || 'Metadata unavailable'})`;
  }
}

export function generateBibtex(source: Source, index = 1): string {
  const citeKey = source.authors && source.authors[0]
    ? `${source.authors[0].split(' ').pop()?.toLowerCase() || 'ref'}${source.publicationDate ? source.publicationDate.slice(0, 4) : index}`
    : `ref_${index}`;

  const authorsStr = (source.authors || []).join(' and ') || 'Metadata unavailable';
  const yearStr = source.publicationDate ? source.publicationDate.slice(0, 4) : 'Metadata unavailable';

  return `@article{${citeKey},
  author    = {${authorsStr}},
  title     = {${source.title}},
  year      = {${yearStr}},
  journal   = {${source.sourceType}},
  doi       = {${source.doi || 'Metadata unavailable'}},
  url       = {${source.url || 'Metadata unavailable'}}
}`;
}
