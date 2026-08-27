const searchRoot = document.querySelector('[data-search]');
const input = searchRoot?.querySelector('.search__input');
const results = searchRoot?.querySelector('.search__results');

let index = [];
let visibleResults = [];
let activeIndex = -1;

function normalize(value) {
  return value.normalize('NFKC').toLocaleLowerCase('zh-CN');
}

function matchesQuery(entry, query) {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  const title = normalize(entry.title);
  const text = normalize(entry.text);
  return tokens.length > 0 && tokens.every((token) => title.includes(token) || text.includes(token));
}

function previewFor(entry, query) {
  const text = entry.text.replace(/\s+/g, ' ').trim();
  const token = normalize(query).split(/\s+/).find(Boolean) ?? '';
  const matchIndex = normalize(text).indexOf(token);
  const start = Math.max(0, matchIndex < 0 ? 0 : matchIndex - 42);
  const end = Math.min(text.length, start + 128);
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

function updateActiveResult() {
  const items = [...results.querySelectorAll('.search__result')];
  items.forEach((item, itemIndex) => {
    item.classList.toggle('search__result--active', itemIndex === activeIndex);
    item.setAttribute('aria-selected', itemIndex === activeIndex ? 'true' : 'false');
  });
  items[activeIndex]?.scrollIntoView({ block: 'nearest' });
}

function resultElement(entry, query) {
  const link = document.createElement('a');
  link.className = 'search__result';
  link.href = entry.url;
  link.setAttribute('role', 'option');

  const heading = document.createElement('span');
  heading.className = 'search__result-heading';

  const title = document.createElement('span');
  title.className = 'search__result-title';
  title.textContent = entry.title;

  const chapter = document.createElement('span');
  chapter.className = 'search__result-chapter';
  chapter.textContent = String(entry.order).padStart(2, '0');

  const preview = document.createElement('span');
  preview.className = 'search__result-preview';
  preview.textContent = previewFor(entry, query);

  heading.append(title, chapter);
  link.append(heading, preview);
  return link;
}

function renderResults() {
  const query = input.value.trim();
  results.replaceChildren();
  activeIndex = -1;

  if (!query) {
    results.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    return;
  }

  visibleResults = index
    .filter((entry) => matchesQuery(entry, query))
    .sort((left, right) => {
      const queryText = normalize(query);
      const leftTitleMatch = normalize(left.title).includes(queryText) ? 0 : 1;
      const rightTitleMatch = normalize(right.title).includes(queryText) ? 0 : 1;
      return leftTitleMatch - rightTitleMatch || left.order - right.order;
    })
    .slice(0, 12);

  if (visibleResults.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'search__empty';
    empty.textContent = '没有找到匹配章节';
    results.append(empty);
  } else {
    visibleResults.forEach((entry) => results.append(resultElement(entry, query)));
  }

  results.hidden = false;
  input.setAttribute('aria-expanded', 'true');
}

input?.addEventListener('input', renderResults);
input?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    input.value = '';
    renderResults();
    input.blur();
    return;
  }
  if (visibleResults.length === 0) {
    return;
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    activeIndex = (activeIndex + 1) % visibleResults.length;
    updateActiveResult();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    activeIndex = (activeIndex - 1 + visibleResults.length) % visibleResults.length;
    updateActiveResult();
  } else if (event.key === 'Enter' && activeIndex >= 0) {
    event.preventDefault();
    window.location.assign(visibleResults[activeIndex].url);
  }
});

document.addEventListener('keydown', (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
  if (event.key === '/' && !isTyping && input) {
    event.preventDefault();
    input.focus();
  }
});

if (searchRoot && input && results) {
  fetch('/assets/search-index.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Search index returned ${response.status}`);
      }
      return response.json();
    })
    .then((entries) => {
      index = entries;
      searchRoot.hidden = false;
    })
    .catch(() => {
      input.disabled = true;
      input.placeholder = '搜索暂不可用';
    });
}

