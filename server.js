const fs = require('fs');
const path = require('path');
const express = require('express');

const BRAND_NAME = 'TVBO';
const DOMAIN = (process.env.SITE_URL || 'https://tvbo.ccwu.cc').replace(/\/+$/, '');
const PUBLIC_DIR = path.join(__dirname, 'public');
const MOVIES_DIR = path.join(__dirname, 'movies');
const SPORT_DATA_DIR = path.join(__dirname, 'sport');
const DISPLAY_YEAR = 2026;
const RECOMMENDATION_LIMIT = 30;
const AD_BANNERS = `
  <div class="ad-banners" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;margin:1.5rem auto 0;padding:1rem;max-width:100%;overflow:hidden">
    <script async="async" data-cfasync="false" src="https://bancadeltempoidea.org/21/ef22398ee828bfef4e73a4ac9ea6191a"></script>
    <div id="container-ef22398ee828bfef4e73a4ac9ea6191a"></div>
  </div>
`;
const PAGE_STYLES = `
<style>
  :root {
    color-scheme: dark;
    --bg: #0b0e13;
    --panel: #151a22;
    --accent: #e6b96f;
    --accent-soft: rgba(230,185,111,.10);
    --accent-line: rgba(230,185,111,.42);
    --text: #f4f1eb;
    --muted: #b7bbc4;
    --dim: #858b96;
    --line: rgba(255,255,255,.09);
    --line-2: rgba(255,255,255,.14);
    --radius: 16px;
    --maxw: 1240px;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  * { box-sizing: border-box; }
  html, body { min-height: 100%; margin: 0; background: var(--bg); color: var(--text); }
  body { min-height: 100vh; display: flex; flex-direction: column; }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }
  body { background: radial-gradient(ellipse at 50% -18rem,rgba(230,185,111,.10),transparent 42rem),var(--bg); }
  .site-header { position: sticky; top: 0; z-index: 50; backdrop-filter: blur(16px); background: rgba(11,14,19,.9); border-bottom: 1px solid var(--line); }
  .header-container { max-width: var(--maxw); min-height: 72px; margin: 0 auto; padding: .8rem 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .brand-logo, .logo-wrapper { display: inline-flex; align-items: center; gap: .6rem; font-weight: 800; font-size: 1.1rem; }
  .logo-icon { width: 32px; height: 32px; }
  .desktop-nav, .header-links { display: flex; align-items: center; gap: 1.25rem; color: var(--muted); }
  .desktop-nav a { transition: color .2s; font-size: .9rem; font-weight: 600; }
  .desktop-nav a:hover, .header-links a:hover { color: var(--accent); }
  .site-main { width: 100%; max-width: var(--maxw); margin: 0 auto; padding: 1.75rem 1rem 3.5rem; flex: 1; }
  .content-container { width: 100%; }
  .breadcrumb-nav { display: flex; flex-wrap: wrap; gap: .55rem; margin: .25rem 0 1.35rem; color: var(--dim); font-size: .84rem; }
  .breadcrumb-nav a:hover { color: var(--accent); }
  .show-hero-section, .episodes-section, .recommendations-section, .category-page-section { margin: 0 0 2rem; }
  .show-details-grid { display: grid; grid-template-columns: minmax(190px, 270px) minmax(0, 1fr); gap: 1.75rem; padding: 1.5rem; background: linear-gradient(125deg,#191f29,#12171f); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: 0 18px 48px rgba(0,0,0,.18); }
  .show-poster-box { min-width: 0; }
  .poster-wrapper { overflow: hidden; aspect-ratio: 2 / 3; background: #000; border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 12px 30px rgba(0,0,0,.25); }
  .poster-image { width: 100%; height: 100%; object-fit: cover; }
  .show-rating-badge { position: relative; display: inline-block; margin: -2.5rem 0 0 .6rem; padding: .3rem .55rem; background: rgba(13,16,22,.92); border: 1px solid var(--accent-line); border-radius: 7px; color: var(--accent); font-weight: 700; }
  .show-meta-list { display: grid; gap: .55rem; margin: .9rem 0 0; }
  .meta-item { display: flex; flex-wrap: wrap; gap: .4rem; align-items: baseline; color: var(--muted); font-size: .88rem; }
  .meta-item dt { min-width: 75px; color: var(--dim); font-weight: 700; }
  .meta-item dd { margin: 0; }
  .genre-tags { display: flex; flex-wrap: wrap; gap: .4rem; }
  .genre-tags a, .meta-tag { padding: .25rem .55rem; border: 1px solid var(--accent-line); border-radius: 999px; color: var(--accent); font-size: .78rem; }
  .show-info-box { align-self: center; min-width: 0; }
  .category-tag, .page-tag { display: inline-block; margin-bottom: .8rem; padding: .3rem .6rem; border: 1px solid var(--accent-line); border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: .72rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
  .show-title, h1 { margin: 0 0 .8rem; font-size: clamp(1.8rem, 4vw, 2.8rem); line-height: 1.12; overflow-wrap: anywhere; }
  .title-divider, .section-divider { height: 1px; margin: 1rem 0; background: var(--line); }
  .show-synopsis, .category-intro { max-width: 75ch; color: var(--muted); line-height: 1.75; }
  .legal-copy { max-width: 82ch; color: var(--muted); line-height: 1.75; }
  .legal-copy h2 { margin: 1.6rem 0 .45rem; color: var(--text); font-size: 1.12rem; }
  .legal-copy p, .legal-copy ul { margin: .65rem 0; }
  .legal-copy ul { padding-left: 1.4rem; }
  .legal-copy a { color: var(--accent); text-decoration: underline; text-underline-offset: .15em; }
  .cast-section { margin-top: 1.25rem; }
  .metadata-heading { margin: 0 0 .7rem; font-size: 1rem; }
  .cast-list { display: flex; flex-wrap: wrap; gap: .85rem; }
  .cast-member { width: 82px; color: var(--muted); text-align: center; font-size: .75rem; line-height: 1.35; }
  .cast-photo { display: block; width: 64px; height: 64px; margin: 0 auto .4rem; overflow: hidden; border: 1px solid var(--accent-line); border-radius: 50%; background: var(--panel); }
  .cast-photo img { width: 100%; height: 100%; object-fit: cover; }
  .cast-name { display: block; font-weight: 700; }
  .cast-character { display: block; margin-top: .15rem; color: var(--dim); }
  .trailer-card { display: inline-flex; align-items: center; gap: .7rem; margin-top: 1rem; padding: .65rem .85rem; border: 1px solid var(--line); border-radius: 10px; background: rgba(255,255,255,.025); }
  .trailer-play { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 50%; background: var(--accent); color: var(--bg); font-size: .9rem; }
  .trailer-label { color: var(--text); font-weight: 700; }
  .providers-section { margin: 0 0 1rem; }
  .provider-list { display: flex; flex-wrap: wrap; gap: .65rem; }
  .provider-item { display: inline-flex; align-items: center; gap: .5rem; min-height: 48px; padding: .35rem .6rem; border: 1px solid var(--line); border-radius: 9px; background: rgba(255,255,255,.025); color: var(--muted); font-size: .8rem; }
  .provider-logo { width: 38px; height: 38px; border-radius: 6px; object-fit: contain; background: rgba(255,255,255,.08); }
  .provider-name { font-weight: 600; }
  .episodes-section, .recommendations-section, .category-page-section { padding: 1.35rem; background: linear-gradient(145deg,rgba(24,30,40,.88),rgba(17,21,29,.92)); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: 0 14px 36px rgba(0,0,0,.12); }
  .section-header-flex { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .5rem; }
  .section-title { margin: 0; font-size: clamp(1.3rem, 3vw, 1.8rem); }
  .episode-count-label, .section-subtitle { margin: .25rem 0 0; color: var(--dim); }
  .season-header { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .5rem; margin: .5rem 0 1rem; }
  .season-container + .season-container { margin-top: 1.5rem; }
  .season-title { margin: 0; font-size: 1.1rem; }
  .season-ep-count { color: var(--dim); font-size: .85rem; }
  .episode-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 290px), 1fr)); gap: .75rem; margin: 0; padding: 0; list-style: none; }
  .episode-card { display: flex; gap: .85rem; min-height: 108px; padding: .8rem; background: rgba(255,255,255,.025); border: 1px solid var(--line); border-radius: 10px; transition: border-color .2s, transform .2s; }
  .episode-card:hover, .media-card:hover { transform: translateY(-3px); border-color: var(--accent-line); }
  .episode-number { flex: none; color: var(--accent); font-size: 1.1rem; font-weight: 800; }
  .episode-content { min-width: 0; }
  .episode-tags { display: flex; gap: .4rem; color: var(--dim); font-size: .75rem; }
  .episode-name { margin: .35rem 0; font-size: .95rem; }
  .episode-desc { margin: 0; color: var(--muted); font-size: .82rem; line-height: 1.5; }
  .episode-desc.italic { font-style: italic; color: var(--dim); }
  .episode-duration { color: var(--dim); font-size: .75rem; }
  .recommendations-grid, .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 1rem; margin-top: 1rem; }
  .media-card, .recommendation-card { min-width: 0; overflow: hidden; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; transition: transform .2s, border-color .2s, box-shadow .2s; }
  .recommendation-poster-wrap, .poster-wrap { aspect-ratio: 2 / 3; overflow: hidden; background: #090b0f; }
  .recommendation-img, .recommendation-poster-wrap img, .poster-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform .25s; }
  .recommendation-card:hover, .media-card:hover { box-shadow: 0 14px 30px rgba(0,0,0,.24); }
  .recommendation-card:hover img, .media-card:hover img { transform: scale(1.04); }
  .recommendation-title, .card-info { padding: .7rem; }
  .recommendation-title, .card-info h3 { margin: 0; font-size: .88rem; line-height: 1.35; }
  .card-info { display: grid; gap: .6rem; }
  .watch-btn, .primary-button { display: inline-flex; justify-content: center; padding: .65rem .9rem; border: 1px solid var(--accent-line); border-radius: 8px; background: var(--accent-soft); color: var(--accent); font-weight: 700; }
  .primary-button { margin-top: .5rem; }
  .site-footer { margin-top: auto; padding: 1.75rem 1rem; border-top: 1px solid var(--line); background: #0e1218; color: var(--dim); }
  .footer-container { max-width: var(--maxw); margin: 0 auto; padding: 1rem 0; }
  .footer-summary { display: grid; gap: .75rem; margin-bottom: 1.5rem; }
  .footer-summary p { max-width: 85ch; margin: 0; color: var(--muted); line-height: 1.65; font-size: .9rem; }
  .footer-links-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1.5rem; }
  .footer-col h4 { margin: 0 0 .75rem; color: var(--text); font-size: .95rem; }
  .footer-col ul { margin: 0; padding: 0; list-style: none; }
  .footer-col li + li { margin-top: .5rem; }
  .footer-col a { color: var(--dim); font-size: .87rem; }
  .footer-col a:hover { color: var(--accent); }
  .footer-bottom { margin-top: 1.5rem; padding-top: .85rem; border-top: 1px solid var(--line-2); color: var(--dim); font-size: .8rem; }
  .footer-bottom p { margin: 0; }
  .sport-event-description { white-space: pre-line; }
  .sport-event-details { display: grid; gap: .55rem; margin: .9rem 0 0; }
  .home-hero { position: relative; display: flex; min-height: 370px; align-items: center; overflow: hidden; margin: .25rem 0 2.5rem; padding: clamp(1.5rem,5vw,3.5rem); isolation: isolate; border: 1px solid var(--line-2); border-radius: 22px; background: linear-gradient(110deg,#171c25 0%,#141923 58%,#10141c 100%); box-shadow: 0 24px 60px rgba(0,0,0,.28); }
  .home-hero-art { position: absolute; z-index: -2; inset: 0 0 0 34%; overflow: hidden; }
  .home-hero-art img { width: 100%; height: 100%; object-fit: cover; opacity: .7; }
  .home-hero::after { position: absolute; z-index: -1; inset: 0; background: linear-gradient(90deg,#171c25 0%,rgba(23,28,37,.97) 34%,rgba(23,28,37,.66) 61%,rgba(15,19,26,.22) 100%),linear-gradient(0deg,rgba(11,14,19,.4),transparent 55%); content: ""; }
  .home-hero-copy { width: min(100%,620px); }
  .home-eyebrow { display: inline-flex; align-items: center; gap: .55rem; margin-bottom: 1rem; color: var(--accent); font-size: .76rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
  .home-eyebrow::before { width: 24px; height: 1px; background: var(--accent); content: ""; }
  .home-hero h1 { max-width: 13ch; margin: 0 0 1rem; font-size: clamp(2.3rem,6vw,4.4rem); letter-spacing: -.045em; line-height: 1.02; }
  .home-hero p { max-width: 58ch; margin: 0; color: #c2c6ce; font-size: 1rem; line-height: 1.75; }
  .home-actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 1.5rem; }
  .home-actions .primary-button { margin: 0; padding: .8rem 1.1rem; }
  .home-secondary-button { display: inline-flex; align-items: center; justify-content: center; padding: .8rem 1.1rem; border: 1px solid var(--line-2); border-radius: 8px; background: rgba(255,255,255,.04); color: var(--text); font-weight: 700; transition: border-color .2s, background .2s; }
  .home-secondary-button:hover { border-color: var(--accent-line); background: rgba(255,255,255,.08); }
  .home-section { margin: 0 0 2.5rem; }
  .home-section .media-grid { margin-top: 1.15rem; }
  .home-section-header { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: .75rem; }
  .home-section-header h2 { margin: 0; font-size: clamp(1.35rem,3vw,1.8rem); letter-spacing: -.025em; }
  .home-section-header p { margin: .3rem 0 0; color: var(--dim); font-size: .9rem; }
  .home-section-link { color: var(--accent); font-size: .88rem; font-weight: 700; }
  .home-section-link:hover { color: var(--text); }
  .home-genres { display: flex; flex-wrap: wrap; gap: .65rem; margin-top: 1.1rem; }
  .home-genres a { padding: .65rem .9rem; border: 1px solid var(--line); border-radius: 999px; background: rgba(255,255,255,.025); color: var(--muted); font-size: .86rem; transition: border-color .2s,color .2s,background .2s; }
  .home-genres a:hover { border-color: var(--accent-line); background: var(--accent-soft); color: var(--accent); }
  .home-empty-state { margin: 0; padding: 1.2rem; border: 1px dashed var(--line-2); border-radius: 12px; color: var(--muted); }
  @media (max-width: 680px) {
    .header-container { min-height: 58px; }
    .desktop-nav { gap: .65rem; font-size: .82rem; }
    .home-hero { min-height: 340px; margin-bottom: 2rem; padding: 1.5rem; }
    .home-hero-art { inset: 0; }
    .home-hero-art img { opacity: .42; }
    .home-hero::after { background: linear-gradient(90deg,rgba(19,24,32,.96),rgba(19,24,32,.62)),linear-gradient(0deg,rgba(11,14,19,.45),transparent 55%); }
    .home-hero h1 { font-size: clamp(2.15rem,11vw,3.2rem); }
    .show-details-grid { grid-template-columns: minmax(0, 110px) minmax(0, 1fr); gap: .9rem; padding: .85rem; }
    .show-meta-list { grid-column: 1 / -1; }
    .show-info-box { align-self: start; }
    .show-title, h1 { font-size: clamp(1.45rem, 7vw, 2rem); }
    .show-synopsis { font-size: .9rem; line-height: 1.6; }
    .episodes-section, .recommendations-section, .category-page-section { padding: .9rem; }
    .recommendations-grid, .media-grid { grid-template-columns: repeat(auto-fill, minmax(125px, 1fr)); gap: .7rem; }
  }
</style>`;

function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function padZero(num) {
    return String(num).padStart(2, '0');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function getSafeExternalUrl(value) {
    const url = getHttpUrl(value);
    return url ? escapeHtml(url) : '';
}

function getHttpUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch (error) {
        return '';
    }
}

function serializeJsonLd(value) {
    return JSON.stringify(value)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026');
}

function safeReplace(template, searchValue, replacement) {
    return template.replace(new RegExp(searchValue, 'g'), () => replacement);
}

function getDynamicOverview(item) {
    if (item.overview) return item.overview;
    if (item.description) return item.description;
    if (Array.isArray(item.episodes) && item.episodes.length > 0 && item.episodes[0].description) {
        return item.episodes[0].description;
    }
    return 'No overview available.';
}

function getAllContent() {
    if (!fs.existsSync(MOVIES_DIR)) return [];

    return fs.readdirSync(MOVIES_DIR)
        .filter(file => path.extname(file) === '.json')
        .flatMap(file => {
            try {
                const item = JSON.parse(fs.readFileSync(path.join(MOVIES_DIR, file), 'utf8'));
                return item.slug ? [item] : [];
            } catch (error) {
                console.error(`Error reading content from ${file}:`, error);
                return [];
            }
        });
}

function isMovie(item) {
    return item.media_type === 'movie' || !Array.isArray(item.episodes);
}

function getContentUrl(item) {
    const slug = encodeURIComponent(item.slug || slugify(item.title));
    return `/${isMovie(item) ? 'movies' : 'series'}/${slug}`;
}

function getRecommendations(currentItem, limit = RECOMMENDATION_LIMIT) {
    const currentGenres = new Set((Array.isArray(currentItem.genres) ? currentItem.genres : []).map(slugify));
    return getAllContent()
        .filter(item => item.slug !== currentItem.slug)
        .map(item => {
            const genres = Array.isArray(item.genres) ? item.genres : [];
            const overlap = genres.reduce((count, genre) =>
                count + Number(currentGenres.has(slugify(genre))), 0);
            return { item, overlap, sameType: isMovie(item) === isMovie(currentItem) ? 1 : 0 };
        })
        .sort((a, b) =>
            b.overlap - a.overlap ||
            b.sameType - a.sameType ||
            String(a.item.title || '').localeCompare(String(b.item.title || ''))
        )
        .slice(0, limit)
        .map(({ item }) => item);
}

function renderRecommendationCards(items) {
    return items.map(item => {
        const title = escapeHtml(item.title || 'Untitled');
        const poster = escapeHtml(item.poster || item.posters?.[0] || item.backdrop || '');
        return `
                    <a class="recommendation-card" href="${getContentUrl(item)}">
                        <div class="recommendation-poster-wrap"><img class="recommendation-img" alt="${title} poster" loading="lazy" src="${poster}"></div>
                        <div class="recommendation-title">${title}</div>
                    </a>`;
    }).join('');
}

function renderCast(item) {
    if (!Array.isArray(item.cast) || item.cast.length === 0) return '';

    const members = item.cast.map(person => {
        const name = escapeHtml(person.name || 'Cast member');
        const character = escapeHtml(person.character || '');
        const imageUrl = getSafeExternalUrl(person.profile_path);
        const image = imageUrl
            ? `<img src="${imageUrl}" alt="${name}" loading="lazy">`
            : '';
        const photo = `<span class="cast-photo">${image}</span>`;
        const linkedPhoto = imageUrl
            ? `<a href="${imageUrl}" target="_blank" rel="noopener noreferrer" aria-label="View ${name} image">${photo}</a>`
            : photo;

        return `<div class="cast-member">${linkedPhoto}<span class="cast-name">${name}</span>${character ? `<span class="cast-character">${character}</span>` : ''}</div>`;
    }).join('');

    return `<section class="cast-section" aria-label="Cast"><h2 class="metadata-heading">Cast</h2><div class="cast-list">${members}</div></section>`;
}

function renderTrailer(item) {
    const trailerUrl = getSafeExternalUrl(item.trailer_url);
    if (!trailerUrl) return '';
    return `<a class="trailer-card" href="${trailerUrl}" target="_blank" rel="noopener noreferrer" aria-label="Watch trailer for ${escapeHtml(item.title || 'this title')}"><span class="trailer-play" aria-hidden="true">&#9654;</span><span class="trailer-label">Watch trailer</span></a>`;
}

function renderWatchProviders(item) {
    if (!Array.isArray(item.watch_providers) || item.watch_providers.length === 0) return '';

    const providers = item.watch_providers.map(provider => {
        const name = escapeHtml(provider.provider_name || 'Watch provider');
        const logoUrl = getSafeExternalUrl(provider.logo_path);
        const linkUrl = getSafeExternalUrl(provider.link);
        const logo = logoUrl
            ? `<img class="provider-logo" src="${logoUrl}" alt="${name}" loading="lazy">`
            : '';
        const content = `${logo}<span class="provider-name">${name}</span>`;
        return linkUrl
            ? `<a class="provider-item" href="${linkUrl}" target="_blank" rel="noopener noreferrer">${content}</a>`
            : `<span class="provider-item">${content}</span>`;
    }).join('');

    return `<div class="providers-section"><h3 class="metadata-heading">Where to watch</h3><div class="provider-list">${providers}</div></div>`;
}

function renderSiteHeader() {
    return `
    <header class="site-header">
        <div class="app-shell header-container">
            <a class="brand-logo" href="/">
                <span class="logo-wrapper"><img src="/logo.svg" alt="" class="logo-icon"><span>${BRAND_NAME}</span></span>
            </a>
            <nav class="desktop-nav" aria-label="Primary">
                <a href="/">Home</a>
                <a href="/series">Series</a>
                <a href="/movies">Movies</a>
                <a href="/sports">Sports</a>
            </nav>
        </div>
    </header>`;
}

function renderSiteFooter() {
    return `
<footer class="site-footer">
    <div class="app-shell footer-container">
        <div class="footer-brand">
            <a class="brand-logo" href="/">
                <img src="/logo.svg" alt="" class="logo-icon">
                <span>${BRAND_NAME}</span>
            </a>
            <p>TVBO is a browsable guide to films, series, episodes, and selected sports listings, with key details gathered in one place.</p>
        </div>
        <div class="footer-summary">
            <p>Explore a considered catalogue with episode guides, cast details, release information, and related recommendations close at hand.</p>
            <p>External playback options are provided by separate services and may change independently of TVBO.</p>
        </div>
        <div class="footer-links-grid">
            <div class="footer-col">
                <h4>The catalogue</h4>
                <ul>
                    <li><a href="/movies">Films</a></li>
                    <li><a href="/series">Series</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Small print</h4>
                <ul>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/terms">Terms</a></li>
                    <li><a href="/privacy">Privacy</a></li>
                    <li><a href="/cookies">Cookies</a></li>
                    <li><a href="/report-content">Report content</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${DISPLAY_YEAR} ${BRAND_NAME}. All rights reserved.</p>
        </div>
    </div>
</footer>
${AD_BANNERS}`;
}

function renderMediaCards(items) {
    return items.map(item => {
        const title = escapeHtml(item.title || 'Untitled');
        const poster = escapeHtml(item.poster || item.posters?.[0] || item.backdrop || '');
        return `
            <a class="media-card" href="${getContentUrl(item)}">
                <div class="poster-wrap"><img src="${poster}" alt="${title} poster" loading="lazy"></div>
                <div class="card-info"><h3>${title}</h3><span class="watch-btn">View details</span></div>
            </a>`;
    }).join('');
}

function renderHomePage() {
    const items = getAllContent();
    const getRating = item => {
        const rating = Number(item.rating ?? item.vote_average ?? 0);
        return Number.isFinite(rating) ? rating : 0;
    };
    const sortedItems = items.sort((a, b) =>
        getRating(b) - getRating(a) ||
        String(a.title || '').localeCompare(String(b.title || ''))
    );
    const movies = sortedItems.filter(isMovie);
    const series = sortedItems.filter(item => !isMovie(item));
    const featuredItem = sortedItems[0];
    const featuredTitle = escapeHtml(featuredItem?.title || 'Stories worth discovering');
    const featuredOverview = escapeHtml(featuredItem
        ? getDynamicOverview(featuredItem)
        : 'Explore films, series, episode guides, cast details, and selected sports listings in one considered catalogue.');
    const featuredImage = getSafeExternalUrl(
        featuredItem?.backdrop || featuredItem?.poster || featuredItem?.posters?.[0] || ''
    );
    const featuredUrl = featuredItem ? getContentUrl(featuredItem) : '/movies';
    const genres = [...new Set(items.flatMap(item =>
        Array.isArray(item.genres) ? item.genres.filter(genre => typeof genre === 'string') : []
    ))]
        .sort((a, b) => a.localeCompare(b))
        .slice(0, 10);
    const renderHomeSection = (title, description, list, href, linkLabel, showAll = false) => `
        <section class="home-section">
            <header class="home-section-header">
                <div><h2>${title}</h2><p>${description}</p></div>
                <a class="home-section-link" href="${href}">${linkLabel} &rarr;</a>
            </header>
            <div class="media-grid">${list.length
                ? renderMediaCards(showAll ? list : list.slice(0, 8))
                : '<p class="home-empty-state">New titles will appear here as the catalogue grows.</p>'}
            </div>
        </section>`;

    return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="msvalidate.01" content="F5308A5AD4F907B86D9811208128F708">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48">
    <link rel="icon" href="/logo.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/favicon.png">
    <title>Discover movies, series &amp; sports — ${BRAND_NAME}</title>
    <meta name="description" content="Discover films, series, episode guides, cast details, and selected sports listings on ${BRAND_NAME}.">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${DOMAIN}/">
    <meta property="og:title" content="Discover movies, series &amp; sports — ${BRAND_NAME}">
    <meta property="og:description" content="A considered guide to films, series, episodes, and selected sports listings.">
    <meta property="og:site_name" content="${BRAND_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Discover movies, series &amp; sports — ${BRAND_NAME}">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "${DOMAIN}/#website",
          "url": "${DOMAIN}/",
          "name": "${BRAND_NAME}"
        },
        {
          "@type": "Organization",
          "@id": "${DOMAIN}/#organization",
          "name": "${BRAND_NAME}",
          "url": "${DOMAIN}/",
          "logo": {
            "@type": "ImageObject",
            "url": "${DOMAIN}/logo.svg"
          }
        }
      ]
    }
    </script>
    ${PAGE_STYLES}
</head>
<body>
    ${renderSiteHeader()}
    <main class="site-main">
        <section class="home-hero" aria-labelledby="home-title">
            ${featuredImage ? `<div class="home-hero-art"><img src="${featuredImage}" alt="" fetchpriority="high"></div>` : ''}
            <div class="home-hero-copy">
                <span class="home-eyebrow">${featuredItem ? 'Featured discovery' : 'Welcome to TVBO'}</span>
                <h1 id="home-title">${featuredTitle}</h1>
                <p>${featuredOverview}</p>
                <div class="home-actions">
                    <a class="primary-button" href="${featuredUrl}">${featuredItem ? 'Explore title' : 'Browse movies'}</a>
                    <a class="home-secondary-button" href="/sports">Explore sports</a>
                </div>
            </div>
        </section>
        ${renderHomeSection('Movies', 'Films to add to your watchlist.', movies, '/movies', 'Browse movies', true)}
        ${renderHomeSection('Series', 'Find a new series and explore its episodes.', series, '/series', 'Browse series')}
        ${genres.length ? `
        <section class="home-section">
            <header class="home-section-header">
                <div><h2>Browse by genre</h2><p>Start with the kind of story you are in the mood for.</p></div>
            </header>
            <nav class="home-genres" aria-label="Browse genres">
                ${genres.map(genre => `<a href="/category/${encodeURIComponent(slugify(genre))}">${escapeHtml(genre)}</a>`).join('')}
            </nav>
        </section>` : ''}
    </main>
    ${renderSiteFooter()}
</body>
</html>`;
}

const htmlTemplate = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="msvalidate.01" content="F5308A5AD4F907B86D9811208128F708" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48">
    <link rel="icon" href="/logo.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/favicon.png">
    <title>{{PAGE_TITLE}}</title>
    <meta name="description" content="{{SERIES_TITLE}} — {{SERIES_OVERVIEW}} Episode guide, cast information, and related titles on {{BRAND_NAME}}.">
    <meta name="application-name" content="{{BRAND_NAME}}">
    <meta name="keywords" content="{{SERIES_KEYWORDS}}">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1">

    <link rel="canonical" href="{{CANONICAL_URL}}">
    <link rel="alternate" hreflang="en" href="{{CANONICAL_URL}}">
    <link rel="alternate" hreflang="x-default" href="{{CANONICAL_URL}}">

    <meta property="og:title" content="{{PAGE_TITLE}}">
    <meta property="og:description" content="{{SERIES_TITLE}} — {{SERIES_OVERVIEW}} Episode guide, cast information, and related titles on {{BRAND_NAME}}.">
    <meta property="og:url" content="{{CANONICAL_URL}}">
    <meta property="og:site_name" content="{{BRAND_NAME}}">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" content="{{POSTER_IMAGE_1}}">
    <meta property="og:image" content="{{POSTER_IMAGE_2}}">
    <meta property="og:type" content="video.tv_show">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{PAGE_TITLE}}">
    <meta name="twitter:description" content="{{SERIES_TITLE}} — {{SERIES_OVERVIEW}} Episode guide, cast information, and related titles on {{BRAND_NAME}}.">
    <meta name="twitter:image" content="{{POSTER_IMAGE_1}}">

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TVSeries",
      "@id": "{{SCHEMA_ID}}",
      "url": "{{CANONICAL_URL}}",
      "name": "{{SERIES_TITLE}}",
      "inLanguage": "{{IN_LANGUAGE}}",
      "description": "{{SERIES_OVERVIEW}}",
      "image": [
        "{{POSTER_IMAGE_1}}",
        "{{POSTER_IMAGE_2}}"
      ],
      "genre": [{{GENRE_ARRAY}}],
      "datePublished": "{{DATE_PUBLISHED}}"{{AGGREGATE_RATING}}
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "{{HOME_URL}}/"},
        {"@type": "ListItem", "position": 2, "name": "Series", "item": "{{HOME_URL}}/series"},
        {"@type": "ListItem", "position": 3, "name": "{{SERIES_TITLE}}", "item": "{{CANONICAL_URL}}"}
      ]
    }
    </script>
    ${PAGE_STYLES}
</head>
<body class="site-body">
    <header class="site-header">
        <div class="app-shell header-container">
            <a class="brand-logo" href="{{HOME_URL}}/">
                <span class="logo-wrapper">
                    <img src="/logo.svg" alt="{{BRAND_NAME}} Logo" class="logo-icon">
                    <span class="brand-name">{{BRAND_NAME}}</span>
                </span>
            </a>
            <nav class="desktop-nav" aria-label="Primary">
                <a href="{{HOME_URL}}/">Home</a>
                <a href="{{HOME_URL}}/series">Series</a>
                <a href="{{HOME_URL}}/movies">Movies</a>
                <a href="{{HOME_URL}}/sports">Sports</a>
            </nav>
        </div>
    </header>

    <main class="site-main">

        <div class="app-shell-watch content-container">
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
                <a href="{{HOME_URL}}/">Home</a>
                <span class="separator">/</span>
                <a href="{{HOME_URL}}/series">Series</a>
                <span class="separator">/</span>
                <span class="current">{{SERIES_TITLE}}</span>
            </nav>

            <section class="show-hero-section">
                <article class="show-details-grid">
                    <div class="show-poster-box">
                        <div class="poster-wrapper">
                            <img alt="{{SERIES_TITLE}} poster" class="poster-image" loading="lazy" src="{{POSTER_IMAGE_1}}">
                            <span class="show-rating-badge">{{RATING_VALUE_FORMATTED}}</span>
                        </div>
                        <dl class="show-meta-list">
                            <div class="meta-item">
                                <dt>Year</dt>
                                <dd>{{DISPLAY_YEAR}}</dd>
                            </div>
                            <div class="meta-item">
                                <dt>Seasons</dt>
                                <dd>{{TOTAL_SEASONS}}</dd>
                            </div>
                            <div class="meta-item">
                                <dt>Episodes</dt>
                                <dd>{{TOTAL_EPISODES}}</dd>
                            </div>
                            <div class="meta-item">
                                <dt>Genres</dt>
                                <dd class="genre-tags">
                                    {{GENRES_TEXT}}
                                </dd>
                            </div>
                            <div class="meta-item">
                                <dt>Quality</dt>
                                <dd>HD · full seasons</dd>
                            </div>
                        </dl>
                    </div>
                    <div class="show-info-box">
                        <span class="category-tag">Series</span>
                        <h1 class="show-title">{{PAGE_TITLE}}</h1>
                        <div class="title-divider"></div>
                        <p class="show-synopsis">{{SERIES_OVERVIEW}}</p>
                        {{SERIES_CAST}}
                        {{SERIES_TRAILER}}
                    </div>
                </article>
            </section>

            <section class="episodes-section">
                {{WATCH_PROVIDERS_HTML}}
                <header class="section-header-flex">
                    <h2 class="section-title">Episodes</h2>
                    <p class="episode-count-label">{{TOTAL_EPISODES}} episodes</p>
                </header>
                <div class="section-divider"></div>

                {{SEASONS_HTML}}
            </section>

            <section class="recommendations-section">
                <header class="section-header-flex"><h2 class="section-title">Recommended movies and series</h2><p class="section-subtitle">{{RECOMMENDATION_COUNT}} recommendations</p></header>
                <div class="recommendations-grid">
                    {{RECOMMENDATIONS_HTML}}
                </div>
            </section>
        </div>
    </main>

    ${renderSiteFooter()}
</body>
</html>`;

function renderSeriesPage(requestedSlug) {
    if (!fs.existsSync(MOVIES_DIR)) return null;

    const files = fs.readdirSync(MOVIES_DIR).filter(file => path.extname(file) === '.json');
    let matchedShow = null;

    for (const file of files) {
        try {
            const rawData = fs.readFileSync(path.join(MOVIES_DIR, file), 'utf8');
            const show = JSON.parse(rawData);
            const showSlug = show.slug || slugify(show.title);
            if (showSlug === requestedSlug) {
                if (show.media_type === 'movie' || !Array.isArray(show.episodes)) return null;
                matchedShow = show;
                break;
            }
        } catch (parseErr) {
            console.error(`Error parsing JSON from ${file}:`, parseErr);
        }
    }

    if (!matchedShow) return null;

    const show = matchedShow;
    const slug = show.slug || slugify(show.title);
    const canonicalUrl = `${DOMAIN}/series/${encodeURIComponent(slug)}`;
    const homeUrl = DOMAIN;
    const schemaId = `${canonicalUrl}#series`;

    const safeTitle = escapeHtml(show.title);
    const pageTitle = escapeHtml(`TV Show ${show.title} — Watch Free Online, Full Seasons in HD - ${BRAND_NAME}`);
    const rawOverview = getDynamicOverview(show);
    const safeOverview = escapeHtml(rawOverview);

    const genres = show.genres || [];
    const genreArrayJson = genres.map(g => `"${escapeHtml(g)}"`).join(', ');
    const episodes = Array.isArray(show.episodes) ? show.episodes : [];
    const seasons = new Map();
    episodes.forEach((episode, index) => {
        const seasonNumber = episode.season_number || episode.season || 1;
        const seasonEpisodes = seasons.get(seasonNumber) || [];
        seasonEpisodes.push({ episode, index });
        seasons.set(seasonNumber, seasonEpisodes);
    });
    const seasonsHtml = Array.from(seasons.entries())
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([seasonNumber, seasonEpisodes]) => `
                <div class="season-container">
                    <header class="season-header">
                        <h3 class="season-title">Season ${escapeHtml(seasonNumber)}</h3>
                        <span class="season-ep-count">${seasonEpisodes.length} episodes</span>
                    </header>
                    <ol class="episode-grid">
                        ${seasonEpisodes.map(({ episode, index }) => {
                            const episodeNumber = episode.episode_number || episode.number || index + 1;
                            const episodeTitle = escapeHtml(episode.name || `Episode ${episodeNumber}`);
                            const description = episode.description || episode.overview || '';
                            const episodeDescription = escapeHtml(description);
                            const episodeUrl = `${canonicalUrl}/season/${seasonNumber}/episode/${episodeNumber}`;
                            return `
                        <li>
                            <a class="episode-card" href="${episodeUrl}" aria-label="Watch: ${episodeTitle}">
                                <span class="episode-number" aria-hidden="true">${padZero(episodeNumber)}</span>
                                <div class="episode-content">
                                    <div class="episode-tags"><span class="badge-ep">S${escapeHtml(seasonNumber)} · E${escapeHtml(episodeNumber)}</span></div>
                                    <h4 class="episode-name" title="${episodeTitle}">${episodeTitle}</h4>
                                    <p class="episode-desc ${description ? '' : 'italic'}" title="${episodeDescription}">${episodeDescription || 'Episode details coming soon.'}</p>
                                </div>
                            </a>
                        </li>`;
                        }).join('')}
                    </ol>
                </div>`)
        .join('');
    const recommendedItems = getRecommendations(show);
    const recommendationsHtml = renderRecommendationCards(recommendedItems);

    const ratingValue = show.rating ?? show.vote_average ?? 9;
    const numericRatingValue = Number(ratingValue);
    const rawRatingCount = show.ratingCount ?? show.rating_count ?? show.vote_count ?? show.voteCount ?? show.votes;
    const numericRatingCount = Number(rawRatingCount);
    const aggregateRating = rawRatingCount !== undefined
        && rawRatingCount !== null
        && rawRatingCount !== ''
        && Number.isFinite(numericRatingValue)
        && Number.isSafeInteger(numericRatingCount)
        && numericRatingCount > 0
        ? `,"aggregateRating":${JSON.stringify({
            '@type': 'AggregateRating',
            ratingValue: numericRatingValue,
            ratingCount: numericRatingCount,
            bestRating: show.bestRating ?? 10,
            worstRating: show.worstRating ?? 0
        })}`
        : '';
    const datePublished = show.year || show.first_air_date || new Date().getFullYear();
    const seasonsCount = seasons.size || show.seasonsCount || show.number_of_seasons || 1;

    let pageContent = htmlTemplate;
    pageContent = safeReplace(pageContent, '\{\{PAGE_TITLE\}\}', pageTitle);
    pageContent = safeReplace(pageContent, '\{\{SERIES_TITLE\}\}', safeTitle);
    pageContent = safeReplace(pageContent, '\{\{BRAND_NAME\}\}', BRAND_NAME);
    pageContent = safeReplace(pageContent, '\{\{SERIES_OVERVIEW\}\}', safeOverview);
    pageContent = safeReplace(pageContent, '\{\{SERIES_CAST\}\}', renderCast(show));
    pageContent = safeReplace(pageContent, '\{\{SERIES_TRAILER\}\}', renderTrailer(show));
    pageContent = safeReplace(pageContent, '\{\{WATCH_PROVIDERS_HTML\}\}', renderWatchProviders(show));
    pageContent = safeReplace(pageContent, '\{\{SERIES_KEYWORDS\}\}', escapeHtml(genres.join(', ')));
    pageContent = safeReplace(pageContent, '\{\{CANONICAL_URL\}\}', canonicalUrl);
    pageContent = safeReplace(pageContent, '\{\{POSTER_IMAGE_1\}\}', show.posters?.[0] || show.poster || show.backdrop || '');
    pageContent = safeReplace(pageContent, '\{\{POSTER_IMAGE_2\}\}', show.posters?.[1] || show.backdrop || show.posters?.[0] || show.poster || '');
    pageContent = safeReplace(pageContent, '\{\{SCHEMA_ID\}\}', schemaId);
    pageContent = safeReplace(pageContent, '\{\{IN_LANGUAGE\}\}', show.inLanguage || show.original_language || 'en');
    pageContent = safeReplace(pageContent, '\{\{GENRE_ARRAY\}\}', genreArrayJson);
    pageContent = safeReplace(pageContent, '\{\{DATE_PUBLISHED\}\}', datePublished);
    pageContent = safeReplace(pageContent, '\{\{DISPLAY_YEAR\}\}', DISPLAY_YEAR);
    pageContent = safeReplace(pageContent, '\{\{AGGREGATE_RATING\}\}', aggregateRating);
    pageContent = safeReplace(pageContent, '\{\{RATING_VALUE_FORMATTED\}\}', Number(ratingValue).toFixed(1));
    pageContent = safeReplace(pageContent, '\{\{HOME_URL\}\}', homeUrl);
    pageContent = safeReplace(pageContent, '\{\{TOTAL_SEASONS\}\}', seasonsCount);
    pageContent = safeReplace(pageContent, '\{\{TOTAL_EPISODES\}\}', episodes.length);
    pageContent = safeReplace(pageContent, '\{\{GENRES_TEXT\}\}', escapeHtml(genres.join(', ')));
    pageContent = safeReplace(pageContent, '\{\{CURRENT_YEAR\}\}', DISPLAY_YEAR);
    pageContent = safeReplace(pageContent, '\{\{RECOMMENDATION_COUNT\}\}', recommendedItems.length);

    pageContent = safeReplace(pageContent, '\{\{SEASONS_HTML\}\}', seasonsHtml || '<p>No episodes available.</p>');
    pageContent = safeReplace(pageContent, '\{\{RECOMMENDATIONS_HTML\}\}', recommendationsHtml);

    return pageContent;
}

// Helper function to render category listing pages dynamically
function renderCategoryPage(requestedCategorySlug) {
    if (!fs.existsSync(MOVIES_DIR)) return null;

    const files = fs.readdirSync(MOVIES_DIR).filter(file => path.extname(file) === '.json');
    const matchedItems = [];
    let matchedCategoryName = requestedCategorySlug;

    for (const file of files) {
        try {
            const rawData = fs.readFileSync(path.join(MOVIES_DIR, file), 'utf8');
            const item = JSON.parse(rawData);
            const genres = item.genres || [];

            const matchedGenre = genres.find(g => slugify(g) === requestedCategorySlug.toLowerCase());
            if (matchedGenre) {
                matchedCategoryName = matchedGenre; // grab proper casing from data if available
                matchedItems.push(item);
            }
        } catch (err) {
            console.error(`Error parsing JSON from ${file}:`, err);
        }
    }

    if (matchedItems.length === 0) return null;

    const categoryTitle = escapeHtml(matchedCategoryName.charAt(0).toUpperCase() + matchedCategoryName.slice(1));
    const pageTitle = `${categoryTitle} Movies & Series - ${BRAND_NAME}`;

    return `<!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="msvalidate.01" content="F5308A5AD4F907B86D9811208128F708">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48">
        <link rel="icon" href="/logo.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/favicon.png">
        <title>${pageTitle}</title>
        <meta name="description" content="Explore ${matchedItems.length} movies and series in ${categoryTitle} on ${BRAND_NAME}.">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="${DOMAIN}/category/${encodeURIComponent(requestedCategorySlug)}">
        <meta property="og:title" content="${pageTitle}">
        <meta name="twitter:title" content="${pageTitle}">
        ${PAGE_STYLES}
    </head>
    <body>
        ${renderSiteHeader()}
        <main class="site-main">
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
                <a href="/">Home</a><span>/</span><span class="current">${categoryTitle}</span>
            </nav>
            <section class="category-page-section">
                <span class="page-tag">Category</span>
                <h1>${pageTitle}</h1>
                <p class="category-intro">Explore ${matchedItems.length} movies and series in ${categoryTitle}.</p>
                <div class="media-grid">${renderMediaCards(matchedItems)}</div>
            </section>
        </main>
        ${renderSiteFooter()}
    </body>
    </html>`;
}

function renderMoviePage(requestedSlug) {
    if (!fs.existsSync(MOVIES_DIR)) return null;

    const files = fs.readdirSync(MOVIES_DIR).filter(file => path.extname(file) === '.json');
    let movie = null;

    for (const file of files) {
        try {
            const rawData = fs.readFileSync(path.join(MOVIES_DIR, file), 'utf8');
            const item = JSON.parse(rawData);
            const itemSlug = item.slug || slugify(item.title);
            if (itemSlug === requestedSlug && (item.media_type === 'movie' || !Array.isArray(item.episodes))) {
                movie = item;
                break;
            }
        } catch (parseErr) {
            console.error(`Error parsing JSON from ${file}:`, parseErr);
        }
    }

    if (!movie) return null;

    const slug = movie.slug || slugify(movie.title);
    const mediaType = String(movie.media_type || 'movie').trim().toLowerCase();
    const mediaTypeMetadata = {
        movie: { label: 'Movie', schemaType: 'Movie', openGraphType: 'video.movie' },
        tv: { label: 'TV series', schemaType: 'TVSeries', openGraphType: 'video.tv_show' },
        series: { label: 'TV series', schemaType: 'TVSeries', openGraphType: 'video.tv_show' },
        tv_series: { label: 'TV series', schemaType: 'TVSeries', openGraphType: 'video.tv_show' }
    }[mediaType] || { label: mediaType || 'Title', schemaType: 'CreativeWork', openGraphType: 'website' };
    const rawTitle = String(movie.title || 'Untitled movie');
    const title = escapeHtml(rawTitle);
    const pageTitle = escapeHtml(`${rawTitle} — Watch ${mediaTypeMetadata.label} Online in HD | ${BRAND_NAME}`);
    const rawOverview = String(getDynamicOverview(movie));
    const overview = escapeHtml(rawOverview);
    const metaDescription = escapeHtml(
        `Discover ${rawTitle} on ${BRAND_NAME}. ${rawOverview} Explore its cast, genres, and movie details.`
    );
    const homeUrl = DOMAIN;
    const canonicalUrl = `${DOMAIN}/movies/${encodeURIComponent(slug)}`;
    const genres = Array.isArray(movie.genres)
        ? movie.genres.filter(genre => typeof genre === 'string' && genre.trim())
        : [];
    const posterUrl = getHttpUrl(movie.poster || movie.posters?.[0] || '');
    const backdropUrl = getHttpUrl(movie.backdrop || '');
    const poster = escapeHtml(posterUrl);
    const images = [...new Set([posterUrl, backdropUrl].filter(Boolean))];
    const releaseDate = String(movie.release_date || movie.first_air_date || '');
    const validReleaseDate = /^\d{4}-\d{2}-\d{2}$/.test(releaseDate) ? releaseDate : '';
    const releaseYear = validReleaseDate
        ? validReleaseDate.slice(0, 4)
        : /^\d{4}$/.test(String(movie.year || '')) ? String(movie.year) : '';
    const ratingValue = Number(movie.rating ?? movie.vote_average);
    const ratingCount = Number(movie.vote_count ?? movie.rating_count ?? movie.ratingCount);
    const ratingDisplay = Number.isFinite(ratingValue) && ratingValue > 0
        ? ratingValue.toFixed(1)
        : '';
    const aggregateRating = Number.isFinite(ratingValue) && ratingValue > 0
        && Number.isSafeInteger(ratingCount) && ratingCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue,
            ratingCount,
            bestRating: 10,
            worstRating: 0
        }
        : null;
    const movieSchema = {
        '@context': 'https://schema.org',
        '@type': mediaTypeMetadata.schemaType,
        '@id': `${canonicalUrl}#${mediaType}`,
        url: canonicalUrl,
        name: rawTitle,
        description: rawOverview,
        inLanguage: movie.original_language || movie.inLanguage || 'en',
        ...(images.length ? { image: images } : {}),
        ...(genres.length ? { genre: genres } : {}),
        ...(validReleaseDate ? { datePublished: validReleaseDate } : {}),
        ...(aggregateRating ? { aggregateRating } : {})
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${DOMAIN}/` },
            { '@type': 'ListItem', position: 2, name: 'Movies', item: `${DOMAIN}/movies` },
            { '@type': 'ListItem', position: 3, name: rawTitle, item: canonicalUrl }
        ]
    };
    const movieGenresHtml = genres.length > 0
        ? escapeHtml(genres.join(', '))
        : '<span>No genres listed</span>';
    const recommendedItems = getRecommendations(movie);
    const recommendationsHtml = renderRecommendationCards(recommendedItems);

    return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="msvalidate.01" content="F5308A5AD4F907B86D9811208128F708">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48">
    <link rel="icon" href="/logo.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/favicon.png">
    <title>${pageTitle}</title>
    <meta name="media-type" content="${escapeHtml(mediaType)}">
    <meta name="description" content="${metaDescription}">
    <meta name="application-name" content="${BRAND_NAME}">
    <meta name="keywords" content="${escapeHtml(genres.join(', '))}">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    <link rel="alternate" hreflang="en" href="${escapeHtml(canonicalUrl)}">
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(canonicalUrl)}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
    <meta property="og:site_name" content="${BRAND_NAME}">
    <meta property="og:locale" content="en_US">
    ${poster ? `<meta property="og:image" content="${poster}">` : ''}
    <meta property="og:type" content="${escapeHtml(mediaTypeMetadata.openGraphType)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDescription}">
    ${poster ? `<meta name="twitter:image" content="${poster}">` : ''}
    <script type="application/ld+json">${serializeJsonLd(movieSchema)}</script>
    <script type="application/ld+json">${serializeJsonLd(breadcrumbSchema)}</script>
    ${PAGE_STYLES}
</head>
<body>
    ${renderSiteHeader()}
    <main class="site-main">
        <div class="content-container">
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
                <a href="${homeUrl}/">Home</a><span>/</span><a href="${homeUrl}/movies">Movies</a><span>/</span><span class="current">${title}</span>
            </nav>
            <section class="show-hero-section">
                <article class="show-details-grid">
                    <div class="show-poster-box">
                        <div class="poster-wrapper"><img alt="${title} poster" class="poster-image" loading="lazy" src="${poster}"></div>
                        <dl class="show-meta-list">
                            ${releaseYear ? `<div class="meta-item"><dt>Year</dt><dd>${escapeHtml(releaseYear)}</dd></div>` : ''}
                            ${ratingDisplay ? `<div class="meta-item"><dt>Rating</dt><dd>${escapeHtml(ratingDisplay)}${Number.isSafeInteger(ratingCount) && ratingCount > 0 ? ` (${escapeHtml(ratingCount)} votes)` : ''}</dd></div>` : ''}
                            <div class="meta-item"><dt>Genres</dt><dd class="genre-tags">${movieGenresHtml}</dd></div>
                            <div class="meta-item"><dt>Quality</dt><dd>HD</dd></div>
                        </dl>
                    </div>
                    <div class="show-info-box">
                        <span class="category-tag">${escapeHtml(mediaTypeMetadata.label)}</span>
                        <h1 class="show-title">${title}</h1>
                        <div class="title-divider"></div>
                        <p class="show-synopsis">${overview}</p>
                        ${renderWatchProviders(movie)}
                        ${renderCast(movie)}
                        ${renderTrailer(movie)}
                        <div class="cta-row"><a class="primary-button" href="https://directyp.org/4/b8f2657af784ed0a625b01334530f610" target="_blank" rel="noopener noreferrer">Watch Movie</a></div>
                    </div>
                </article>
            </section>
            <section class="recommendations-section">
                <header class="section-header-flex"><h2 class="section-title">Recommended movies and series</h2><p class="section-subtitle">${recommendedItems.length} recommendations</p></header>
                <div class="recommendations-grid">${recommendationsHtml}</div>
            </section>
        </div>
    </main>
    ${renderSiteFooter()}
</body>
</html>`;
}

function getSportEvents() {
    if (!fs.existsSync(SPORT_DATA_DIR)) return [];

    return fs.readdirSync(SPORT_DATA_DIR)
        .filter(file => path.extname(file).toLowerCase() === '.json')
        .flatMap(file => {
            try {
                const event = JSON.parse(fs.readFileSync(path.join(SPORT_DATA_DIR, file), 'utf8'));
                const title = event?.meta?.event_title;
                if (typeof title !== 'string' || !title.trim()) return [];

                const fileSlug = path.basename(file, path.extname(file)).replace(/[_\s]+/g, '-');
                return [{ event, file, slug: slugify(fileSlug) || slugify(title) }];
            } catch (error) {
                console.error(`Error reading sports event from ${file}:`, error);
                return [];
            }
        })
        .sort((a, b) =>
            String(a.event.meta.target_date || '').localeCompare(String(b.event.meta.target_date || '')) ||
            String(a.event.meta.event_title).localeCompare(String(b.event.meta.event_title))
        );
}

function getSportAssetUrl(value, size = 'w500') {
    if (typeof value !== 'string' || !value.trim()) return '';
    const assetUrl = /^https?:\/\//i.test(value)
        ? value
        : value.startsWith('/')
            ? `https://image.tmdb.org/t/p/${size}/${value.replace(/^\/+/, '')}`
            : '';
    return getSafeExternalUrl(assetUrl);
}

function getSportPoster(event) {
    const sportsDbEvent = Array.isArray(event.thesportsdb_data) ? event.thesportsdb_data[0] : null;
    const tmdbItem = Array.isArray(event.tmdb_data) ? event.tmdb_data[0] : null;
    return event.visuals?.poster_path ||
        sportsDbEvent?.strPoster ||
        sportsDbEvent?.strThumb ||
        tmdbItem?.poster_path ||
        event.visuals?.backdrop_path ||
        tmdbItem?.backdrop_path ||
        '';
}

function getSportOverview(event) {
    const sportsDbEvent = Array.isArray(event.thesportsdb_data) ? event.thesportsdb_data[0] : null;
    const tmdbItem = Array.isArray(event.tmdb_data) ? event.tmdb_data[0] : null;
    return sportsDbEvent?.strDescriptionEN ||
        sportsDbEvent?.strResult ||
        tmdbItem?.overview ||
        'Event details have not been published yet.';
}

function getSportEventType(event) {
    const sportsDbEvent = Array.isArray(event.thesportsdb_data) ? event.thesportsdb_data[0] : null;
    return sportsDbEvent?.strLeague || sportsDbEvent?.strSport || 'Sports event';
}

function getSportEventUrl(item) {
    return `/sports/${encodeURIComponent(item.slug)}`;
}

function renderSportsIndexPage() {
    const events = getSportEvents();
    const cards = events.map(item => {
        const event = item.event;
        const title = escapeHtml(event.meta.event_title);
        const poster = getSportAssetUrl(getSportPoster(event));
        const date = escapeHtml(event.meta.target_date || '');
        const type = escapeHtml(getSportEventType(event));
        return `
            <a class="media-card" href="${getSportEventUrl(item)}">
                <div class="poster-wrap">${poster ? `<img src="${poster}" alt="${title} poster" loading="lazy">` : ''}</div>
                <div class="card-info">
                    <h3>${title}</h3>
                    <span class="meta-tag">${type}</span>
                    ${date ? `<span class="section-subtitle">${date}</span>` : ''}
                </div>
            </a>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="msvalidate.01" content="F5308A5AD4F907B86D9811208128F708">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48">
    <link rel="icon" href="/logo.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/favicon.png">
    <title>Sports events — ${BRAND_NAME}</title>
    <meta name="description" content="Browse sports events and event details on ${BRAND_NAME}.">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${DOMAIN}/sports">
    ${PAGE_STYLES}
</head>
<body>
    ${renderSiteHeader()}
    <main class="site-main">
        <nav class="breadcrumb-nav" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span class="current">Sports</span></nav>
        <section class="category-page-section">
            <span class="page-tag">Sports</span>
            <h1>Sports events</h1>
            <p class="category-intro">Browse ${events.length} sports events.</p>
            <div class="media-grid">${cards || '<p>No sports events found.</p>'}</div>
        </section>
    </main>
    ${renderSiteFooter()}
</body>
</html>`;
}

function renderSportPage(requestedSlug) {
    const requested = slugify(String(requestedSlug).replace(/_/g, '-'));
    const item = getSportEvents().find(({ event, file, slug }) => {
        const generatedFile = event.meta.generated_filename;
        const generatedSlug = typeof generatedFile === 'string'
            ? slugify(path.basename(generatedFile, path.extname(generatedFile)).replace(/_/g, '-'))
            : '';
        return slug === requested ||
            generatedSlug === requested ||
            slugify(event.meta.event_title) === requested ||
            slugify(path.basename(file, path.extname(file)).replace(/_/g, '-')) === requested;
    });
    if (!item) return null;

    const event = item.event;
    const title = escapeHtml(event.meta.event_title);
    const sportsDbEvent = Array.isArray(event.thesportsdb_data) ? event.thesportsdb_data[0] : null;
    const targetDate = event.meta.target_date || sportsDbEvent?.dateEvent || '';
    const timestampTime = sportsDbEvent?.strTimestamp?.split('T')[1];
    const eventTime = sportsDbEvent?.strTime && sportsDbEvent.strTime !== '00:00:00'
        ? sportsDbEvent.strTime
        : timestampTime !== '00:00:00' ? timestampTime || '' : '';
    const location = [sportsDbEvent?.strCity, sportsDbEvent?.strCountry].filter(Boolean).join(', ');
    const details = [
        ['Date', targetDate],
        ['Time', eventTime],
        ['Promotion', sportsDbEvent?.strLeague],
        ['Venue', sportsDbEvent?.strVenue],
        ['Location', location]
    ].filter(([, value]) => typeof value === 'string' && value.trim());
    const detailHtml = details.map(([label, value]) => `
        <div class="meta-item"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
    const overview = escapeHtml(getSportOverview(event));
    const poster = getSportAssetUrl(getSportPoster(event));
    const backdrop = getSportAssetUrl(event.visuals?.backdrop_path || '');
    const canonicalUrl = `${DOMAIN}${getSportEventUrl(item)}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="msvalidate.01" content="F5308A5AD4F907B86D9811208128F708">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48">
    <link rel="icon" href="/logo.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/favicon.png">
    <title>${title} — ${BRAND_NAME}</title>
    <meta name="description" content="${overview}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    <meta property="og:title" content="${title} — ${BRAND_NAME}">
    <meta property="og:description" content="${overview}">
    ${backdrop ? `<meta property="og:image" content="${backdrop}">` : ''}
    ${PAGE_STYLES}
</head>
<body>
    ${renderSiteHeader()}
    <main class="site-main">
        <div class="content-container">
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
                <a href="/">Home</a><span>/</span><a href="/sports">Sports</a><span>/</span><span class="current">${title}</span>
            </nav>
            <section class="show-hero-section">
                <article class="show-details-grid">
                    ${poster ? `<div class="show-poster-box"><div class="poster-wrapper"><img alt="${title} poster" class="poster-image" loading="lazy" src="${poster}"></div></div>` : ''}
                    <div class="show-info-box">
                        <span class="category-tag">${escapeHtml(getSportEventType(event))}</span>
                        <h1 class="show-title">${title}</h1>
                        <div class="title-divider"></div>
                        <p class="show-synopsis sport-event-description">${overview}</p>
                        <dl class="sport-event-details">${detailHtml}</dl>
                    </div>
                </article>
            </section>
        </div>
    </main>
    ${renderSiteFooter()}
</body>
</html>`;
}

function renderCataloguePage(type) {
    const isMoviePage = type === 'movie';
    const items = getAllContent().filter(item => isMovie(item) === isMoviePage);
    const sectionTitle = isMoviePage ? 'Movies' : 'Series';
    const description = isMoviePage
        ? 'Browse films and movie details on TVBO.'
        : 'Browse series, episode guides, cast details, and recommendations on TVBO.';
    const pageTitle = `${sectionTitle} — ${BRAND_NAME}`;

    return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="msvalidate.01" content="F5308A5AD4F907B86D9811208128F708">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48">
    <link rel="icon" href="/logo.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/favicon.png">
    <title>${pageTitle}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${DOMAIN}/${isMoviePage ? 'movies' : 'series'}">
    ${PAGE_STYLES}
</head>
<body>
    ${renderSiteHeader()}
    <main class="site-main">
        <section class="category-page-section">
            <h1>${sectionTitle}</h1>
            <p class="category-intro">${description}</p>
            <div class="media-grid">${renderMediaCards(items) || `<p>No ${sectionTitle.toLowerCase()} found.</p>`}</div>
        </section>
    </main>
    ${renderSiteFooter()}
</body>
</html>`;
}

const INFO_PAGES = {
    about: {
        title: 'About TVBO',
        description: 'Learn about TVBO, a browsable guide to films, series, episodes, and selected sports listings.',
        content: `
            <p>TVBO is a straightforward guide for finding something to watch. We bring films, series, episode details, cast information, and selected sports listings together in one catalogue.</p>
            <h2>A catalogue made to browse</h2>
            <p>Explore titles by name, genre, or type, then open a title page for its available details and related recommendations. The catalogue changes as new information is added, so availability and listings can vary over time.</p>
            <h2>About viewing options</h2>
            <p>TVBO is a guide, not a video-hosting service. Where a title page lists an external viewing provider, that provider operates its own service and controls its content, availability, and terms. Following an external link takes you away from TVBO.</p>
            <h2>Using TVBO</h2>
            <p>You can browse the catalogue without creating an account. We aim to keep pages clear and usable across phones, computers, and other screen sizes.</p>
            <p>For questions, suggestions, or content concerns, visit our <a href="/contact">Contact page</a> or <a href="/report-content">Report content page</a>.</p>`
    },
    contact: {
        title: 'Contact TVBO',
        description: 'Contact TVBO with questions, feedback, or site-related concerns.',
        content: `
            <p>Have a question or feedback about TVBO? Email us at <a href="mailto:contact@tvbo.ccwu.cc">contact@tvbo.ccwu.cc</a>.</p>
            <h2>Content and viewing providers</h2>
            <p>TVBO is a catalogue and does not host the video streams offered by independent services. For a stream, account, or playback issue on another service, contact that provider directly. If a TVBO page contains a link that needs review, send us the page address and details through the email above or use <a href="/report-content">Report content</a>.</p>
            <p>Please do not send passwords, payment information, or other sensitive personal details by email.</p>`
    },
    terms: {
        title: 'Terms of Use',
        description: 'Terms for browsing and using the TVBO catalogue.',
        content: `
            <p><strong>Last updated: ${DISPLAY_YEAR}</strong></p>
            <h2>1. About TVBO</h2>
            <p>TVBO provides a catalogue of film and series information, episode guides, selected sports listings, and links to external services. TVBO does not operate or control those external services, and listings or links may change.</p>
            <h2>2. Using the site</h2>
            <p>By using TVBO, you agree to use the site lawfully and not to disrupt its operation, misuse its pages, or use links from it to infringe another person's rights. You are responsible for checking that your use complies with the laws that apply to you.</p>
            <h2>3. Third-party services and content</h2>
            <p>External providers have their own content, terms, privacy practices, and availability. A link on TVBO is provided for convenience and does not mean TVBO endorses or controls that provider. Any use of a third-party service is between you and that service.</p>
            <h2>4. Copyright and other rights</h2>
            <p>We respect intellectual-property rights. If you believe a catalogue entry or link raises a rights concern, see <a href="/report-content">Report content</a> for how to contact us. A TVBO listing does not establish ownership or permission for material offered by an external provider.</p>
            <h2>5. Availability and liability</h2>
            <p>We work to keep catalogue information useful, but do not promise that every detail is complete, current, uninterrupted, or error-free. To the extent allowed by applicable law, TVBO is provided as available, and we are not responsible for the operation or content of third-party services.</p>
            <h2>6. Changes</h2>
            <p>These terms may be updated as the site changes. The revised terms apply when published here. Please review this page periodically if you continue to use TVBO.</p>`
    },
    privacy: {
        title: 'Privacy Policy',
        description: 'How TVBO and the third-party services used on the site may process information.',
        content: `
            <p><strong>Last updated: ${DISPLAY_YEAR}</strong></p>
            <p>This policy explains what to keep in mind when browsing TVBO. The catalogue does not currently require an account or ask visitors to submit a profile to browse.</p>
            <h2>Information processed when you visit</h2>
            <p>Like other websites, the hosting and delivery systems used to serve TVBO may process basic technical information in connection with a request, such as an IP address, browser details, and the page requested. How long that information is retained depends on the services and configuration used to operate the site.</p>
            <h2>Advertising and external services</h2>
            <p>Some pages load advertising supplied by third parties. Clicking an external provider link also takes you to a service outside TVBO. Those third parties may collect information or use cookies under their own privacy policies; TVBO does not control their practices. Please review their notices directly.</p>
            <h2>Cookies and similar technologies</h2>
            <p>TVBO does not offer a visitor account or use a cookie-based saved profile. However, the site infrastructure and third-party advertising or linked services may use cookies or similar technologies. See our <a href="/cookies">Cookie Policy</a> for more detail.</p>
            <h2>Your choices and questions</h2>
            <p>You can manage cookies and tracking protections in your browser. For questions about this policy or TVBO, contact <a href="mailto:contact@tvbo.ccwu.cc">contact@tvbo.ccwu.cc</a>.</p>
            <h2>Policy updates</h2>
            <p>If our practices or this policy change, we will update this page and its revision date.</p>`
    },
    cookies: {
        title: 'Cookie Policy',
        description: 'Information about cookies and similar technologies used by TVBO and third parties.',
        content: `
            <p><strong>Last updated: ${DISPLAY_YEAR}</strong></p>
            <h2>What cookies are</h2>
            <p>Cookies are small pieces of information a website or service can store in your browser. Similar technologies may store or access information in other ways.</p>
            <h2>TVBO and third-party cookies</h2>
            <p>TVBO does not provide accounts or a cookie-based profile for saving your activity. The hosting systems that deliver the site may use necessary technologies to operate it. TVBO pages also load third-party advertising, and external services linked from the catalogue may use their own cookies or similar technologies. Those providers set their own practices and policies, which TVBO does not control.</p>
            <h2>Managing cookies</h2>
            <p>Most browsers let you review, block, or remove cookies in their privacy or security settings. Blocking some cookies may affect the operation of third-party content or services. For details about information handling, see our <a href="/privacy">Privacy Policy</a>.</p>`
    },
    'report-content': {
        title: 'Report content',
        description: 'How to report a TVBO catalogue entry or link that raises a copyright or content concern.',
        content: `
            <p>TVBO is a catalogue, not a video-hosting service. If a title page or link on TVBO raises a concern, email <a href="mailto:contact@tvbo.ccwu.cc">contact@tvbo.ccwu.cc</a> so we can review the listing.</p>
            <h2>Include these details</h2>
            <ul>
                <li>The URL of the TVBO page you are reporting.</li>
                <li>The title or material concerned and a short explanation of the issue.</li>
                <li>If you are reporting on behalf of a rights holder, a note explaining your authority to do so.</li>
                <li>An email address where we can reply if we need clarification.</li>
            </ul>
            <h2>What happens next</h2>
            <p>We will review the information and may contact you for more details. TVBO can review or remove its own catalogue references, but cannot remove material from an independent provider's service. For removal of a hosted stream, send a request to the provider that operates it.</p>
            <p>Please provide accurate information and avoid including sensitive personal data that is not needed to assess your report.</p>`
    }
};

function renderInfoPage(pageKey) {
    const page = INFO_PAGES[pageKey];
    if (!page) return null;

    const pageUrl = pageKey === 'report-content' ? 'report-content' : pageKey;
    return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="msvalidate.01" content="F5308A5AD4F907B86D9811208128F708">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48">
    <link rel="icon" href="/logo.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/favicon.png">
    <title>${page.title} — ${BRAND_NAME}</title>
    <meta name="description" content="${page.description}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${DOMAIN}/${pageUrl}">
    ${PAGE_STYLES}
</head>
<body>
    ${renderSiteHeader()}
    <main class="site-main">
        <article class="category-page-section">
            <span class="page-tag">${pageKey === 'report-content' ? 'Copyright & content' : 'TVBO information'}</span>
            <h1>${page.title}</h1>
            <div class="legal-copy">${page.content}</div>
        </article>
    </main>
    ${renderSiteFooter()}
</body>
</html>`;
}

function registerPageRoutes(app) {
    app.use(express.static(PUBLIC_DIR));

    app.use((req, res, next) => {
        if (req.path === '/en' || req.path.startsWith('/en/')) {
            const targetPath = req.path.replace(/^\/en(?=\/|$)/, '') || '/';
            return res.redirect(301, `${targetPath}${req.url.slice(req.path.length)}`);
        }
        next();
    });

    app.get('/robots.txt', (req, res) => {
        res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${DOMAIN}/sitemap.xml\n`);
    });

    app.get('/sitemap.xml', (req, res) => {
        const contentUrls = getAllContent().map(item => `${DOMAIN}${getContentUrl(item)}`);
        const categoryUrls = [...new Set(getAllContent().flatMap(item =>
            Array.isArray(item.genres)
                ? item.genres.map(genre => `${DOMAIN}/category/${encodeURIComponent(slugify(genre))}`)
                : []
        ))];
        const sportUrls = getSportEvents().map(item => `${DOMAIN}${getSportEventUrl(item)}`);
        const urls = [
            `${DOMAIN}/`,
            `${DOMAIN}/movies`,
            `${DOMAIN}/series`,
            `${DOMAIN}/sports`,
            ...Object.keys(INFO_PAGES).map(page => `${DOMAIN}/${page}`),
            ...contentUrls,
            ...categoryUrls,
            ...sportUrls
        ];
        const entries = [...new Set(urls)]
            .map(url => `<url><loc>${escapeHtml(url)}</loc></url>`)
            .join('');
        res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`);
    });

    app.get('/', (req, res) => {
        res.send(renderHomePage());
    });

    app.get('/movies', (req, res) => {
        res.send(renderCataloguePage('movie'));
    });

    app.get('/series', (req, res) => {
        res.send(renderCataloguePage('series'));
    });

    app.get('/sports', (req, res) => {
        res.send(renderSportsIndexPage());
    });

    for (const page of Object.keys(INFO_PAGES)) {
        app.get(`/${page}`, (req, res) => {
            res.send(renderInfoPage(page));
        });
    }

    app.get('/dmca', (req, res) => {
        res.redirect(301, '/report-content');
    });

    app.get('/sports/:slug', (req, res) => {
        const html = renderSportPage(req.params.slug);
        if (!html) return res.status(404).send('Sports event not found.');
        res.send(html);
    });

    app.get('/category/:slug', (req, res) => {
        const html = renderCategoryPage(req.params.slug);
        if (!html) return res.status(404).send('Category not found.');
        res.send(html);
    });

    app.get('/series/:slug', (req, res) => {
        const html = renderSeriesPage(req.params.slug);
        if (!html) return res.status(404).send('Series not found.');
        res.send(html);
    });

    app.get('/movies/:slug', (req, res) => {
        const html = renderMoviePage(req.params.slug);
        if (!html) return res.status(404).send('Movie not found.');
        res.send(html);
    });
}

const app = express();
registerPageRoutes(app);

module.exports = app;
module.exports.registerPageRoutes = registerPageRoutes;
module.exports.renderHomePage = renderHomePage;
module.exports.renderSeriesPage = renderSeriesPage;
module.exports.renderMoviePage = renderMoviePage;
module.exports.renderCategoryPage = renderCategoryPage;
module.exports.renderSportsIndexPage = renderSportsIndexPage;
module.exports.renderSportPage = renderSportPage;

if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`TVBO server listening on port ${port}`);
    });
}