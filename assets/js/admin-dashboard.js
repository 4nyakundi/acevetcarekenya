/**
 * ACE VET CARE - Admin Operations & Clinical Practice Management System
 * Controls: Authentication, Appointments, Patient EHR & Vaccines, WhatsApp Hub, Service Catalog, Invoices, and Blog.
 */

// Global State
let currentCalDate = new Date();
let appointmentsList = [];
let patientsList = [];
let blockedDatesList = [];
let blogArticlesList = [];
let servicesCatalogList = [];
let invoiceItems = [
    { desc: "General Clinical Consultation & Health Check", qty: 1, price: 2000 },
    { desc: "DHLPP Core Canine Vaccination & Deworming", qty: 1, price: 2500 }
];

document.addEventListener('DOMContentLoaded', function () {
    checkAuthSession();
    initializeSampleData();
    refreshAppointments();
    refreshPatients();
    loadBlockedDates();
    loadBlogArticles();
    loadServicesCatalog();
    renderInvoiceItems();
    updateInvoicePreview();
    populateWhatsAppHubClients();
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
        refreshPatients();
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
// 2. DATA INITIALIZATION
// ==========================================
function initializeSampleData() {
    // 1. Sample Appointments
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

    // 2. Sample Patient Medical Records & Vaccination
    if (!localStorage.getItem('acevet_patients')) {
        const samplePatients = [
            {
                id: 'PET-201',
                petName: 'Max',
                species: 'Dog',
                breed: 'German Shepherd',
                age: '3 Years',
                weight: '34 kg',
                ownerName: 'Sarah Mutuku',
                ownerPhone: '+254712345678',
                diagnosis: 'Routine wellness & dermatological skin check',
                treatment: 'Medicated bath, oral antiparasitic chewables',
                nextVaccine: 'DHLPP Booster',
                vaccineDueDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
                lastVisit: new Date().toISOString().split('T')[0]
            },
            {
                id: 'PET-202',
                petName: 'Bella',
                species: 'Cat',
                breed: 'Persian Longhair',
                age: '1.5 Years',
                weight: '4.2 kg',
                ownerName: 'John Kariuki',
                ownerPhone: '+254722890123',
                diagnosis: 'Mild upper respiratory sneezing & eye discharge',
                treatment: 'Eye drops and supportive immune vitamins',
                nextVaccine: 'Feline Tricat Vaccine',
                vaccineDueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
                lastVisit: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0]
            },
            {
                id: 'PET-203',
                petName: 'Rocky',
                species: 'Dog',
                breed: 'Boerboel',
                age: '4 Years',
                weight: '48 kg',
                ownerName: 'Mary Wanjiku',
                ownerPhone: '+254733456789',
                diagnosis: 'Pre-surgical evaluation for neutering',
                treatment: 'Bloodwork normal, fasting instructions provided',
                nextVaccine: 'Rabies Annual Immunization',
                vaccineDueDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
                lastVisit: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0]
            }
        ];
        localStorage.setItem('acevet_patients', JSON.stringify(samplePatients));
    }

    // 3. Sample Services Catalog & Standard Pricing
    if (!localStorage.getItem('acevet_services')) {
        const sampleServices = [
            { id: 'SRV-1', name: 'General Consultation & Clinical Triage', category: 'Treatment', price: 2000, desc: 'Full physical check, temperature, vital examination, & medical diagnosis.' },
            { id: 'SRV-2', name: 'DHLPP Core Canine Vaccination', category: 'Vaccination', price: 2500, desc: 'Protects against Distemper, Hepatitis, Leptospirosis, Parvo, & Parainfluenza.' },
            { id: 'SRV-3', name: 'Rabies Immunization Shot', category: 'Vaccination', price: 1500, desc: 'Annual core anti-rabies vaccination with official certification.' },
            { id: 'SRV-4', name: 'Feline Tricat Core Vaccination', category: 'Vaccination', price: 2500, desc: 'Core triple vaccine for cats against Panleukopenia and respiratory viruses.' },
            { id: 'SRV-5', name: 'Full Luxury Pet Grooming & Styling', category: 'Grooming', price: 2500, desc: 'Includes warm shampoo bath, hair clipping, nail trim, ear cleansing, & styling.' },
            { id: 'SRV-6', name: 'Medicated Dermatological Bath', category: 'Grooming', price: 3000, desc: 'Special anti-fungal, anti-parasitic treatment wash for sensitive skin.' },
            { id: 'SRV-7', name: 'Canine Spay / Neuter Surgery', category: 'Surgery', price: 15000, desc: 'Complete surgical sterilization under general anesthesia with post-op care.' },
            { id: 'SRV-8', name: 'Feline Spaying / Neutering', category: 'Surgery', price: 10000, desc: 'Sterilization surgery for female or male cats including post-op medications.' },
            { id: 'SRV-9', name: 'Veterinary Boarding Facility (Per Night)', category: 'Boarding', price: 1800, desc: 'Safe individual kennel/cattery accommodation with meals and daily vet checks.' },
            { id: 'SRV-10', name: 'Ultrasonic Dental Scaling & Polishing', category: 'Treatment', price: 6500, desc: 'Comprehensive tartar cleaning and tooth polishing to prevent periodontal disease.' },
            { id: 'SRV-11', name: 'Broad-Spectrum Deworming Treatment', category: 'Treatment', price: 800, desc: 'Deworming tablets formulated to eliminate tapeworms, roundworms, & hookworms.' }
        ];
        localStorage.setItem('acevet_services', JSON.stringify(sampleServices));
    }

    // 4. Sample Blocked Dates
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

    // 5. Sample Blog Articles
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

// ==========================================
// 3. APPOINTMENTS OPERATIONS
// ==========================================
function refreshAppointments() {
    appointmentsList = JSON.parse(localStorage.getItem('acevet_appointments') || '[]');
    renderAppointmentsTable();
    renderCalendarScheduleTable();
    renderAdminCalendar();
    updateKPICounters();
    populateInvoiceClientDropdown();
    populateWhatsAppHubClients();
}

function renderAppointmentsTable() {
    const tbody = document.getElementById('appointments-tbody');
    if (!tbody) return;
    const filter = document.getElementById('filter-status') ? document.getElementById('filter-status').value : 'ALL';
    const search = document.getElementById('search-apt') ? document.getElementById('search-apt').value.toLowerCase() : '';

    let filtered = appointmentsList.filter(apt => {
        const matchesStatus = (filter === 'ALL' || apt.status === filter);
        const matchesSearch = (apt.name || '').toLowerCase().includes(search) || 
                              (apt.phone || '').includes(search) || 
                              (apt.department || '').toLowerCase().includes(search);
        return matchesStatus && matchesSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4"><i class="bi bi-inbox fs-3 d-block mb-2 text-muted opacity-50"></i>No appointments found.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(apt => {
        let badgeClass = 'badge-pending';
        if (apt.status === 'Confirmed') badgeClass = 'badge-confirmed';
        if (apt.status === 'Completed') badgeClass = 'badge-completed';
        if (apt.status === 'Cancelled') badgeClass = 'badge-cancelled';

        const waMessage = encodeURIComponent(`Hello ${apt.name}, this is Dr. Njimia from ACE VET CARE. Regarding your appointment on ${apt.date} (${apt.time_slot}) for ${apt.department}:`);
        const waLink = `https://wa.me/${(apt.phone || '').replace(/[^0-9]/g, '')}?text=${waMessage}`;

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
    const completed = appointmentsList.filter(a => a.status === 'Completed').length;
    const blocked = blockedDatesList.length;
    const patients = patientsList.length;

    if (document.getElementById('stat-total')) document.getElementById('stat-total').textContent = total;
    if (document.getElementById('stat-pending')) document.getElementById('stat-pending').textContent = pending;
    if (document.getElementById('stat-confirmed')) document.getElementById('stat-confirmed').textContent = confirmed;
    if (document.getElementById('stat-blocked')) document.getElementById('stat-blocked').textContent = blocked;
    if (document.getElementById('apt-count-badge')) document.getElementById('apt-count-badge').textContent = pending;
    if (document.getElementById('patient-count-badge')) document.getElementById('patient-count-badge').textContent = patients;
    if (document.getElementById('stat-patients-count')) document.getElementById('stat-patients-count').textContent = patients;
}

// ==========================================
// 4. PATIENT MEDICAL RECORDS & VACCINATIONS (EHR)
// ==========================================
function refreshPatients() {
    patientsList = JSON.parse(localStorage.getItem('acevet_patients') || '[]');
    renderPatientsTable();
    updateKPICounters();
    populateWhatsAppHubClients();
}

function renderPatientsTable() {
    const tbody = document.getElementById('patients-tbody');
    if (!tbody) return;
    const search = document.getElementById('search-patient') ? document.getElementById('search-patient').value.toLowerCase() : '';

    let filtered = patientsList.filter(p => {
        return (p.petName || '').toLowerCase().includes(search) ||
               (p.ownerName || '').toLowerCase().includes(search) ||
               (p.ownerPhone || '').includes(search) ||
               (p.breed || '').toLowerCase().includes(search);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4"><i class="bi bi-folder2-open fs-3 d-block mb-2 opacity-50"></i>No patient records found.</td></tr>`;
        return;
    }

    const today = new Date().toISOString().split('T')[0];

    tbody.innerHTML = filtered.map(p => {
        const isDueSoon = p.vaccineDueDate && p.vaccineDueDate <= new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0];
        const dueBadge = isDueSoon ? `<span class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1"><i class="bi bi-exclamation-triangle-fill me-1"></i>Due: ${p.vaccineDueDate}</span>` 
                                  : `<span class="badge bg-light text-dark border px-2 py-1">${p.vaccineDueDate || 'Up to date'}</span>`;

        return `
        <tr>
            <td class="fw-bold text-muted small">${p.id || 'PET'}</td>
            <td>
                <div class="fw-bold text-dark d-flex align-items-center gap-2">
                    <i class="bi ${p.species === 'Cat' ? 'bi-github' : 'bi-shield-shaded'} text-primary"></i>
                    ${escapeHtml(p.petName)}
                </div>
                <small class="text-muted">${escapeHtml(p.breed)} • ${escapeHtml(p.age || '')} (${escapeHtml(p.weight || '')})</small>
            </td>
            <td>
                <div class="fw-semibold text-dark">${escapeHtml(p.ownerName)}</div>
                <small class="text-muted"><i class="bi bi-telephone me-1"></i>${escapeHtml(p.ownerPhone)}</small>
            </td>
            <td>
                <div class="small fw-semibold text-dark text-truncate" style="max-width: 180px;">${escapeHtml(p.diagnosis || 'Checkup')}</div>
                <small class="text-muted text-truncate d-block" style="max-width: 180px;">${escapeHtml(p.treatment || '-')}</small>
            </td>
            <td>
                <div class="small fw-semibold text-dark">${escapeHtml(p.nextVaccine || 'Core Boosters')}</div>
                ${dueBadge}
            </td>
            <td>
                <span class="small text-muted"><i class="bi bi-clock-history me-1"></i>${p.lastVisit || today}</span>
            </td>
            <td class="text-end">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" title="Edit Patient Record" onclick="openEditPatientModal('${p.id}')">
                        <i class="bi bi-pencil-square"></i> Edit
                    </button>
                    <button class="btn btn-outline-success" title="Send WhatsApp Vaccine Reminder" onclick="sendPatientVaccineReminder('${p.id}')">
                        <i class="bi bi-whatsapp"></i>
                    </button>
                    <button class="btn btn-outline-info" title="Bill / Create Invoice" onclick="billPatientRecord('${p.id}')">
                        <i class="bi bi-receipt"></i>
                    </button>
                    <button class="btn btn-outline-danger" title="Delete Record" onclick="deletePatient('${p.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function openEditPatientModal(id) {
    const patient = patientsList.find(p => p.id === id);
    if (!patient) return;

    document.getElementById('edit-patient-id').value = patient.id;
    document.getElementById('edit-pet-name').value = patient.petName || '';
    document.getElementById('edit-pet-species').value = patient.species || 'Dog';
    document.getElementById('edit-pet-breed').value = patient.breed || '';
    document.getElementById('edit-pet-age').value = patient.age || '';
    document.getElementById('edit-pet-weight').value = patient.weight || '';
    document.getElementById('edit-owner-name').value = patient.ownerName || '';
    document.getElementById('edit-owner-phone').value = patient.ownerPhone || '';
    document.getElementById('edit-diagnosis').value = patient.diagnosis || '';
    document.getElementById('edit-treatment').value = patient.treatment || '';
    document.getElementById('edit-vaccine-name').value = patient.nextVaccine || '';
    document.getElementById('edit-vaccine-due').value = patient.vaccineDueDate || '';
    document.getElementById('edit-last-visit').value = patient.lastVisit || new Date().toISOString().split('T')[0];

    const modal = new bootstrap.Modal(document.getElementById('editPatientModal'));
    modal.show();
}

function handleEditPatient(event) {
    event.preventDefault();
    const id = document.getElementById('edit-patient-id').value;
    const index = patientsList.findIndex(p => p.id === id);
    if (index === -1) return;

    patientsList[index].petName = document.getElementById('edit-pet-name').value.trim();
    patientsList[index].species = document.getElementById('edit-pet-species').value;
    patientsList[index].breed = document.getElementById('edit-pet-breed').value.trim() || 'Mixed Breed';
    patientsList[index].age = document.getElementById('edit-pet-age').value.trim();
    patientsList[index].weight = document.getElementById('edit-pet-weight').value.trim();
    patientsList[index].ownerName = document.getElementById('edit-owner-name').value.trim();
    patientsList[index].ownerPhone = document.getElementById('edit-owner-phone').value.trim();
    patientsList[index].diagnosis = document.getElementById('edit-diagnosis').value.trim();
    patientsList[index].treatment = document.getElementById('edit-treatment').value.trim();
    patientsList[index].nextVaccine = document.getElementById('edit-vaccine-name').value.trim();
    patientsList[index].vaccineDueDate = document.getElementById('edit-vaccine-due').value;
    patientsList[index].lastVisit = document.getElementById('edit-last-visit').value;

    localStorage.setItem('acevet_patients', JSON.stringify(patientsList));

    const modalEl = document.getElementById('editPatientModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    refreshPatients();
    alert(`Patient record for ${patientsList[index].petName} updated successfully!`);
}

function handleAddPatient(event) {
    event.preventDefault();
    const petName = document.getElementById('new-pet-name').value.trim();
    const species = document.getElementById('new-pet-species').value;
    const breed = document.getElementById('new-pet-breed').value.trim();
    const age = document.getElementById('new-pet-age').value.trim();
    const weight = document.getElementById('new-pet-weight').value.trim();
    const ownerName = document.getElementById('new-owner-name').value.trim();
    const ownerPhone = document.getElementById('new-owner-phone').value.trim();
    const diagnosis = document.getElementById('new-diagnosis').value.trim();
    const treatment = document.getElementById('new-treatment').value.trim();
    const nextVaccine = document.getElementById('new-vaccine-name').value.trim();
    const vaccineDueDate = document.getElementById('new-vaccine-due').value;

    const newPatient = {
        id: 'PET-' + Date.now().toString().slice(-4),
        petName: petName,
        species: species,
        breed: breed || 'Mixed Breed',
        age: age,
        weight: weight,
        ownerName: ownerName,
        ownerPhone: ownerPhone,
        diagnosis: diagnosis || 'General Clinical Consultation',
        treatment: treatment || 'Prescribed supportive care',
        nextVaccine: nextVaccine || 'Core Annual Boosters',
        vaccineDueDate: vaccineDueDate,
        lastVisit: new Date().toISOString().split('T')[0]
    };

    patientsList.unshift(newPatient);
    localStorage.setItem('acevet_patients', JSON.stringify(patientsList));
    document.getElementById('add-patient-form').reset();

    // Close modal if open
    const modalEl = document.getElementById('addPatientModal');
    if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    }

    refreshPatients();
    alert(`Patient record for ${petName} saved successfully!`);
}

function deletePatient(id) {
    if (!confirm('Are you sure you want to delete this patient record?')) return;
    patientsList = patientsList.filter(p => p.id !== id);
    localStorage.setItem('acevet_patients', JSON.stringify(patientsList));
    refreshPatients();
}

function sendPatientVaccineReminder(id) {
    const patient = patientsList.find(p => p.id === id);
    if (!patient) return;

    const phone = (patient.ownerPhone || '').replace(/[^0-9]/g, '');
    const message = `*ACE VET CARE KENYA - VACCINATION & HEALTH REMINDER* 🐾\n\n` +
                    `Dear ${patient.ownerName},\n\n` +
                    `This is a friendly reminder from *Dr. Njimia* at *ACE VET CARE* regarding your pet *${patient.petName}* (${patient.breed}).\n\n` +
                    `💉 *Upcoming Due Vaccine:* ${patient.nextVaccine || 'Core Immunization Booster'}\n` +
                    `📅 *Recommended Due Date:* ${patient.vaccineDueDate || 'As soon as possible'}\n` +
                    `📍 *Location:* Muthaiga Square, Off Kiambu Road, Nairobi\n\n` +
                    `Timely boosters are critical for maintaining ${patient.petName}'s immune protection against lethal viruses.\n\n` +
                    `Reply directly to this WhatsApp message or call *+254 703 824 551* to reserve your 2-hour appointment slot!`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function billPatientRecord(id) {
    const patient = patientsList.find(p => p.id === id);
    if (!patient) return;

    const tabEl = document.querySelector('#billing-tab');
    bootstrap.Tab.getOrCreateInstance(tabEl).show();

    document.getElementById('inv-client-name').value = patient.ownerName;
    document.getElementById('inv-client-phone').value = patient.ownerPhone;
    document.getElementById('inv-pet-name').value = `${patient.petName} (${patient.breed})`;
    updateInvoicePreview();
}

// ==========================================
// 5. CLINICAL WHATSAPP QUICK-MESSAGE HUB
// ==========================================
function populateWhatsAppHubClients() {
    const select = document.getElementById('wa-recipient-select');
    if (!select) return;

    // Combine unique clients from appointments & patients
    let clients = [];
    appointmentsList.forEach(a => {
        if (!clients.some(c => c.phone === a.phone)) {
            clients.push({ name: a.name, phone: a.phone, pet: a.department + ' Patient' });
        }
    });
    patientsList.forEach(p => {
        if (!clients.some(c => c.phone === p.ownerPhone)) {
            clients.push({ name: p.ownerName, phone: p.ownerPhone, pet: p.petName });
        }
    });

    select.innerHTML = `<option value="">-- Choose Client --</option>` + clients.map(c => `
        <option value="${c.phone}" data-name="${escapeHtml(c.name)}" data-pet="${escapeHtml(c.pet)}">${escapeHtml(c.name)} (${c.phone}) - ${escapeHtml(c.pet)}</option>
    `).join('');
}

function handleWhatsAppClientSelect() {
    const select = document.getElementById('wa-recipient-select');
    const selectedOption = select.options[select.selectedIndex];
    if (!selectedOption || !selectedOption.value) return;

    document.getElementById('wa-target-phone').value = selectedOption.value;
    document.getElementById('wa-target-name').value = selectedOption.getAttribute('data-name') || '';
    document.getElementById('wa-target-pet').value = selectedOption.getAttribute('data-pet') || '';
    updateWhatsAppPreview();
}

function applyWhatsAppTemplate(templateKey) {
    const name = document.getElementById('wa-target-name').value || '[Client Name]';
    const pet = document.getElementById('wa-target-pet').value || '[Pet Name]';
    let text = '';

    if (templateKey === 'confirmation') {
        text = `*ACE VET CARE - APPOINTMENT CONFIRMATION* 🐾\n\n` +
               `Dear ${name},\n` +
               `Your veterinary appointment for *${pet}* has been confirmed by *Dr. Njimia*.\n\n` +
               `⏰ *Session Duration:* 2-Hour Comprehensive Clinical Slot\n` +
               `📍 *Clinic Address:* Muthaiga Square, Off Kiambu Road, Nairobi\n` +
               `📞 *Emergency / Hotline:* +254 703 824 551\n\n` +
               `Please arrive 10 minutes prior to your allocated slot. See you soon!`;
    } else if (templateKey === 'vaccine') {
        text = `*ACE VET CARE - VACCINE BOOSTER REMINDER* 💉\n\n` +
               `Hello ${name},\n` +
               `This is Dr. Njimia from ACE VET CARE. *${pet}* is due for their scheduled booster shot.\n\n` +
               `Keeping vaccinations up-to-date safeguards against deadly Parvovirus, Rabies, and respiratory infections.\n\n` +
               `Please let us know your preferred date this week to reserve a slot.`;
    } else if (templateKey === 'postop') {
        text = `*ACE VET CARE - POST-SURGERY CARE CHECK-IN* 🩺\n\n` +
               `Hi ${name},\n` +
               `This is Dr. Njimia following up on *${pet}*'s recovery after today's clinical procedure.\n\n` +
               `• Ensure ${pet} stays in a warm, quiet resting area.\n` +
               `• Offer small sips of water before feeding.\n` +
               `• Keep the surgical incision dry and check for redness.\n\n` +
               `How is ${pet} feeling right now? Reply anytime if you have any questions!`;
    } else if (templateKey === 'deworming') {
        text = `*ACE VET CARE - PREVENTIVE DEWORMING ALERT* 🐾\n\n` +
               `Hello ${name},\n` +
               `Routine 3-month deworming is recommended for *${pet}* to maintain optimal intestinal health, coat vitality, and protect your family.\n\n` +
               `Stop by our clinic along Kiambu Road for broad-spectrum deworming tablets or request a delivery package!`;
    } else if (templateKey === 'results') {
        text = `*ACE VET CARE - MEDICAL TEST RESULTS READY* 🧪\n\n` +
               `Dear ${name},\n` +
               `The diagnostic laboratory test results for *${pet}* are now ready for review.\n\n` +
               `Please give Dr. Njimia a call at *+254 703 824 551* or reply here to discuss the clinical findings and medication prescription.`;
    }

    document.getElementById('wa-message-textarea').value = text;
    updateWhatsAppPreview();
}

function updateWhatsAppPreview() {
    const previewEl = document.getElementById('wa-live-preview');
    if (!previewEl) return;
    const text = document.getElementById('wa-message-textarea').value || 'Select a client and choose a template to preview message...';
    previewEl.textContent = text;
}

function dispatchWhatsAppMessage() {
    const phone = document.getElementById('wa-target-phone').value.replace(/[^0-9]/g, '');
    const message = document.getElementById('wa-message-textarea').value.trim();

    if (!phone) {
        alert('Please enter or select a valid client phone number.');
        return;
    }
    if (!message) {
        alert('Please select or write a message before sending.');
        return;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ==========================================
// 6. SERVICES CATALOG & PRICING MASTER
// ==========================================
function loadServicesCatalog() {
    servicesCatalogList = JSON.parse(localStorage.getItem('acevet_services') || '[]');
    renderServicesCatalog();
}

function renderServicesCatalog() {
    const container = document.getElementById('services-catalog-grid');
    if (!container) return;

    if (servicesCatalogList.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted py-4">No services in catalog.</div>`;
        return;
    }

    container.innerHTML = servicesCatalogList.map((srv, idx) => `
        <div class="col-md-6 col-xl-4">
            <div class="card h-100 border rounded-4 p-3 shadow-sm hover-lift bg-white">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-primary bg-opacity-10 text-primary small">${escapeHtml(srv.category || 'General')}</span>
                    <h5 class="fw-bold text-success mb-0">KES ${srv.price.toLocaleString()}</h5>
                </div>
                <h6 class="fw-bold text-dark mb-1">${escapeHtml(srv.name)}</h6>
                <p class="text-muted small mb-3 flex-grow-1">${escapeHtml(srv.desc || '')}</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-sm flex-grow-1" onclick="addServiceToActiveInvoice(${idx})">
                        <i class="bi bi-plus-circle me-1"></i> Add to Invoice
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteCatalogService('${srv.id}')" title="Delete Service">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function handleAddCustomService(event) {
    event.preventDefault();
    const name = document.getElementById('new-srv-name').value.trim();
    const category = document.getElementById('new-srv-category').value;
    const price = parseFloat(document.getElementById('new-srv-price').value) || 0;
    const desc = document.getElementById('new-srv-desc').value.trim();

    const newSrv = {
        id: 'SRV-' + Date.now().toString().slice(-4),
        name: name,
        category: category,
        price: price,
        desc: desc
    };

    servicesCatalogList.unshift(newSrv);
    localStorage.setItem('acevet_services', JSON.stringify(servicesCatalogList));
    document.getElementById('add-service-form').reset();
    renderServicesCatalog();
    alert(`Service "${name}" added to catalog successfully!`);
}

function deleteCatalogService(id) {
    if (!confirm('Are you sure you want to remove this service from catalog?')) return;
    servicesCatalogList = servicesCatalogList.filter(s => s.id !== id);
    localStorage.setItem('acevet_services', JSON.stringify(servicesCatalogList));
    renderServicesCatalog();
}

function addServiceToActiveInvoice(idx) {
    const srv = servicesCatalogList[idx];
    if (!srv) return;

    invoiceItems.push({ desc: srv.name, qty: 1, price: srv.price });
    renderInvoiceItems();

    const tabEl = document.querySelector('#billing-tab');
    bootstrap.Tab.getOrCreateInstance(tabEl).show();
}

// ==========================================
// 7. INVOICE & BILLING ENGINE
// ==========================================
function populateInvoiceClientDropdown() {
    const select = document.getElementById('invoice-client-select');
    if (!select) return;

    select.innerHTML = `<option value="">-- Choose Client from Bookings --</option>` + appointmentsList.map(apt => `
        <option value="${apt.id}">${escapeHtml(apt.name)} (${apt.phone}) - ${escapeHtml(apt.department)}</option>
    `).join('');
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
    if (!container) return;
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
    const clientName = document.getElementById('inv-client-name') ? (document.getElementById('inv-client-name').value || 'Valued Client') : 'Valued Client';
    const clientPhone = document.getElementById('inv-client-phone') ? (document.getElementById('inv-client-phone').value || '+254 700 000 000') : '+254 700 000 000';
    const petName = document.getElementById('inv-pet-name') ? (document.getElementById('inv-pet-name').value || 'Pet Patient') : 'Pet Patient';

    if (document.getElementById('inv-client-display')) document.getElementById('inv-client-display').textContent = clientName;
    if (document.getElementById('inv-phone-display')) document.getElementById('inv-phone-display').textContent = 'Phone: ' + clientPhone;
    if (document.getElementById('inv-pet-display')) document.getElementById('inv-pet-display').textContent = 'Pet: ' + petName;
    if (document.getElementById('inv-date-display')) document.getElementById('inv-date-display').textContent = 'Date: ' + new Date().toLocaleDateString('en-GB');

    let subtotal = 0;
    const tbody = document.getElementById('invoice-preview-tbody');
    if (tbody) {
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
    }

    if (document.getElementById('inv-subtotal-display')) document.getElementById('inv-subtotal-display').textContent = `KES ${subtotal.toLocaleString()}`;
    if (document.getElementById('inv-total-display')) document.getElementById('inv-total-display').textContent = `KES ${subtotal.toLocaleString()}`;
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
// 8. CSV EXPORT ENGINES
// ==========================================
function exportAppointmentsCSV() {
    if (appointmentsList.length === 0) {
        alert('No appointment records to export.');
        return;
    }
    const headers = ['Ref ID', 'Client Name', 'Phone', 'Email', 'Date', 'Time Slot', 'Department', 'Doctor', 'Status', 'Notes'];
    const rows = appointmentsList.map(a => [
        a.id || '',
        `"${(a.name || '').replace(/"/g, '""')}"`,
        `"${a.phone || ''}"`,
        `"${a.email || ''}"`,
        a.date || '',
        `"${a.time_slot || ''}"`,
        `"${a.department || ''}"`,
        `"${a.doctor || ''}"`,
        a.status || '',
        `"${(a.message || '').replace(/"/g, '""')}"`
    ]);

    downloadCSVFile([headers, ...rows], `acevet_appointments_${new Date().toISOString().split('T')[0]}.csv`);
}

function exportPatientsCSV() {
    if (patientsList.length === 0) {
        alert('No patient records to export.');
        return;
    }
    const headers = ['Patient ID', 'Pet Name', 'Species', 'Breed', 'Age', 'Weight', 'Owner Name', 'Owner Phone', 'Diagnosis', 'Treatment', 'Next Vaccine', 'Vaccine Due Date', 'Last Visit'];
    const rows = patientsList.map(p => [
        p.id || '',
        `"${(p.petName || '').replace(/"/g, '""')}"`,
        p.species || '',
        `"${(p.breed || '').replace(/"/g, '""')}"`,
        `"${p.age || ''}"`,
        `"${p.weight || ''}"`,
        `"${(p.ownerName || '').replace(/"/g, '""')}"`,
        `"${p.ownerPhone || ''}"`,
        `"${(p.diagnosis || '').replace(/"/g, '""')}"`,
        `"${(p.treatment || '').replace(/"/g, '""')}"`,
        `"${(p.nextVaccine || '').replace(/"/g, '""')}"`,
        p.vaccineDueDate || '',
        p.lastVisit || ''
    ]);

    downloadCSVFile([headers, ...rows], `acevet_patients_ehr_${new Date().toISOString().split('T')[0]}.csv`);
}

function exportInvoicesCSV() {
    let subtotal = 0;
    const clientName = document.getElementById('inv-client-name').value || 'Client';
    const petName = document.getElementById('inv-pet-name').value || 'Pet';
    const invNum = document.getElementById('inv-number-display').textContent;

    const headers = ['Invoice No', 'Client', 'Pet', 'Date', 'Item Description', 'Qty', 'Unit Price (KES)', 'Total (KES)'];
    const rows = invoiceItems.map(i => {
        const itemTot = i.qty * i.price;
        subtotal += itemTot;
        return [
            invNum,
            `"${clientName.replace(/"/g, '""')}"`,
            `"${petName.replace(/"/g, '""')}"`,
            new Date().toISOString().split('T')[0],
            `"${i.desc.replace(/"/g, '""')}"`,
            i.qty,
            i.price,
            itemTot
        ];
    });

    downloadCSVFile([headers, ...rows], `acevet_invoice_${invNum}.csv`);
}

function downloadCSVFile(dataArray, filename) {
    const csvContent = "data:text/csv;charset=utf-8," + dataArray.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==========================================
// 9. CALENDAR & DATE BLOCKING
// ==========================================
function loadBlockedDates() {
    blockedDatesList = JSON.parse(localStorage.getItem('acevet_blocked_dates') || '[]');
    renderBlockedDatesList();
    renderAdminCalendar();
}

function renderBlockedDatesList() {
    const container = document.getElementById('blocked-dates-list');
    if (!container) return;
    if (document.getElementById('blocked-count')) document.getElementById('blocked-count').textContent = blockedDatesList.length;

    if (blockedDatesList.length === 0) {
        container.innerHTML = `<p class="text-muted small">No blocked dates currently active.</p>`;
        return;
    }

    container.innerHTML = blockedDatesList.map(b => `
        <div class="d-flex justify-content-between align-items-center p-2 rounded bg-danger bg-opacity-10 border border-danger border-opacity-25">
            <div>
                <div class="fw-bold text-danger small"><i class="bi bi-slash-circle me-1"></i>${b.date} (${b.slot})</div>
                <div class="text-muted" style="font-size: 0.75rem;">${escapeHtml(b.reason)}</div>
            </div>
            <button class="btn btn-link text-danger btn-sm p-0 ms-2" onclick="unblockDate('${b.id}')" title="Unblock Date">
                <i class="bi bi-x-circle-fill"></i>
            </button>
        </div>
    `).join('');
}

function handleBlockDate(event) {
    event.preventDefault();
    const date = document.getElementById('block-date-input').value;
    const slot = document.getElementById('block-slot-select').value;
    const reason = document.getElementById('block-reason-input').value.trim();

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
    updateKPICounters();
    alert(`Date ${date} (${slot}) blocked successfully!`);
}

function unblockDate(id) {
    blockedDatesList = blockedDatesList.filter(b => b.id !== id);
    localStorage.setItem('acevet_blocked_dates', JSON.stringify(blockedDatesList));
    loadBlockedDates();
    updateKPICounters();
}

function changeMonth(delta) {
    currentCalDate.setMonth(currentCalDate.getMonth() + delta);
    renderAdminCalendar();
}

function renderAdminCalendar() {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;

    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    if (document.getElementById('cal-month-title')) {
        document.getElementById('cal-month-title').textContent = `${monthNames[month]} ${year}`;
    }

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `
    <table class="table table-bordered text-center align-middle" style="table-layout: fixed;">
        <thead class="bg-light">
            <tr>
                <th class="text-danger small">Sun</th>
                <th class="small">Mon</th>
                <th class="small">Tue</th>
                <th class="small">Wed</th>
                <th class="small">Thu</th>
                <th class="small">Fri</th>
                <th class="text-primary small">Sat</th>
            </tr>
        </thead>
        <tbody>
    `;

    let date = 1;
    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                html += '<td class="bg-light text-muted opacity-25"></td>';
            } else if (date > daysInMonth) {
                html += '<td class="bg-light text-muted opacity-25"></td>';
            } else {
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                
                const aptCount = appointmentsList.filter(a => a.date === dateString).length;
                const isBlocked = blockedDatesList.some(b => b.date === dateString);

                let cellClass = '';
                let badge = '';

                if (isBlocked) {
                    cellClass = 'bg-danger bg-opacity-10 border-danger';
                    badge = `<div class="badge bg-danger p-1 mt-1" style="font-size: 0.65rem;">BLOCKED</div>`;
                } else if (aptCount > 0) {
                    cellClass = 'bg-primary bg-opacity-10';
                    badge = `<div class="badge bg-primary p-1 mt-1" style="font-size: 0.65rem;">${aptCount} Slots</div>`;
                }

                html += `
                <td class="${cellClass}" style="height: 75px; vertical-align: top; cursor: pointer;" onclick="handleCalendarDateClick('${dateString}')">
                    <div class="fw-bold small text-dark">${date}</div>
                    ${badge}
                </td>`;
                date++;
            }
        }
        html += '</tr>';
        if (date > daysInMonth) break;
    }

    html += '</tbody></table>';
    grid.innerHTML = html;
    renderCalendarScheduleTable();
}

function handleCalendarDateClick(dateString) {
    if (document.getElementById('block-date-input')) {
        document.getElementById('block-date-input').value = dateString;
    }
    
    const aptsOnDate = appointmentsList.filter(a => a.date === dateString);
    const isBlocked = blockedDatesList.find(b => b.date === dateString);
    
    // Parse Date for friendly header
    let formattedDate = dateString;
    try {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            formattedDate = dateObj.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
    } catch (e) {
        formattedDate = dateString;
    }
    
    const titleEl = document.getElementById('dateAppointmentsModalLabel');
    const subEl = document.getElementById('dateAppointmentsModalSub');
    const body = document.getElementById('dateAppointmentsModalBody');

    if (titleEl) titleEl.innerHTML = `<i class="bi bi-calendar-event text-primary me-2"></i>Appointments for ${formattedDate}`;
    if (subEl) subEl.textContent = `${aptsOnDate.length} Client Booking(s) • Date: ${dateString}`;
    if (!body) return;

    let html = '';

    if (isBlocked) {
        html += `
        <div class="alert alert-danger d-flex align-items-center justify-content-between p-3 rounded-3 mb-3">
            <div class="d-flex align-items-center gap-2">
                <i class="bi bi-slash-circle-fill fs-5 text-danger"></i>
                <div>
                    <strong class="d-block text-danger">This Date is Currently BLOCKED (${escapeHtml(isBlocked.slot)})</strong>
                    <small class="text-muted">${escapeHtml(isBlocked.reason || 'Clinic Disinfection / Off-duty')}</small>
                </div>
            </div>
            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="unblockDate('${isBlocked.id}'); handleCalendarDateClick('${dateString}');">Unblock Date</button>
        </div>`;
    }

    if (aptsOnDate.length === 0) {
        html += `
        <div class="text-center py-4">
            <div class="mb-3 text-muted opacity-50">
                <i class="bi bi-calendar-x" style="font-size: 3.2rem;"></i>
            </div>
            <h6 class="fw-bold text-dark mb-1">No Client Bookings on this Date</h6>
            <p class="text-muted small mb-3">There are currently no 2-hour clinical appointments scheduled for ${formattedDate}.</p>
            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="scrollToBlockDate('${dateString}')" data-bs-dismiss="modal">
                <i class="bi bi-slash-circle me-1"></i> Block This Date in Schedule
            </button>
        </div>`;
    } else {
        html += `
        <div class="table-responsive">
            <table class="table align-middle table-hover">
                <thead class="bg-light">
                    <tr>
                        <th class="small">2-Hr Time Slot</th>
                        <th class="small">Client & Contact</th>
                        <th class="small">Service & Notes</th>
                        <th class="small">Status</th>
                        <th class="small text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${aptsOnDate.map(a => {
                        const phoneDigits = (a.phone || '').replace(/[^0-9]/g, '');
                        const waMsg = encodeURIComponent(`Hello ${a.name}, this is Dr. Njimia from ACE VET CARE following up on your appointment on ${a.date} (${a.time_slot}) for ${a.department}.`);
                        
                        return `
                        <tr>
                            <td>
                                <span class="badge bg-primary bg-opacity-10 text-primary fw-semibold px-2 py-1">
                                    <i class="bi bi-clock me-1"></i>${escapeHtml(a.time_slot || 'All Day')}
                                </span>
                            </td>
                            <td>
                                <div class="fw-bold text-dark">${escapeHtml(a.name)}</div>
                                <small class="text-muted"><i class="bi bi-telephone me-1"></i>${escapeHtml(a.phone)}</small>
                            </td>
                            <td>
                                <div class="fw-semibold small text-dark">${escapeHtml(a.department)}</div>
                                <small class="text-muted text-truncate d-block" style="max-width: 170px;">${escapeHtml(a.message || 'Standard consultation')}</small>
                            </td>
                            <td>
                                <select class="form-select form-select-sm" style="width: auto; font-size: 0.8rem;" onchange="updateAppointmentStatus('${a.id}', this.value); handleCalendarDateClick('${dateString}');">
                                    <option value="Pending" ${a.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                    <option value="Confirmed" ${a.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                                    <option value="Completed" ${a.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                    <option value="Cancelled" ${a.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                            </td>
                            <td class="text-end">
                                <div class="btn-group btn-group-sm">
                                    <a href="https://wa.me/${phoneDigits}?text=${waMsg}" target="_blank" class="btn btn-outline-success" title="WhatsApp Client">
                                        <i class="bi bi-whatsapp"></i>
                                    </a>
                                    <button class="btn btn-outline-primary" title="Create Invoice" onclick="loadClientToInvoice('${a.id}')" data-bs-dismiss="modal">
                                        <i class="bi bi-receipt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
    }

    body.innerHTML = html;
    const modal = new bootstrap.Modal(document.getElementById('dateAppointmentsModal'));
    modal.show();
}

function scrollToBlockDate(dateString) {
    const input = document.getElementById('block-date-input');
    if (input) {
        input.value = dateString;
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const reasonInput = document.getElementById('block-reason-input');
        if (reasonInput) reasonInput.focus();
    }
}

function renderCalendarScheduleTable() {
    const tbody = document.getElementById('cal-schedule-tbody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('search-cal-schedule') ? document.getElementById('search-cal-schedule').value.toLowerCase().trim() : '');

    // Sort chronologically by date then time_slot
    let sorted = [...appointmentsList].sort((a, b) => {
        if (a.date === b.date) {
            return (a.time_slot || '').localeCompare(b.time_slot || '');
        }
        return (a.date || '').localeCompare(b.date || '');
    });

    if (searchTerm) {
        sorted = sorted.filter(a => 
            (a.name && a.name.toLowerCase().includes(searchTerm)) ||
            (a.phone && a.phone.toLowerCase().includes(searchTerm)) ||
            (a.date && a.date.toLowerCase().includes(searchTerm)) ||
            (a.department && a.department.toLowerCase().includes(searchTerm)) ||
            (a.status && a.status.toLowerCase().includes(searchTerm))
        );
    }

    if (sorted.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4"><i class="bi bi-inbox fs-3 d-block mb-2 opacity-50"></i>No scheduled client appointments match your search.</td></tr>`;
        return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    tbody.innerHTML = sorted.map(a => {
        const isToday = a.date === todayStr;
        const isPast = a.date < todayStr;
        
        let dateBadge = `<span class="fw-semibold text-dark">${a.date}</span>`;
        if (isToday) {
            dateBadge = `<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1"><i class="bi bi-star-fill me-1"></i>Today (${a.date})</span>`;
        } else if (isPast) {
            dateBadge = `<span class="badge bg-light text-muted border px-2 py-1">${a.date}</span>`;
        }

        let statusBadgeClass = 'badge-pending';
        if (a.status === 'Confirmed') statusBadgeClass = 'badge-confirmed';
        else if (a.status === 'Completed') statusBadgeClass = 'badge-completed';
        else if (a.status === 'Cancelled') statusBadgeClass = 'badge-cancelled';

        const phoneDigits = (a.phone || '').replace(/[^0-9]/g, '');
        const waMsg = encodeURIComponent(`Hello ${a.name}, this is Dr. Njimia from ACE VET CARE regarding your booking on ${a.date} (${a.time_slot}).`);

        return `
        <tr>
            <td>
                <div>${dateBadge}</div>
                <small class="text-primary fw-semibold"><i class="bi bi-clock me-1"></i>${escapeHtml(a.time_slot || '2-Hour Slot')}</small>
            </td>
            <td>
                <div class="fw-bold text-dark">${escapeHtml(a.name)}</div>
                <small class="text-muted"><i class="bi bi-envelope me-1"></i>${escapeHtml(a.email || 'N/A')}</small>
            </td>
            <td>
                <div class="fw-semibold text-dark">${escapeHtml(a.phone)}</div>
                <small class="text-muted">Ref: ${escapeHtml(a.id || 'APT')}</small>
            </td>
            <td>
                <span class="badge bg-light text-dark border">${escapeHtml(a.department)}</span>
                <div class="small text-muted text-truncate" style="max-width: 170px;">${escapeHtml(a.message || 'General checkup')}</div>
            </td>
            <td>
                <div class="small fw-semibold text-dark">${escapeHtml(a.doctor || 'Dr. Njimia')}</div>
            </td>
            <td>
                <span class="status-badge ${statusBadgeClass}">${a.status}</span>
            </td>
            <td class="text-end">
                <div class="btn-group btn-group-sm">
                    <a href="https://wa.me/${phoneDigits}?text=${waMsg}" target="_blank" class="btn btn-outline-success" title="WhatsApp Client">
                        <i class="bi bi-whatsapp"></i>
                    </a>
                    <button class="btn btn-outline-primary" title="Bill Client" onclick="loadClientToInvoice('${a.id}')">
                        <i class="bi bi-receipt"></i>
                    </button>
                    <button class="btn btn-outline-success" title="Confirm Booking" onclick="updateAppointmentStatus('${a.id}', 'Confirmed')">
                        <i class="bi bi-check-lg"></i>
                    </button>
                    <button class="btn btn-outline-danger" title="Cancel Booking" onclick="updateAppointmentStatus('${a.id}', 'Cancelled')">
                        <i class="bi bi-x-circle"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

// ==========================================
// 10. BLOG PUBLISHER
// ==========================================
function loadBlogArticles() {
    blogArticlesList = JSON.parse(localStorage.getItem('acevet_blog_articles') || '[]');
    const container = document.getElementById('articles-list-container');
    if (!container) return;

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
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
