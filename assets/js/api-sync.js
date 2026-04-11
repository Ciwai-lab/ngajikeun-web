(function () {
    const CDN_SITE_DATA_URL = 'https://cdn.jsdelivr.net/gh/Ciwai-lab/ngajikeun-web@main/content/data/site-data.json';
    let siteDataPromise = null;

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    async function fetchJson(url) {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} while loading ${url}`);
        }

        return response.json();
    }

    function loadSiteData() {
        if (!siteDataPromise) {
            siteDataPromise = (async () => {
                try {
                    return await fetchJson('content/data/site-data.json');
                } catch (localError) {
                    console.warn('Gagal load aggregate lokal, mencoba CDN fallback.', localError);
                    return fetchJson(CDN_SITE_DATA_URL);
                }
            })();
        }

        return siteDataPromise;
    }

    function getCollection(data, key) {
        const collection = data?.[key];
        return Array.isArray(collection) ? collection : [];
    }

    async function syncPrograms() {
        const container = document.getElementById('program-container');
        if (!container) return;

        try {
            const data = await loadSiteData();
            const programs = getCollection(data, 'programs');
            if (!programs.length) return;

            container.innerHTML = '';

            for (const content of programs) {
                const regLink = content.registration_link || `https://wa.me/6281932692047?text=Assalamu'alaikum%20Admin%20Ngajikeun.id,%20saya%20ingin%20mendaftar%20program%20*${encodeURIComponent(content.title)}*`;

                container.innerHTML += `
                    <div class="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-t-emerald-500 hover:shadow-lg transition-all duration-300">
                        <h3 class="text-xl font-bold text-gray-800 mb-2">${content.title}</h3>
                        <p class="text-gray-600 text-sm mb-4">${content.description}</p>
                        <div class="flex justify-between items-center mt-auto pt-4 border-t">
                            <span class="text-emerald-600 font-bold">${content.price}</span>
                            <a href="${regLink}" target="_blank" class="bg-emerald-500 text-white text-xs px-4 py-2 rounded-full font-bold">Daftar Sekarang</a>
                        </div>
                    </div>`;
            }
        } catch (error) {
            console.error('Gagal load program:', error);
        }
    }

    async function syncMentors() {
        const container = document.getElementById('mentor-container');
        if (!container) return;

        try {
            const data = await loadSiteData();
            const mentors = getCollection(data, 'mentors');
            if (!mentors.length) return;

            container.innerHTML = '';

            for (const mentor of mentors) {
                container.innerHTML += `
                    <div class="text-center group">
                        <div class="relative inline-block">
                            <img src="${mentor.image || 'https://via.placeholder.com/150'}"
                                class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-emerald-100 group-hover:border-emerald-500 transition-all duration-300 shadow-md">
                        </div>
                        <h3 class="mt-4 text-lg font-bold text-gray-800">${mentor.name}</h3>
                        <p class="text-emerald-600 text-sm font-medium mb-2">${mentor.specialty || 'Mentor Al-Qur\'an'}</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Gagal load mentor:', error);
        }
    }

    async function syncTestimonials() {
        const container = document.getElementById('testimonial-container');
        if (!container) return;

        try {
            const data = await loadSiteData();
            const testimonials = getCollection(data, 'testimonials');
            if (!testimonials.length) return;

            container.innerHTML = '';

            for (const testimonial of testimonials) {
                container.innerHTML += `
                    <div class="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 italic text-gray-700 relative">
                        <span class="text-6xl text-emerald-200 absolute top-2 left-2 font-serif">“</span>
                        <p class="relative z-10 mb-6">${testimonial.content}</p>
                        <div class="flex items-center gap-4 border-t pt-4">
                            <img src="${testimonial.image || 'https://ui-avatars.com/api/?name=' + testimonial.name}" class="w-12 h-12 rounded-full border-2 border-emerald-500">
                            <div>
                                <h4 class="font-bold text-gray-800 not-italic">${testimonial.name}</h4>
                                <p class="text-xs text-emerald-600 not-italic">${testimonial.status}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            container.innerHTML = '';
            console.error('Gagal load testimoni:', error);
        }
    }

    async function syncArticles() {
        const container = document.getElementById('articles-list');
        if (!container) return;

        try {
            const data = await loadSiteData();
            const articles = getCollection(data, 'articles');
            if (!articles.length) return;

            container.innerHTML = '';

            for (const article of articles) {
                const safeTitle = escapeHtml(article.title || article.slug || 'Artikel');
                const articleDate = article.date ? new Date(article.date) : null;
                const formattedDate = articleDate && !Number.isNaN(articleDate.getTime())
                    ? articleDate.toLocaleDateString('id-ID')
                    : 'Tanggal belum tersedia';

                container.innerHTML += `
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 hover:border-emerald-200 transition-all">
                        <h3 class="font-bold text-lg mb-2">${safeTitle}</h3>
                        <p class="text-xs text-gray-400 mb-4">${formattedDate}</p>
                        <a href="#" class="text-emerald-600 text-sm font-bold hover:underline">Baca Selengkapnya →</a>
                    </div>`;
            }
        } catch (error) {
            console.error('Gagal load artikel:', error);
        }
    }

    async function syncProducts() {
        const container = document.getElementById('products-list');
        if (!container) return;

        try {
            const data = await loadSiteData();
            const products = getCollection(data, 'products');
            if (!products.length) return;

            container.innerHTML = '';

            for (const product of products) {
                container.innerHTML += `
                    <div class="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
                        <h3 class="font-bold text-emerald-900">${product.title}</h3>
                        <p class="text-sm text-emerald-700/70 my-3">${product.description}</p>
                        <span class="block font-black text-emerald-600 mb-4">${product.price}</span>
                        <button class="bg-white text-emerald-700 text-xs px-4 py-2 rounded-full font-bold shadow-sm">Beli Sekarang</button>
                    </div>`;
            }
        } catch (error) {
            console.error('Gagal load produk:', error);
        }
    }

    async function syncQuizzes() {
        const container = document.getElementById('quizzes-list');
        if (!container) return;

        try {
            const data = await loadSiteData();
            const quizzes = getCollection(data, 'quizzes');
            if (!quizzes.length) return;

            container.innerHTML = '';

            for (const quiz of quizzes) {
                container.innerHTML += `
                    <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-amber-400">
                        <h3 class="font-bold text-gray-800 mb-2">${quiz.title}</h3>
                        <p class="text-sm text-gray-500 mb-4">${quiz.description || ''}</p>
                        <a href="${quiz.link}" target="_blank" class="text-amber-600 text-xs font-black uppercase tracking-widest hover:text-amber-700">Mulai Kuiz ⚡</a>
                    </div>`;
            }
        } catch (error) {
            console.error('Gagal load kuis:', error);
        }
    }

    window.NgajikeunApi = {
        syncPrograms,
        syncMentors,
        syncTestimonials,
        syncArticles,
        syncProducts,
        syncQuizzes
    };
}());
