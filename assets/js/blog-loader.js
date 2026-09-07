/**
 * Dynamic Blog Loader for ACE VET CARE
 * Connects directly to articles published via the Admin Dashboard and provides rich article viewing.
 */

const defaultArticles = [
    {
        id: 'BLOG-1',
        title: '5 Essential Tips for Dog Vaccinations in Nairobi',
        category: 'Dog Care',
        author: 'Dr. Njimia (Lead Vet)',
        image: 'assets/assets/hero-dog.jpg',
        excerpt: 'Understanding core vaccinations like Rabies, Parvovirus, and DHLPP is vital for protecting your dogs in urban Kenya.',
        content: 'Vaccinations are one of the most essential aspects of responsible pet ownership in Nairobi. As temperatures change and pets interact in public dog parks or residential estates, viral risks like Canine Parvovirus, Distemper, and Rabies increase significantly.\n\nAt ACE VET CARE, our puppy immunization protocol begins at 6 weeks of age, followed by scheduled booster shots every 3 to 4 weeks until 16 weeks old. Ensure your adult pet also receives annual booster vaccinations to maintain adequate antibody protection.\n\nKey signs that your pet needs urgent veterinary attention include lethargy, loss of appetite, persistent vomiting, or foul diarrhea. Contact our emergency clinic along Kiambu Road for prompt testing.',
        date: new Date().toLocaleDateString('en-GB')
    },
    {
        id: 'BLOG-2',
        title: 'Comprehensive Pet Grooming & Medicated Skin Baths',
        category: 'Grooming & Hygiene',
        author: 'Dr. Njimia (Lead Vet)',
        image: 'assets/assets/gal3.JPG',
        excerpt: 'Regular brushing, tick/flea prevention, and ear cleaning prevent chronic dermatological infections in dogs and cats.',
        content: 'Coat hygiene is not just about keeping your pet looking pretty — it is a frontline preventive health measure. Flea allergy dermatitis, tick-borne fever, and ear mites are frequent clinical complaints in Nairobi and Kiambu.\n\nOur grooming salon uses hypoallergenic medicated washes, anti-parasitic rinses, and specialized dematting tools to preserve the natural skin barrier. Professional nail clipping also prevents joint strain and painful ingrown dewclaws.',
        date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-GB')
    },
    {
        id: 'BLOG-3',
        title: 'What to Do in a Pet Medical Emergency (24/7 Guide)',
        category: 'Emergency Vet Tips',
        author: 'Dr. Njimia (Lead Vet)',
        image: 'assets/assets/gal4.JPG',
        excerpt: 'Recognizing acute signs: bloat, poisoning, sudden trauma, and respiratory distress requires fast clinical action.',
        content: 'In acute medical emergencies, remaining calm and contacting your veterinary clinic immediately saves lives. Never administer human painkillers like Panadol or Ibuprofen, as they cause severe acute toxicity and kidney failure in cats and dogs.\n\nKeep our 24/7 emergency hotline saved in your phone: +254 703 824 551 for prompt triage and rapid treatment at Muthaiga Square.',
        date: new Date(Date.now() - 86400000 * 5).toLocaleDateString('en-GB')
    }
];

function fetchBlogPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    // Load from local storage (Admin published) or defaults
    let storedArticles = JSON.parse(localStorage.getItem('acevet_blog_articles') || '[]');
    if (storedArticles.length === 0) {
        storedArticles = defaultArticles;
        localStorage.setItem('acevet_blog_articles', JSON.stringify(defaultArticles));
    }

    container.innerHTML = storedArticles.map((art, idx) => `
        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${(idx + 1) * 100}">
          <article class="blog-post h-100 d-flex flex-column justify-content-between p-3 bg-white rounded-4 shadow-sm border">
            <div>
              <div class="post-img mb-3 rounded-3 overflow-hidden" style="height: 220px;">
                <img src="${art.image || 'assets/assets/hero-dog.jpg'}" alt="${escapeHtml(art.title)}" class="w-100 h-100 object-fit-cover">
              </div>
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="badge bg-primary bg-opacity-10 text-primary small">${escapeHtml(art.category || 'Veterinary Care')}</span>
                <span class="text-muted small">${art.date}</span>
              </div>
              <h5 class="post-title fw-bold text-dark mb-2">${escapeHtml(art.title)}</h5>
              <p class="text-muted small mb-3">${escapeHtml(art.excerpt)}</p>
            </div>
            <div class="pt-2 border-top d-flex align-items-center justify-content-between">
              <span class="small text-muted"><i class="bi bi-person-check me-1"></i>${escapeHtml(art.author || 'Dr. Njimia')}</span>
              <button class="btn btn-outline-primary btn-sm rounded-pill px-3" onclick="openArticleModal('${art.id}')">
                Read Article <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </article>
        </div>
    `).join('');
}

function openArticleModal(id) {
    const storedArticles = JSON.parse(localStorage.getItem('acevet_blog_articles') || '[]');
    const article = storedArticles.find(a => a.id === id) || defaultArticles.find(a => a.id === id);
    if (!article) return;

    document.getElementById('modal-art-title').textContent = article.title;
    document.getElementById('modal-art-cat').textContent = article.category || 'Veterinary Health';
    document.getElementById('modal-art-meta').textContent = `${article.date} • By ${article.author || 'Dr. Njimia'}`;
    document.getElementById('modal-art-image').src = article.image || 'assets/assets/hero-dog.jpg';
    
    // Format paragraphs
    const paragraphs = article.content.split('\n\n').map(p => `<p class="mb-3 text-dark" style="line-height: 1.8;">${escapeHtml(p)}</p>`).join('');
    document.getElementById('modal-art-body').innerHTML = paragraphs;

    const modalEl = document.getElementById('articleModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

document.addEventListener('DOMContentLoaded', fetchBlogPosts);
