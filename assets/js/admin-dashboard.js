/**
 * ACE VET CARE - Admin Operations & Clinical Dashboard
 * Controls: Authentication, Appointments, Calendar Date Blocking, Invoices, and Blog Publishing.
 */

// Global State
let currentCalDate = new Date();
let appointmentsList = [];
let blockedDatesList = [];
let blogArticlesList = [];
let invoiceItems = [
    { desc: "General Clinical Consultation & Health Check", qty: 1, price: 1500 },
    { desc: "DHLPP Core Canine Vaccination & Deworming", qty: 1, price: 2500 }
];

document.addEventListener('DOMContentLoaded', function () {
    checkAuthSession();
    initializeSampleData();
    refreshAppointments();
    loadBlockedDates();
    loadBlogArticles();
    renderInvoiceItems();
    updateInvoicePreview();
});

// ==========================================
// 1. AUTHENTICATION CONTROLS
// ==========================================
function checkAuthSession() {
    const isLoggedIn = sessionStorage.getItem('acevet_admin_logged_in');
    if (isLoggedIn === 'true') {
        document.getElementById('auth-overlay').classList.add('d-none');
        document.getElementById('dashboard-content').classList.remove('d-none');
    } else {
        document.getElementById('auth-overlay').classList.remove('d-none');
        document.getElementById('dashboard-content').classList.add('d-none');
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    const user = document.getElementById('admin-username').value.trim();
    const pass = document.getElementById('admin-password').value.trim();
    const errorEl = document.getElementById('login-error');

    if (user === 'acevet@admin' && pass === 'knjimia26') {
        sessionStorage.setItem('acevet_admin_logged_in', 'true');
        errorEl.classList.add('d-none');
        document.getElementById('auth-overlay').classList.add('d-none');
        document.getElementById('dashboard-content').classList.remove('d-none');
        refreshAppointments();
        renderAdminCalendar();
    } else {
        errorEl.classList.remove('d-none');
    }
}

function handleAdminLogout() {
    sessionStorage.removeItem('acevet_admin_logged_in');
    checkAuthSession();
}

// ==========================================
// 2. DATA INITIALIZATION & APPOINTMENTS
// ==========================================
function initializeSampleData() {
    // Initial appointments if empty
    if (!localStorage.getItem('acevet_appointments')) {
        const sampleAppointments = [
            {
                id: 'APT-101',
                name: 'Sarah Mutuku',
                email: 'sarah.mutuku@gmail.com',
                phone: '+254712345678',
                date: new Date().toISOString().split('T')[0],
                time_slot: '10:00 AM - 12:00 PM',
                department: 'Grooming',
                doctor: 'Dr Njimia',
                message: 'Golden retriever full grooming session',
                status: 'Confirmed',
                created_at: new Date().toISOString()
            },
            {
                id: 'APT-102',
                name: 'John Kariuki',
                email: 'john.k@yahoo.com',
                phone: '+254722890123',
                date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                time_slot: '02:00 PM - 04:00 PM',
                department: 'Vaccinations',
                doctor: 'Dr Njimia',
                message: 'Rabies and booster shots for 2 kittens',
                status: 'Pending',
                created_at: new Date().toISOString()
            },
            {
                id: 'APT-103',
                name: 'Mary Wanjiku',
                email: 'wanjiku.m@gmail.com',
                phone: '+254733456789',
                date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                time_slot: '08:00 AM - 10:00 AM',
                department: 'Surgery',
                doctor: 'Dr Njimia',
                message: 'Spaying appointment',
                status: 'Pending',
                created_at: new Date().toISOString()
            }
        ];
        localStorage.setItem('acevet_appointments', JSON.stringify(sampleAppointments));
    }

    // Initial blocked dates if empty
    if (!localStorage.getItem('acevet_blocked_dates')) {
        const sampleBlocked = [
            {
                id: 'BLK-1',
                date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
                slot: 'Entire Day',
                reason: 'Clinic Facility Disinfection & Surgery Prep'
            }
        ];
        localStorage.setItem('acevet_blocked_dates', JSON.stringify(sampleBlocked));
    }

    // Initial blog articles if empty
    if (!localStorage.getItem('acevet_blog_articles')) {
        const sampleArticles = [
            {
                id: 'BLOG-1',
                title: '5 Essential Tips for Dog Vaccinations in Nairobi',
                category: 'Dog Care',
                author: 'Dr. Njimia',
                image: 'assets/assets/hero-dog.jpg',
                excerpt: 'Understanding core vaccinations like Rabies, Parvovirus, and DHLPP is vital for protecting your dogs in urban Kenya.',
                content: 'Vaccinations are one of the most essential aspects of responsible pet ownership in Nairobi. As temperatures change and pets interact in public dog parks or estates, viral risks like Parvovirus and Rabies increase.\n\nAt ACE VET CARE, our protocol begins at 6 weeks of age, followed by scheduled booster shots every 3-4 weeks until 16 weeks. Ensure your pet receives annual boosters to maintain immune defense.',
                date: new Date().toLocaleDateString('en-GB')
            },
            {
                id: 'BLOG-2',
                title: 'Comprehensive Pet Grooming & Medicated Skin Baths',
                category: 'Grooming & Hygiene',
                author: 'Dr. Njimia',
                image: 'assets/assets/gal3.JPG',
                excerpt: 'Regular brushing, tick/flea prevention, and ear cleaning prevent chronic dermatological infections in dogs and cats.',
                content: 'Coat hygiene is not just aesthetic — it is a frontline health measure. Flea allergy dermatitis and tick-borne diseases are common across Nairobi and Kiambu.\n\nOur grooming salon uses hypoallergenic, medicated washes and professional deshedding treatments to preserve the skin barrier and keep your pet comfortable year-round.',
                date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-GB')
            },
            {
                id: 'BLOG-3',
                title: 'What to Do in a Pet Medical Emergency (24/7 Guide)',
                category: 'Emergency Vet Tips',
                author: 'Dr. Njimia',
                image: 'assets/assets/gal4.JPG',
                excerpt: 'Recognizing acute signs: bloat, poisoning, sudden trauma, and respiratory distress requires fast clinical action.',
                content: 'In emergency situations, remaining calm and contacting your veterinary clinic immediately saves lives. Avoid administering human medications like Panadol, which are toxic to cats and dogs.\n\nKeep our 24/7 hotline saved: +254 703 824 551 for prompt emergency triage along Kiambu Road.',
                date: new Date(Date.now() - 86400000 * 5).toLocaleDateString('en-GB')
            }
        ];
        localStorage.setItem('acevet_blog_articles', JSON.stringify(sampleArticles));
    }
}

function refreshAppointments() {
    appointmentsList = JSON.parse(localStorage.getItem('acevet_appointments') || '[]');
    renderAppointmentsTable();
    updateKPICounters();
    populateInvoiceClientDropdown();
}

function renderAppointmentsTable() {
    const tbody = document.getElementById('appointments-tbody');
    const filter = document.getElementById('filter-status').value;
    const search = document.getElementById('search-apt').value.toLowerCase();

    let filtered = appointmentsList.filter(apt => {
        const matchesStatus = (filter === 'ALL' || apt.status === filter);
        const matchesSearch = apt.name.toLowerCase().includes(search) || 
                              apt.phone.includes(search) || 
                              apt.department.toLowerCase().includes(search);
        return matchesStatus && matchesSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No appointments found.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(apt => {
        let badgeClass = 'badge-pending';
        if (apt.status === 'Confirmed') badgeClass = 'badge-confirmed';
        if (apt.status === 'Completed') badgeClass = 'badge-completed';
        if (apt.status === 'Cancelled') badgeClass = 'badge-cancelled';

        const waMessage = encodeURIComponent(`Hello ${apt.name}, this is Dr. Njimia from ACE VET CARE. Regarding your appointment on ${apt.date} (${apt.time_slot}) for ${apt.department}:`);
        const waLink = `https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=${waMessage}`;

        return `
        <tr>
            <td class="fw-bold text-muted small">${apt.id || 'APT'}</td>
            <td>
                <div class="fw-bold text-dark">${escapeHtml(apt.name)}</div>
                <small class="text-muted"><i class="bi bi-telephone me-1"></i>${escapeHtml(apt.phone)}</small>
            </td>
            <td>
                <span class="badge bg-light text-dark border">${escapeHtml(apt.department)}</span>
                <div class="small text-muted">${escapeHtml(apt.doctor || 'Dr. Njimia')}</div>
            </td>
            <td>
                <div class="fw-semibold text-dark"><i class="bi bi-calendar3 me-1 text-primary"></i>${apt.date}</div>
                <small class="text-muted"><i class="bi bi-clock me-1 text-primary"></i>${apt.time_slot || '2-Hour Session'}</small>
            </td>
            <td>
                <span class="status-badge ${badgeClass}">${apt.status}</span>
            </td>
            <td class="text-end">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" title="Confirm Booking" onclick="updateAppointmentStatus('${apt.id}', 'Confirmed')">
                        <i class="bi bi-check-lg"></i>
                    </button>
                    <button class="btn btn-outline-primary" title="Complete Visit" onclick="updateAppointmentStatus('${apt.id}', 'Completed')">
                        <i class="bi bi-check2-all"></i>
                    </button>
                    <a href="${waLink}" target="_blank" class="btn btn-outline-success" title="Message on WhatsApp">
                        <i class="bi bi-whatsapp"></i>
                    </a>
                    <button class="btn btn-outline-secondary" title="Bill / Create Invoice" onclick="loadClientToInvoice('${apt.id}')">
                        <i class="bi bi-receipt"></i>
                    </button>
                    <button class="btn btn-outline-danger" title="Cancel/Delete" onclick="deleteAppointment('${apt.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function updateAppointmentStatus(id, newStatus) {
    appointmentsList = appointmentsList.map(apt => {
        if (apt.id === id) apt.status = newStatus;
        return apt;
    });
    localStorage.setItem('acevet_appointments', JSON.stringify(appointmentsList));
    refreshAppointments();
}

function deleteAppointment(id) {
    if (!confirm('Are you sure you want to remove this appointment record?')) return;
    appointmentsList = appointmentsList.filter(apt => apt.id !== id);
    localStorage.setItem('acevet_appointments', JSON.stringify(appointmentsList));
    refreshAppointments();
}

function updateKPICounters() {
    const total = appointmentsList.length;
    const pending = appointmentsList.filter(a => a.status === 'Pending').length;
    const confirmed = appointmentsList.filter(a => a.status === 'Confirmed').length;
    const blocked = blockedDatesList.length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-confirmed').textContent = confirmed;
    document.getElementById('stat-blocked').textContent = blocked;
    document.getElementById('apt-count-badge').textContent = total;
}

// ==========================================
// 3. CALENDAR & DATE BLOCKING
// ==========================================
function loadBlockedDates() {
    blockedDatesList = JSON.parse(localStorage.getItem('acevet_blocked_dates') || '[]');
    document.getElementById('blocked-count').textContent = blockedDatesList.length;
    const listEl = document.getElementById('blocked-dates-list');

    if (blockedDatesList.length === 0) {
        listEl.innerHTML = `<p class="text-muted small mb-0">No dates currently blocked.</p>`;
        return;
    }

    listEl.innerHTML = blockedDatesList.map(b => `
        <div class="d-flex align-items-center justify-content-between p-2 rounded bg-light border">
            <div>
                <strong class="d-block text-danger small"><i class="bi bi-calendar-x me-1"></i>${b.date}</strong>
                <span class="text-muted" style="font-size: 0.75rem;">${escapeHtml(b.slot)} • ${escapeHtml(b.reason)}</span>
            </div>
            <button onclick="unblockDate('${b.id}')" class="btn btn-sm btn-outline-danger py-0 px-2" title="Unblock Date">
                <i class="bi bi-unlock"></i>
            </button>
        </div>
    `).join('');
}

function handleBlockDate(event) {
    event.preventDefault();
    const date = document.getElementById('block-date-input').value;
    const slot = document.getElementById('block-slot-select').value;
    const reason = document.getElementById('block-reason-input').value.trim();

    if (!date) return;

    const newBlock = {
        id: 'BLK-' + Date.now(),
        date: date,
        slot: slot,
        reason: reason
    };

    blockedDatesList.push(newBlock);
    localStorage.setItem('acevet_blocked_dates', JSON.stringify(blockedDatesList));
    document.getElementById('block-date-form').reset();
    loadBlockedDates();
    renderAdminCalendar();
    updateKPICounters();
    alert(`Date ${date} has been blocked successfully!`);
}

function unblockDate(id) {
    blockedDatesList = blockedDatesList.filter(b => b.id !== id);
    localStorage.setItem('acevet_blocked_dates', JSON.stringify(blockedDatesList));
    loadBlockedDates();
    renderAdminCalendar();
    updateKPICounters();
}

function changeMonth(delta) {
    currentCalDate.setMonth(currentCalDate.getMonth() + delta);
    renderAdminCalendar();
}

function renderAdminCalendar() {
    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('cal-month-title').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `
    <table class="table table-bordered text-center align-middle mb-0">
        <thead class="bg-light">
            <tr>
                <th class="text-muted small">Sun</th>
                <th class="text-muted small">Mon</th>
                <th class="text-muted small">Tue</th>
                <th class="text-muted small">Wed</th>
                <th class="text-muted small">Thu</th>
                <th class="text-muted small">Fri</th>
                <th class="text-muted small">Sat</th>
            </tr>
        </thead>
        <tbody><tr>`;

    for (let i = 0; i < firstDay; i++) {
        html += `<td class="bg-light bg-opacity-25"></td>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayApts = appointmentsList.filter(a => a.date === dateStr);
        const isBlocked = blockedDatesList.some(b => b.date === dateStr);

        let cellStyle = "height: 85px; vertical-align: top; padding: 6px;";
        let badge = "";

        if (isBlocked) {
            cellStyle += "background-color: #fee2e2;";
            badge += `<span class="badge bg-danger d-block mb-1 font-monospace" style="font-size:0.65rem;">BLOCKED</span>`;
        }

        if (dayApts.length > 0) {
            badge += `<span class="badge bg-primary d-block" style="font-size:0.7rem;">${dayApts.length} Booking${dayApts.length > 1 ? 's' : ''}</span>`;
        }

        html += `
        <td style="${cellStyle}">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fw-bold ${isBlocked ? 'text-danger' : 'text-dark'}" style="font-size: 0.85rem;">${day}</span>
            </div>
            ${badge}
        </td>`;

        if ((day + firstDay) % 7 === 0 && day < daysInMonth) {
            html += `</tr><tr>`;
        }
    }

    html += `</tr></tbody></table>`;
    document.getElementById('calendar-grid').innerHTML = html;
}

// ==========================================
// 4. INVOICE & BILLING SYSTEM
// ==========================================
function populateInvoiceClientDropdown() {
    const select = document.getElementById('invoice-client-select');
    select.innerHTML = `<option value="">-- Choose Client --</option>` +
        appointmentsList.map(a => `<option value="${a.id}">${a.name} (${a.department} - ${a.date})</option>`).join('');
}

function autoFillInvoiceClient(aptId) {
    if (!aptId) return;
    const apt = appointmentsList.find(a => a.id === aptId);
    if (!apt) return;

    document.getElementById('inv-client-name').value = apt.name;
    document.getElementById('inv-client-phone').value = apt.phone;
    document.getElementById('inv-pet-name').value = apt.department + " Patient";
    updateInvoicePreview();
}

function loadClientToInvoice(aptId) {
    const tabEl = document.querySelector('#billing-tab');
    bootstrap.Tab.getOrCreateInstance(tabEl).show();
    document.getElementById('invoice-client-select').value = aptId;
    autoFillInvoiceClient(aptId);
}

function renderInvoiceItems() {
    const container = document.getElementById('invoice-items-builder');
    container.innerHTML = invoiceItems.map((item, idx) => `
        <div class="row g-2 align-items-center mb-2">
            <div class="col-6">
                <input type="text" class="form-control form-control-sm" value="${escapeHtml(item.desc)}" onchange="updateItemDesc(${idx}, this.value)" placeholder="Item/Service description">
            </div>
            <div class="col-2">
                <input type="number" class="form-control form-control-sm text-center" value="${item.qty}" min="1" onchange="updateItemQty(${idx}, this.value)">
            </div>
            <div class="col-3">
                <input type="number" class="form-control form-control-sm text-end" value="${item.price}" min="0" onchange="updateItemPrice(${idx}, this.value)">
            </div>
            <div class="col-1 text-end">
                <button type="button" class="btn btn-outline-danger btn-sm p-1" onclick="removeInvoiceItem(${idx})"><i class="bi bi-x"></i></button>
            </div>
        </div>
    `).join('');
    updateInvoicePreview();
}

function addInvoiceItemRow() {
    invoiceItems.push({ desc: "Medication / Follow-up Service", qty: 1, price: 1000 });
    renderInvoiceItems();
}

function removeInvoiceItem(idx) {
    if (invoiceItems.length > 1) {
        invoiceItems.splice(idx, 1);
        renderInvoiceItems();
    }
}

function updateItemDesc(idx, val) { invoiceItems[idx].desc = val; updateInvoicePreview(); }
function updateItemQty(idx, val) { invoiceItems[idx].qty = parseInt(val) || 1; updateInvoicePreview(); }
function updateItemPrice(idx, val) { invoiceItems[idx].price = parseFloat(val) || 0; updateInvoicePreview(); }

function updateInvoicePreview() {
    const clientName = document.getElementById('inv-client-name').value || 'Valued Client';
    const clientPhone = document.getElementById('inv-client-phone').value || '+254 700 000 000';
    const petName = document.getElementById('inv-pet-name').value || 'Pet Patient';

    document.getElementById('inv-client-display').textContent = clientName;
    document.getElementById('inv-phone-display').textContent = 'Phone: ' + clientPhone;
    document.getElementById('inv-pet-display').textContent = 'Pet: ' + petName;
    document.getElementById('inv-date-display').textContent = 'Date: ' + new Date().toLocaleDateString('en-GB');

    let subtotal = 0;
    const tbody = document.getElementById('invoice-preview-tbody');
    tbody.innerHTML = invoiceItems.map(item => {
        const itemTotal = item.qty * item.price;
        subtotal += itemTotal;
        return `
        <tr>
            <td>${escapeHtml(item.desc)}</td>
            <td class="text-center">${item.qty}</td>
            <td class="text-end">${item.price.toLocaleString()}</td>
            <td class="text-end fw-semibold">${itemTotal.toLocaleString()}</td>
        </tr>`;
    }).join('');

    document.getElementById('inv-subtotal-display').textContent = `KES ${subtotal.toLocaleString()}`;
    document.getElementById('inv-total-display').textContent = `KES ${subtotal.toLocaleString()}`;
}

function sendInvoiceWhatsApp() {
    const clientName = document.getElementById('inv-client-name').value || 'Valued Client';
    const clientPhone = document.getElementById('inv-client-phone').value.replace(/[^0-9]/g, '');
    const petName = document.getElementById('inv-pet-name').value || 'Pet';
    const invNum = document.getElementById('inv-number-display').textContent;

    let subtotal = 0;
    let itemsText = invoiceItems.map(i => {
        const tot = i.qty * i.price;
        subtotal += tot;
        return `• ${i.desc} (x${i.qty}) - KES ${tot.toLocaleString()}`;
    }).join('\n');

    const message = `*ACE VET CARE KENYA - OFFICIAL INVOICE*\n\n` +
                    `*Invoice No:* ${invNum}\n` +
                    `*Client:* ${clientName}\n` +
                    `*Pet:* ${petName}\n` +
                    `*Date:* ${new Date().toLocaleDateString('en-GB')}\n\n` +
                    `*Services & Breakdown:*\n${itemsText}\n\n` +
                    `*TOTAL DUE: KES ${subtotal.toLocaleString()}*\n\n` +
                    `*Payment Details:*\n` +
                    `• M-Pesa Buy Goods / Till: *247247*\n` +
                    `• Account / Phone: *0703824551*\n\n` +
                    `Thank you for trusting ACE VET CARE with ${petName}'s healthcare! 🐾`;

    const url = `https://wa.me/${clientPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ==========================================
// 5. BLOG PUBLISHER & SYNC
// ==========================================
function loadBlogArticles() {
    blogArticlesList = JSON.parse(localStorage.getItem('acevet_blog_articles') || '[]');
    const container = document.getElementById('articles-list-container');

    if (blogArticlesList.length === 0) {
        container.innerHTML = `<p class="text-muted small">No articles published yet.</p>`;
        return;
    }

    container.innerHTML = blogArticlesList.map(art => `
        <div class="d-flex gap-3 p-3 rounded bg-light border align-items-center justify-content-between">
            <div class="d-flex gap-3 align-items-center">
                <img src="${art.image || 'assets/assets/hero-dog.jpg'}" alt="Thumb" class="rounded object-fit-cover" width="70" height="70">
                <div>
                    <span class="badge bg-primary bg-opacity-10 text-primary small mb-1">${escapeHtml(art.category)}</span>
                    <h6 class="fw-bold text-dark mb-1">${escapeHtml(art.title)}</h6>
                    <small class="text-muted">${art.date} • ${escapeHtml(art.author)}</small>
                </div>
            </div>
            <div>
                <button class="btn btn-outline-danger btn-sm" onclick="deleteArticle('${art.id}')" title="Delete Article">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function handlePublishArticle(event) {
    event.preventDefault();
    const title = document.getElementById('blog-title-input').value.trim();
    const category = document.getElementById('blog-category-input').value;
    const author = document.getElementById('blog-author-input').value.trim();
    const image = document.getElementById('blog-image-input').value.trim();
    const excerpt = document.getElementById('blog-excerpt-input').value.trim();
    const content = document.getElementById('blog-content-input').value.trim();

    const newArticle = {
        id: 'BLOG-' + Date.now(),
        title: title,
        category: category,
        author: author,
        image: image || 'assets/assets/hero-dog.jpg',
        excerpt: excerpt,
        content: content,
        date: new Date().toLocaleDateString('en-GB')
    };

    blogArticlesList.unshift(newArticle);
    localStorage.setItem('acevet_blog_articles', JSON.stringify(blogArticlesList));
    document.getElementById('blog-publish-form').reset();
    loadBlogArticles();
    alert('Article published successfully! It is now live on the public blog page.');
}

function deleteArticle(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    blogArticlesList = blogArticlesList.filter(a => a.id !== id);
    localStorage.setItem('acevet_blog_articles', JSON.stringify(blogArticlesList));
    loadBlogArticles();
}

// Utility Helpers
function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
