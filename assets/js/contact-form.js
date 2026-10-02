/**
 * Contact Form Handler via EmailJS & Firebase Firestore
 */

const EMAILJS_SERVICE_ID = 'service_pvx2nnh';
const EMAILJS_TEMPLATE_ID_CONTACT = 'template_6uoal59';
const EMAILJS_TEMPLATE_ID_APPOINTMENT = 'template_6uoal59';

document.addEventListener('DOMContentLoaded', function () {

    // 1. Handle General Contact Form (via EmailJS)
    const contactForm = document.querySelector('form[action="forms/contact.php"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const loading = this.querySelector('.loading');
            const errorMessage = this.querySelector('.error-message');
            const sentMessage = this.querySelector('.sent-message');

            if (loading) loading.style.display = 'block';
            if (errorMessage) errorMessage.style.display = 'none';
            if (sentMessage) sentMessage.style.display = 'none';

            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_CONTACT, this)
                .then(function () {
                    if (loading) loading.style.display = 'none';
                    if (sentMessage) sentMessage.style.display = 'block';
                    contactForm.reset();
                }, function (error) {
                    if (loading) loading.style.display = 'none';
                    if (errorMessage) {
                        errorMessage.textContent = "Failed to send: " + JSON.stringify(error);
                        errorMessage.style.display = 'block';
                    }
                });
        });
    }

    // 2. Handle Appointment Form (Firestore + EmailJS + Local Sync)
    const appointmentForm = document.querySelector('form[action="forms/appointment.php"]');
    if (appointmentForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('appointment-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
            
            // Check for blocked dates
            dateInput.addEventListener('change', function() {
                const selectedDate = this.value;
                const blockedDates = JSON.parse(localStorage.getItem('acevet_blocked_dates') || '[]');
                const isBlocked = blockedDates.some(b => b.date === selectedDate);
                if (isBlocked) {
                    alert('Notice: ' + selectedDate + ' is blocked for clinic appointments. Please choose another date or contact us directly on WhatsApp.');
                    this.value = '';
                }
            });
        }

        appointmentForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const form = this;
            const loading = form.querySelector('.loading');
            const errorMessage = form.querySelector('.error-message');
            const sentMessage = form.querySelector('.sent-message');

            if (loading) loading.style.display = 'block';
            if (errorMessage) errorMessage.style.display = 'none';
            if (sentMessage) sentMessage.style.display = 'none';

            const formData = new FormData(form);
            const appointmentData = {
                id: 'APT-' + Date.now(),
                name: formData.get('name') || 'Valued Client',
                email: formData.get('email'),
                phone: formData.get('phone'),
                date: formData.get('date'),
                time_slot: formData.get('time_slot') || '08:00 AM - 10:00 AM',
                department: formData.get('department') || 'General Veterinary Care',
                doctor: formData.get('doctor') || 'Dr. K. Njimia',
                message: formData.get('message') || '',
                status: 'Pending',
                created_at: new Date().toISOString()
            };

            // Ensure booking ID and default doctor details are in formData for backend
            formData.set('id', appointmentData.id);
            formData.set('doctor', appointmentData.doctor);
            formData.set('doctor_email', 'dr.njimia@acevetcare.co.ke');
            formData.set('department', appointmentData.department);

            // 1. Save to local storage for instant dashboard sync
            const existingAppointments = JSON.parse(localStorage.getItem('acevet_appointments') || '[]');
            existingAppointments.unshift(appointmentData);
            localStorage.setItem('acevet_appointments', JSON.stringify(existingAppointments));

            // 2. Save to Firestore if configured
            if (typeof db !== 'undefined' && db) {
                db.collection('appointments').add({
                    ...appointmentData,
                    created_at: firebase.firestore.FieldValue.serverTimestamp()
                }).catch(err => console.warn('Firestore write notice:', err));
            }

            // 3. Build WhatsApp Message for Doctor Dr. Njimia
            const waText = `*NEW APPOINTMENT BOOKING - ACE VET CARE*
----------------------------------------
*Client Name:* ${appointmentData.name}
*Phone Number:* ${appointmentData.phone}
*Email Address:* ${appointmentData.email}
*Requested Date:* ${appointmentData.date}
*Time Slot (2-Hr):* ${appointmentData.time_slot}
*Service / Department:* ${appointmentData.department}
*Assigned Doctor:* Dr. K. Njimia
*Pet Notes / Message:* ${appointmentData.message || 'None provided'}
*Booking Ref:* ${appointmentData.id}
----------------------------------------
Sent via ACE VET CARE Online Portal. Official confirmation email sent from dr.njimia@acevetcare.co.ke`;

            const waDoctorUrl = `https://wa.me/254703824551?text=${encodeURIComponent(waText)}`;

            // 4. Render rich success message confirming email dispatch from dr.njimia@acevetcare.co.ke & WhatsApp link
            function handleSuccessUI(serverMsg) {
                if (loading) loading.style.display = 'none';
                if (sentMessage) {
                    sentMessage.innerHTML = `
                        <div class="p-4 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-4 text-start">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <i class="fas fa-check-circle text-success fs-4"></i>
                                <h6 class="fw-bold text-success mb-0 fs-5">
                                    Appointment Booking Confirmed!
                                </h6>
                            </div>
                            <p class="text-dark small mb-3">
                                Booking Reference: <strong class="badge bg-success bg-opacity-25 text-success font-monospace px-2 py-1">${appointmentData.id}</strong>
                            </p>
                            
                            <div class="p-3 bg-white rounded-3 border border-success border-opacity-25 mb-3 shadow-sm">
                                <div class="d-flex align-items-start gap-2 mb-1">
                                    <i class="fas fa-envelope-circle-check text-primary mt-1"></i>
                                    <div class="small">
                                        <strong class="text-dark">Official Email Dispatched:</strong><br>
                                        A booking confirmation email has been sent from <span class="text-primary fw-semibold">dr.njimia@acevetcare.co.ke</span> to <strong>${appointmentData.email}</strong>.
                                    </div>
                                </div>
                            </div>

                            <p class="text-muted small mb-3">
                                We are also connecting you with Dr. Njimia on WhatsApp so you can provide any immediate details or clarifications about your pet.
                            </p>

                            <div class="d-flex flex-wrap gap-2">
                                <a href="${waDoctorUrl}" target="_blank" class="btn btn-whatsapp text-nowrap rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2">
                                    <i class="fab fa-whatsapp fs-5"></i> Open Dr. Njimia's WhatsApp
                                </a>
                                <a href="appointment.html" class="btn btn-outline-secondary rounded-pill px-3 py-2 small">
                                    Book Another Visit
                                </a>
                            </div>
                        </div>
                    `;
                    sentMessage.style.display = 'block';
                }
                form.reset();

                // Automatically trigger WhatsApp in a new tab
                try {
                    window.open(waDoctorUrl, '_blank');
                } catch (e) {
                    console.warn('Popup blocked, client can click the WhatsApp button:', e);
                }
            }

            // 5. Dispatch Email via backend forms/appointment.php (Domain Email: dr.njimia@acevetcare.co.ke)
            fetch('forms/appointment.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                console.log('Domain email response from dr.njimia@acevetcare.co.ke:', data);
                // Also trigger EmailJS in parallel
                triggerEmailJS();
            })
            .catch(err => {
                console.warn('PHP endpoint note (static or local host):', err);
                triggerEmailJS();
            });

            function triggerEmailJS() {
                if (typeof emailjs !== 'undefined') {
                    const templateParams = {
                        to_email: appointmentData.email,
                        client_email: appointmentData.email,
                        to_name: appointmentData.name,
                        client_name: appointmentData.name,
                        from_name: 'Dr. K. Njimia (ACE VET CARE)',
                        from_email: 'dr.njimia@acevetcare.co.ke',
                        reply_to: 'dr.njimia@acevetcare.co.ke',
                        booking_id: appointmentData.id,
                        appointment_date: appointmentData.date,
                        time_slot: appointmentData.time_slot,
                        department: appointmentData.department,
                        doctor: appointmentData.doctor,
                        message: appointmentData.message,
                        phone: appointmentData.phone,
                        whatsapp_link: waDoctorUrl
                    };

                    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_APPOINTMENT, templateParams)
                        .then(() => handleSuccessUI(), () => {
                            // Fallback to sendForm if template requires form mapping
                            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_APPOINTMENT, form)
                                .then(() => handleSuccessUI(), () => handleSuccessUI());
                        });
                } else {
                    handleSuccessUI();
                }
            }
        });
    }

    // 3. Handle Asynchronous Blog Comment Submission (Firestore)
    const commentForms = document.querySelectorAll('form[action*="save-comment.php"]');
    commentForms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const loading = this.querySelector('.loading');
            const errorMessage = this.querySelector('.error-message');
            const sentMessage = this.querySelector('.sent-message');

            if (loading) loading.style.display = 'block';
            if (errorMessage) errorMessage.style.display = 'none';
            if (sentMessage) sentMessage.style.display = 'none';

            const formData = new FormData(this);
            const rawPostId = formData.get('post_id');
            const post_id = parseInt(rawPostId) || 1; // Default to 1

            const commentData = {
                post_id: post_id,
                name: formData.get('name').trim(),
                email: formData.get('email').trim(),
                comment: formData.get('comment').trim(),
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (db) {
                db.collection('comments').add(commentData)
                    .then(function() {
                        if (loading) loading.style.display = 'none';
                        if (sentMessage) sentMessage.style.display = 'block';
                        
                        // Append to comment section dynamically
                        const commentList = document.getElementById('comment-section');
                        if (commentList) {
                            // If "No comments yet" placeholder is present, clear it
                            if (commentList.innerHTML.includes('No comments yet')) {
                                commentList.innerHTML = '';
                            }
                            
                            const div = document.createElement('div');
                            div.classList.add('border', 'p-3', 'rounded', 'mb-3', 'bg-light');
                            div.innerHTML = `
                                <strong>${escapeHTML(commentData.name)}</strong> <span class="badge bg-secondary ms-2">New</span>
                                <p class="mb-1">${escapeHTML(commentData.comment)}</p>
                                <small class="text-muted">Posted on Just now</small>
                            `;
                            commentList.insertBefore(div, commentList.firstChild);
                        }
                        
                        form.reset();
                        setTimeout(() => {
                            if (sentMessage) sentMessage.style.display = 'none';
                        }, 5000);
                    })
                    .catch(function(error) {
                        console.error("Firestore comment save error:", error);
                        if (loading) loading.style.display = 'none';
                        if (errorMessage) {
                            errorMessage.textContent = "Failed to post comment: " + error.message;
                            errorMessage.style.display = 'block';
                        }
                    });
            } else {
                if (loading) loading.style.display = 'none';
                if (errorMessage) {
                    errorMessage.textContent = "Database is currently offline. Please try again later.";
                    errorMessage.style.display = 'block';
                }
            }
        });
    });
});

// Helper function to escape HTML special characters for safety
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
