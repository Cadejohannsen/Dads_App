// ===== PE Assessment Tracker - Full Application =====

class App {
    constructor() {
        this.students = [];
        this.classes = [];
        this.assessments = [];
        this.grades = {};
        this.selectedItem = null;
        this.currentTab = 'assessments';
        
        // Carousel and profile data
        this.carouselImages = [];
        this.currentCarouselIndex = 0;
        this.userProfile = {
            name: 'PE Teacher',
            email: 'teacher@school.edu',
            school: 'High School',
            role: 'Physical Education'
        };

        this.load();
        this.bind();
        this.applySettings();
        this.renderAll();
        this.updateProfileAvatar();
        this.showDashboard();
    }

    // ===== Data =====
    load() {
        // Clear old format data - version 3: middle school grades + profile page
        const ver = localStorage.getItem('pe_version');
        if (ver !== '3') {
            localStorage.removeItem('pe_grades');
            localStorage.removeItem('pe_students');
            localStorage.removeItem('pe_classes');
            localStorage.setItem('pe_version', '3');
        }
        
        // Load carousel images
        this.carouselImages = JSON.parse(localStorage.getItem('pe_carousel_images') || 'null') || [
            { id: 1, url: 'https://picsum.photos/seed/pe1/800/300.jpg', title: 'PE Class' },
            { id: 2, url: 'https://picsum.photos/seed/pe2/800/300.jpg', title: 'Sports Day' },
            { id: 3, url: 'https://picsum.photos/seed/pe3/800/300.jpg', title: 'Fitness Training' }
        ];
        
        // Load user profile
        const savedProfile = localStorage.getItem('pe_user_profile');
        if (savedProfile) this.userProfile = JSON.parse(savedProfile);
        // Initialize default profile fields if they don't exist
        if (!this.userProfile.firstName) this.userProfile.firstName = '';
        if (!this.userProfile.lastName) this.userProfile.lastName = '';
        if (!this.userProfile.email) this.userProfile.email = '';
        if (!this.userProfile.title) this.userProfile.title = '';
        if (!this.userProfile.school) this.userProfile.school = '';
        if (!this.userProfile.bio) this.userProfile.bio = '';
        if (!this.userProfile.picture) this.userProfile.picture = '';
        this.students = JSON.parse(localStorage.getItem('pe_students') || 'null') || [
            { id: 'S001', first: 'Alex', last: 'Johnson', grade: 6, period: 1 },
            { id: 'S002', first: 'Sam', last: 'Smith', grade: 7, period: 2 },
            { id: 'S003', first: 'Jordan', last: 'Williams', grade: 8, period: 1 },
            { id: 'S004', first: 'Casey', last: 'Brown', grade: 6, period: 3 },
            { id: 'S005', first: 'Morgan', last: 'Davis', grade: 7, period: 2 },
            { id: 'S006', first: 'Riley', last: 'Miller', grade: 8, period: 4 },
            { id: 'S007', first: 'Quinn', last: 'Wilson', grade: 6, period: 3 },
            { id: 'S008', first: 'Avery', last: 'Moore', grade: 7, period: 1 }
        ];
        this.classes = JSON.parse(localStorage.getItem('pe_classes') || 'null') || [
            { id: 'C001', name: 'PE 6 - Fitness Fundamentals', period: '1', grade: '6' },
            { id: 'C002', name: 'PE 7 - Team Sports', period: '2', grade: '7' },
            { id: 'C003', name: 'PE 8 - Advanced Conditioning', period: '3', grade: '8' }
        ];
        this.assessments = JSON.parse(localStorage.getItem('pe_assessments') || 'null') || [
            { id: 'A001', name: 'Mile Run', type: 'cardio', exercises: '1-Mile Timed Run\nWarm-up Jog (400m)\nCool-down Walk', standards: 'A: Under 6:30\nB: 6:30-7:30\nC: 7:30-9:00\nD: 9:00-10:30\nF: Over 10:30', periods: ['1','2','3'], date: '2026-02-10' },
            { id: 'A002', name: 'Strength Test', type: 'strength', exercises: 'Push-ups (1 min)\nSit-ups (1 min)\nPlank Hold\nWall Sit', standards: 'A: 45+ push-ups, 50+ sit-ups, 2+ min plank\nB: 30-44 push-ups, 35-49 sit-ups, 1-2 min plank\nC: 20-29, 25-34, 45s-1 min\nD: Below minimums', periods: ['1','3'], date: '2026-02-12' },
            { id: 'A003', name: 'Basketball Skills', type: 'skills', exercises: 'Dribble Course\nFree Throws (10 attempts)\nLayup Drill\n3-on-3 Scrimmage', standards: 'Graded on technique, accuracy, and hustle', periods: ['2'], date: '2026-02-14' },
            { id: 'A004', name: 'Flexibility Assessment', type: 'flexibility', exercises: 'Sit and Reach\nShoulder Stretch\nHamstring Test\nHip Flexor Test', standards: 'A: Exceeds standards\nB: Meets standards\nC: Approaching\nD: Below', periods: ['1','2','3'], date: '2026-02-15' }
        ];
        this.grades = JSON.parse(localStorage.getItem('pe_grades') || 'null') || {
            'S001': { 'A001': { time: '6:45', reps: '', notes: 'Good pace', date: '2026-02-10' }, 'A002': { time: '', reps: '38', notes: 'Strong effort', date: '2026-02-12' } },
            'S002': { 'A001': { time: '5:58', reps: '', notes: 'Excellent', date: '2026-02-10' }, 'A002': { time: '', reps: '52', notes: 'Outstanding', date: '2026-02-12' }, 'A004': { time: '', reps: '+4 inches', notes: '', date: '2026-02-15' } },
            'S003': { 'A003': { time: '', reps: '8/10 FT', notes: 'Great shooting', date: '2026-02-14' } },
            'S004': { 'A003': { time: '', reps: '6/10 FT', notes: 'Improving', date: '2026-02-14' } },
            'S005': { 'A001': { time: '7:12', reps: '', notes: '', date: '2026-02-10' }, 'A002': { time: '', reps: '41', notes: '', date: '2026-02-12' } },
            'S006': { 'A001': { time: '7:55', reps: '', notes: 'Keep working', date: '2026-02-10' } },
            'S009': { 'A001': { time: '6:20', reps: '', notes: 'Fast!', date: '2026-02-10' }, 'A004': { time: '', reps: '+6 inches', notes: 'Very flexible', date: '2026-02-15' } }
        };
    }

    save() {
        localStorage.setItem('pe_students', JSON.stringify(this.students));
        localStorage.setItem('pe_classes', JSON.stringify(this.classes));
        localStorage.setItem('pe_assessments', JSON.stringify(this.assessments));
        localStorage.setItem('pe_grades', JSON.stringify(this.grades));
        localStorage.setItem('pe_carousel_images', JSON.stringify(this.carouselImages));
        localStorage.setItem('pe_user_profile', JSON.stringify(this.userProfile));
    }

    // ===== Event Binding =====
    bind() {
        // Nav tabs
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Sidebar add buttons
        document.getElementById('addAssessmentBtn').addEventListener('click', () => this.openModal('assessment'));
        document.getElementById('addClassBtn').addEventListener('click', () => this.openModal('class'));
        document.getElementById('addStudentBtn').addEventListener('click', () => this.openModal('student'));

        
        // Score filter
        document.getElementById('scoreFilter').addEventListener('change', () => this.renderSidebarScores());

        // Leaderboard filters - removed automatic apply, now only works with Apply button
        document.getElementById('lbApplyFilters').addEventListener('click', () => {
            this.renderLeaderboard();
        });
        document.getElementById('lbResetFilters').addEventListener('click', () => {
            document.getElementById('lbFilterAssessment').value = 'all';
            document.getElementById('lbFilterPeriod').value = 'all';
            document.getElementById('lbFilterGrade').value = 'all';
            document.getElementById('lbSortBy').value = 'result-asc';
            this.renderLeaderboard();
        });

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('settingsPanel').classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.settings-wrap')) document.getElementById('settingsPanel').classList.remove('open');
        });

        // Color dots
        document.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                document.documentElement.setAttribute('data-color', dot.dataset.color);
                localStorage.setItem('pe_color', dot.dataset.color);
            });
        });

        // Theme switch
        document.getElementById('themeSwitch').addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                document.getElementById('themeLabel').textContent = 'Dark Mode';
                localStorage.setItem('pe_theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.getElementById('themeLabel').textContent = 'Light Mode';
                localStorage.setItem('pe_theme', 'dark');
            }
        });

        // Modal close
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal();
        });

        // Back buttons
        document.getElementById('backFromAssessment').addEventListener('click', () => this.showDashboard());
        document.getElementById('backFromClass').addEventListener('click', () => this.showDashboard());
        document.getElementById('backFromStudent').addEventListener('click', () => this.showDashboard());
        document.getElementById('backFromProfile').addEventListener('click', () => this.showDashboard());

        // Edit buttons
        document.getElementById('editAssessmentBtn').addEventListener('click', () => this.editAssessment());
        document.getElementById('editClassBtn').addEventListener('click', () => this.editClass());
        document.getElementById('editStudentBtn').addEventListener('click', () => this.editStudent());

        // Delete buttons
        document.getElementById('deleteAssessmentBtn').addEventListener('click', () => this.deleteAssessment());
        document.getElementById('deleteClassBtn').addEventListener('click', () => this.deleteClass());
        document.getElementById('deleteStudentBtn').addEventListener('click', () => this.deleteStudent());

        // Global search
        document.getElementById('globalSearch').addEventListener('input', (e) => this.globalSearch(e.target.value));

        // Student filters
        document.getElementById('studentNameFilter').addEventListener('input', () => this.filterStudents());
        document.getElementById('studentGradeFilter').addEventListener('change', () => this.filterStudents());
        document.getElementById('studentPeriodFilter').addEventListener('change', () => this.filterStudents());
        document.getElementById('studentIdFilter').addEventListener('input', () => this.filterStudents());
        document.getElementById('resetStudentFilters').addEventListener('click', () => this.resetStudentFilters());

        // Profile button and page
        document.getElementById('profileBtn').addEventListener('click', () => this.openProfilePage());
        document.getElementById('changeProfilePictureBtn').addEventListener('click', () => {
            document.getElementById('profilePictureInput').click();
        });
        document.getElementById('profilePictureInput').addEventListener('change', (e) => {
            this.handleProfilePictureUpload(e);
        });
        document.getElementById('cancelProfileChanges').addEventListener('click', () => {
            this.showDashboard();
        });
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfileChanges();
        });

        // Class student search
        document.getElementById('classStudentSearch').addEventListener('input', (e) => this.searchClassStudents(e.target.value));

        // Students page buttons
        document.getElementById('addStudentPageBtn').addEventListener('click', () => this.openModal('student'));
        document.getElementById('spApplyFilters').addEventListener('click', () => this.renderStudentsPage());
        document.getElementById('spResetFilters').addEventListener('click', () => {
            document.getElementById('spNameFilter').value = '';
            document.getElementById('spGradeFilter').value = 'all';
            document.getElementById('spPeriodFilter').value = 'all';
            document.getElementById('spIdFilter').value = '';
            this.renderStudentsPage();
        });

        // Classes page button
        document.getElementById('addClassPageBtn').addEventListener('click', () => this.openModal('class'));

        // Bulk import & export
        document.getElementById('bulkImportBtn').addEventListener('click', () => this.openBulkImportModal());
        document.getElementById('exportStudentsBtn').addEventListener('click', () => this.exportStudentsCSV());
        document.getElementById('exportStudentReportBtn').addEventListener('click', () => this.exportStudentReport());

        // Reports
        document.getElementById('reportApplyBtn').addEventListener('click', () => this.renderReport());
        document.getElementById('exportClassReportBtn').addEventListener('click', () => this.exportClassReportCSV());
        document.getElementById('exportFullReportBtn').addEventListener('click', () => this.exportFullDataCSV());
        document.getElementById('reportNavClassSummary').addEventListener('click', () => { this.showView('report'); this.renderReport(); });
        document.getElementById('reportNavAssessment').addEventListener('click', () => { this.showView('report'); this.renderReport(); });
        document.getElementById('reportNavExport').addEventListener('click', () => this.exportFullDataCSV());

        // Carousel controls
        document.getElementById('carouselPrev').addEventListener('click', () => this.carouselPrev());
        document.getElementById('carouselNext').addEventListener('click', () => this.carouselNext());
        document.getElementById('addImageBtn').addEventListener('click', () => this.addCarouselImage());
        document.getElementById('removeImageBtn').addEventListener('click', () => this.removeCarouselImage());
        document.getElementById('imageFileInput').addEventListener('change', (e) => this.handleImageUpload(e));
    }

    applySettings() {
        const theme = localStorage.getItem('pe_theme') || 'light';
        const color = localStorage.getItem('pe_color') || 'red';
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.getElementById('themeLabel').textContent = 'Light Mode';
        }
        if (color !== 'red') {
            document.documentElement.setAttribute('data-color', color);
            document.querySelectorAll('.color-dot').forEach(d => {
                d.classList.toggle('active', d.dataset.color === color);
            });
        }
    }

    // ===== Tab Switching =====
    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.tab === tab));
        document.querySelectorAll('.sidebar-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('panel-' + tab).classList.add('active');

        if (tab === 'topscores') {
            this.showView('topscores');
            this.populateLbAssessmentFilter();
            this.renderLeaderboard();
        } else if (tab === 'students') {
            this.showView('students-page');
            this.renderStudentsPage();
        } else if (tab === 'classes') {
            this.showView('classes-page');
            this.renderClassesPage();
        } else if (tab === 'reports') {
            this.showView('report');
            this.populateReportFilters();
            this.renderReport();
        } else {
            this.showDashboard();
        }
    }

    // ===== Views =====
    showView(name) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('view-' + name).classList.add('active');
    }

    showDashboard() {
        this.showView('dashboard');
        this.renderDashboard();
    }

    // ===== Render All =====
    renderAll() {
        this.renderSidebarAssessments();
        this.renderSidebarClasses();
        this.renderSidebarStudents();
        this.renderSidebarScores();
        this.renderScoreFilterOptions();
        this.renderDashboard();
        this.renderCarousel();
        // Delay filter options update to ensure DOM is ready
        setTimeout(() => this.updateStudentFilterOptions(), 100);
    }

    // ===== Dashboard =====
    renderDashboard() {
        let totalGrades = 0;
        Object.values(this.grades).forEach(g => totalGrades += Object.keys(g).length);

        document.getElementById('statStudents').textContent = this.students.length;
        document.getElementById('statClasses').textContent = this.classes.length;
        document.getElementById('statAssessments').textContent = this.assessments.length;
        document.getElementById('statGraded').textContent = totalGrades;

        // Recent assessments
        const recent = document.getElementById('recentList');
        recent.innerHTML = this.assessments.slice(-5).reverse().map(a => `
            <div class="dash-row">
                <span class="dash-row-label">${a.name}</span>
                <span class="dash-row-value">${this.typeLabel(a.type)}</span>
            </div>
        `).join('') || '<div class="dash-row"><span class="dash-row-label">No assessments yet</span></div>';

        // Top performers
        const scores = this.getAllScores();
        const top = document.getElementById('topList');
        top.innerHTML = scores.slice(0, 5).map((s, i) => `
            <div class="dash-row">
                <span class="dash-row-label">${i + 1}. ${s.studentName}</span>
                <span class="dash-row-value">${s.result} - ${s.assessmentName}</span>
            </div>
        `).join('') || '<div class="dash-row"><span class="dash-row-label">No grades entered yet</span></div>';
    }

    // ===== Carousel Functions =====
    renderCarousel() {
        const inner = document.getElementById('carouselInner');
        if (this.carouselImages.length === 0) {
            inner.innerHTML = '<div class="carousel-item placeholder">No images added yet</div>';
            return;
        }
        inner.innerHTML = this.carouselImages.map(img => `
            <div class="carousel-item" style="background-image: url('${img.url}')">
                <img src="${img.url}" alt="${img.title}" style="display: none;">
            </div>
        `).join('');
        this.updateCarouselPosition();
    }

    updateCarouselPosition() {
        const inner = document.getElementById('carouselInner');
        inner.style.transform = `translateX(-${this.currentCarouselIndex * 100}%)`;
    }

    carouselPrev() {
        if (this.carouselImages.length === 0) return;
        this.currentCarouselIndex = (this.currentCarouselIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
        this.updateCarouselPosition();
    }

    carouselNext() {
        if (this.carouselImages.length === 0) return;
        this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.carouselImages.length;
        this.updateCarouselPosition();
    }

    addCarouselImage() {
        document.getElementById('imageFileInput').click();
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            this.toast('Please select an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const title = prompt('Enter image title:') || file.name.replace(/\.[^/.]+$/, '');
            const newImage = {
                id: Date.now(),
                url: e.target.result, // Use the data URL from FileReader
                title,
                fileName: file.name
            };
            
            this.carouselImages.push(newImage);
            this.save();
            this.renderCarousel();
            this.toast('Image added to carousel');
        };
        
        reader.readAsDataURL(file);
    }

    removeCarouselImage() {
        if (this.carouselImages.length === 0) {
            this.toast('No images to remove');
            return;
        }
        
        if (confirm('Remove current image from carousel?')) {
            this.carouselImages.splice(this.currentCarouselIndex, 1);
            if (this.currentCarouselIndex >= this.carouselImages.length) {
                this.currentCarouselIndex = Math.max(0, this.carouselImages.length - 1);
            }
            this.save();
            this.renderCarousel();
            this.toast('Image removed from carousel');
        }
    }

    // ===== Profile Functions =====
    openProfilePage() {
        this.showView('profile');
        this.loadProfileData();
    }

    loadProfileData() {
        // Load profile data into form fields
        document.getElementById('profileFirstName').value = this.userProfile.firstName || '';
        document.getElementById('profileLastName').value = this.userProfile.lastName || '';
        document.getElementById('profileEmail').value = this.userProfile.email || '';
        document.getElementById('profileTitle').value = this.userProfile.title || '';
        document.getElementById('profileSchool').value = this.userProfile.school || '';
        document.getElementById('profileBio').value = this.userProfile.bio || '';
        
        // Load profile picture
        const profilePic = document.getElementById('profilePictureDisplay');
        if (this.userProfile.picture) {
            profilePic.src = this.userProfile.picture;
        } else {
            profilePic.src = 'https://picsum.photos/seed/defaultprofile/150/150.jpg';
        }
    }

    handleProfilePictureUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                document.getElementById('profilePictureDisplay').src = imageData;
                this.userProfile.picture = imageData;
                this.save();
                this.updateProfileAvatar();
                this.toast('Profile picture updated');
            };
            reader.readAsDataURL(file);
        }
    }

    updateProfileAvatar() {
        const avatar = document.getElementById('profileAvatar');
        if (this.userProfile.picture) {
            avatar.innerHTML = `<img src="${this.userProfile.picture}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        }
    }

    saveProfileChanges() {
        this.userProfile.firstName = document.getElementById('profileFirstName').value.trim();
        this.userProfile.lastName = document.getElementById('profileLastName').value.trim();
        this.userProfile.email = document.getElementById('profileEmail').value.trim();
        this.userProfile.title = document.getElementById('profileTitle').value.trim();
        this.userProfile.school = document.getElementById('profileSchool').value.trim();
        this.userProfile.bio = document.getElementById('profileBio').value.trim();
        
        this.save();
        this.toast('Profile updated successfully');
        this.showDashboard();
    }

    // ===== Bulk Import =====
    openBulkImportModal() {
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        title.textContent = 'Bulk Import Students';
        body.innerHTML = `
            <div class="bulk-import-area">
                <p style="font-weight:600;margin-bottom:0.5rem;">Paste CSV data or upload a file</p>
                <p style="font-size:0.8rem;color:var(--text-muted);">Format: FirstName, LastName, StudentID, Grade, Period</p>
                <textarea id="bulkImportData" placeholder="Alex, Johnson, S100, 6, 1&#10;Sam, Smith, S101, 7, 2&#10;Jordan, Williams, S102, 8, 3"></textarea>
                <div style="margin-top:0.5rem;">
                    <input type="file" id="bulkImportFile" accept=".csv,.txt" style="font-size:0.8rem;">
                </div>
            </div>
            <div class="bulk-import-preview" id="bulkImportPreview"></div>
            <div class="form-actions">
                <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                <button type="button" class="btn btn-outline" id="bulkPreviewBtn">Preview</button>
                <button type="button" class="btn btn-primary" id="bulkImportConfirmBtn">Import</button>
            </div>
        `;
        document.getElementById('bulkImportFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => { document.getElementById('bulkImportData').value = ev.target.result; };
            reader.readAsText(file);
        });
        document.getElementById('bulkPreviewBtn').addEventListener('click', () => this.previewBulkImport());
        document.getElementById('bulkImportConfirmBtn').addEventListener('click', () => this.confirmBulkImport());
        document.getElementById('modalOverlay').classList.add('open');
    }

    parseBulkCSV() {
        const raw = document.getElementById('bulkImportData').value.trim();
        if (!raw) return [];
        const lines = raw.split('\n').filter(l => l.trim());
        const students = [];
        for (const line of lines) {
            const parts = line.split(',').map(s => s.trim());
            if (parts.length < 5) continue;
            // Skip header row
            if (parts[0].toLowerCase() === 'firstname' || parts[0].toLowerCase() === 'first') continue;
            students.push({
                first: parts[0],
                last: parts[1],
                id: parts[2],
                grade: parts[3],
                period: parts[4]
            });
        }
        return students;
    }

    previewBulkImport() {
        const students = this.parseBulkCSV();
        const preview = document.getElementById('bulkImportPreview');
        if (students.length === 0) {
            preview.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">No valid rows found. Check format: FirstName, LastName, ID, Grade, Period</p>';
            return;
        }
        preview.innerHTML = `<p style="font-weight:600;margin-bottom:0.5rem;">${students.length} student(s) found:</p>
            <table class="grade-table"><thead><tr><th>First</th><th>Last</th><th>ID</th><th>Grade</th><th>Period</th></tr></thead>
            <tbody>${students.map(s => `<tr><td>${s.first}</td><td>${s.last}</td><td>${s.id}</td><td>${s.grade}</td><td>${s.period}</td></tr>`).join('')}</tbody></table>`;
    }

    confirmBulkImport() {
        const students = this.parseBulkCSV();
        if (students.length === 0) { this.toast('No valid data to import'); return; }
        let added = 0, skipped = 0;
        for (const s of students) {
            if (this.students.find(ex => ex.id === s.id)) { skipped++; continue; }
            this.students.push(s);
            added++;
        }
        this.save();
        this.renderAll();
        this.closeModal();
        this.toast(`Imported ${added} student(s)` + (skipped ? `, ${skipped} skipped (duplicate ID)` : ''));
        if (this.currentTab === 'students') this.renderStudentsPage();
    }

    // ===== CSV Export =====
    downloadCSV(filename, csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    exportStudentsCSV() {
        let csv = 'FirstName,LastName,StudentID,Grade,Period\n';
        this.students.forEach(s => {
            csv += `${s.first},${s.last},${s.id},${s.grade},${s.period}\n`;
        });
        this.downloadCSV('students_export.csv', csv);
        this.toast('Students exported to CSV');
    }

    exportStudentReport() {
        if (!this.selectedItem) return;
        const s = this.selectedItem;
        const studentGrades = this.grades[s.id] || {};
        let csv = `Student Report: ${s.first} ${s.last}\nID: ${s.id}\nGrade: ${s.grade}\nPeriod: ${s.period}\n\n`;
        csv += 'Assessment,Type,Result,Reps,Notes,Date\n';
        this.assessments.forEach(a => {
            const g = studentGrades[a.id];
            if (g) {
                csv += `${a.name},${this.typeLabel(a.type)},${g.time || ''},${g.reps || ''},${(g.notes || '').replace(/,/g, ';')},${g.date || ''}\n`;
            } else {
                csv += `${a.name},${this.typeLabel(a.type)},Not graded,,,,\n`;
            }
        });
        this.downloadCSV(`student_report_${s.id}.csv`, csv);
        this.toast(`Report exported for ${s.first} ${s.last}`);
    }

    exportClassReportCSV() {
        const classFilter = document.getElementById('reportClassFilter').value;
        let csv = 'Student,StudentID,Grade,Period,Assessment,Result,Reps,Notes,Date\n';
        this.students.forEach(s => {
            if (classFilter !== 'all') {
                const c = this.classes.find(cl => cl.id === classFilter);
                if (c && (String(s.period) !== String(c.period) || String(s.grade) !== String(c.grade))) return;
            }
            const studentGrades = this.grades[s.id] || {};
            this.assessments.forEach(a => {
                const g = studentGrades[a.id];
                if (g) {
                    csv += `${s.first} ${s.last},${s.id},${s.grade},${s.period},${a.name},${g.time || ''},${g.reps || ''},${(g.notes || '').replace(/,/g, ';')},${g.date || ''}\n`;
                }
            });
        });
        this.downloadCSV('class_report.csv', csv);
        this.toast('Class report exported to CSV');
    }

    exportFullDataCSV() {
        let csv = 'Student,StudentID,Grade,Period,Assessment,Type,Time,Reps,Notes,Date\n';
        this.students.forEach(s => {
            const studentGrades = this.grades[s.id] || {};
            this.assessments.forEach(a => {
                const g = studentGrades[a.id];
                if (g) {
                    csv += `${s.first} ${s.last},${s.id},${s.grade},${s.period},${a.name},${this.typeLabel(a.type)},${g.time || ''},${g.reps || ''},${(g.notes || '').replace(/,/g, ';')},${g.date || ''}\n`;
                }
            });
        });
        this.downloadCSV('pe_tracker_full_export.csv', csv);
        this.toast('Full data exported to CSV');
    }

    // ===== Student Progress Chart =====
    renderStudentProgressChart(studentId) {
        const canvas = document.getElementById('studentProgressChart');
        if (!canvas) return;
        
        // Destroy existing chart
        if (this.studentChart) {
            this.studentChart.destroy();
            this.studentChart = null;
        }

        const studentGrades = this.grades[studentId] || {};
        const assessmentNames = [];
        const assessmentData = [];
        const colors = [];
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#dc2626';

        this.assessments.forEach(a => {
            const g = studentGrades[a.id];
            assessmentNames.push(a.name);
            if (g) {
                // Try to extract a numeric value from the result
                const timeVal = g.time ? this.timeToSeconds(g.time) : null;
                const repsVal = g.reps ? parseFloat(g.reps) : null;
                assessmentData.push(timeVal || repsVal || 1);
                colors.push(accentColor);
            } else {
                assessmentData.push(0);
                colors.push('rgba(128,128,128,0.3)');
            }
        });

        if (assessmentNames.length === 0) return;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#ccc' : '#666';
        const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

        this.studentChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: assessmentNames,
                datasets: [{
                    label: 'Performance',
                    data: assessmentData,
                    backgroundColor: colors,
                    borderColor: colors.map(c => c === accentColor ? accentColor : 'rgba(128,128,128,0.5)'),
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor, maxRotation: 45 }, grid: { display: false } }
                }
            }
        });
    }

    timeToSeconds(timeStr) {
        if (!timeStr) return 0;
        const parts = timeStr.split(':');
        if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        return parseFloat(timeStr) || 0;
    }

    // ===== Reports =====
    populateReportFilters() {
        const classSelect = document.getElementById('reportClassFilter');
        classSelect.innerHTML = '<option value="all">All Classes</option>' +
            this.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

        const assessSelect = document.getElementById('reportAssessmentFilter');
        assessSelect.innerHTML = '<option value="all">All Assessments</option>' +
            this.assessments.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
    }

    renderReport() {
        this.populateReportFilters();
        const classFilter = document.getElementById('reportClassFilter').value;
        const assessFilter = document.getElementById('reportAssessmentFilter').value;

        // Get filtered students
        let students = this.students;
        if (classFilter !== 'all') {
            const c = this.classes.find(cl => cl.id === classFilter);
            if (c) students = students.filter(s => String(s.period) === String(c.period) && String(s.grade) === String(c.grade));
        }

        // Calculate stats
        let totalGraded = 0, totalPossible = 0;
        const assessments = assessFilter !== 'all' ? this.assessments.filter(a => a.id === assessFilter) : this.assessments;
        students.forEach(s => {
            const sg = this.grades[s.id] || {};
            assessments.forEach(a => {
                totalPossible++;
                if (sg[a.id]) totalGraded++;
            });
        });
        const completionRate = totalPossible > 0 ? Math.round((totalGraded / totalPossible) * 100) : 0;

        // Summary cards
        document.getElementById('reportSummary').innerHTML = `
            <div class="report-stat-card"><div class="report-stat-num">${students.length}</div><div class="report-stat-label">Students</div></div>
            <div class="report-stat-card"><div class="report-stat-num">${assessments.length}</div><div class="report-stat-label">Assessments</div></div>
            <div class="report-stat-card"><div class="report-stat-num">${totalGraded}</div><div class="report-stat-label">Grades Entered</div></div>
            <div class="report-stat-card"><div class="report-stat-num">${completionRate}%</div><div class="report-stat-label">Completion Rate</div></div>
        `;

        // Charts
        this.renderReportCompletionChart(students, assessments);
        this.renderReportDistributionChart(assessments);

        // Table
        const tbody = document.getElementById('reportTableBody');
        let rows = [];
        students.forEach(s => {
            const sg = this.grades[s.id] || {};
            const className = this.classes.find(c => String(c.period) === String(s.period) && String(c.grade) === String(s.grade));
            assessments.forEach(a => {
                const g = sg[a.id];
                if (g) {
                    rows.push(`<tr>
                        <td style="font-weight:600">${s.first} ${s.last}</td>
                        <td>${className ? className.name : `Grade ${s.grade} P${s.period}`}</td>
                        <td>${a.name}</td>
                        <td>${[g.time, g.reps].filter(Boolean).join(' / ') || '—'}</td>
                        <td>${g.date || '—'}</td>
                    </tr>`);
                }
            });
        });
        tbody.innerHTML = rows.join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:2rem;">No graded results found</td></tr>';
    }

    renderReportCompletionChart(students, assessments) {
        const canvas = document.getElementById('reportCompletionChart');
        if (!canvas) return;
        if (this.reportCompChart) this.reportCompChart.destroy();

        const classData = {};
        this.classes.forEach(c => {
            const classStudents = students.filter(s => String(s.period) === String(c.period) && String(s.grade) === String(c.grade));
            let graded = 0, possible = 0;
            classStudents.forEach(s => {
                const sg = this.grades[s.id] || {};
                assessments.forEach(a => { possible++; if (sg[a.id]) graded++; });
            });
            classData[c.name] = possible > 0 ? Math.round((graded / possible) * 100) : 0;
        });

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#ccc' : '#666';
        const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#dc2626';

        this.reportCompChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: Object.keys(classData),
                datasets: [{
                    label: 'Completion %',
                    data: Object.values(classData),
                    backgroundColor: accent + '99',
                    borderColor: accent,
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: textColor, callback: v => v + '%' }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor, maxRotation: 45 }, grid: { display: false } }
                }
            }
        });
    }

    renderReportDistributionChart(assessments) {
        const canvas = document.getElementById('reportDistributionChart');
        if (!canvas) return;
        if (this.reportDistChart) this.reportDistChart.destroy();

        const typeCounts = {};
        assessments.forEach(a => {
            const label = this.typeLabel(a.type);
            typeCounts[label] = (typeCounts[label] || 0) + 1;
        });

        const chartColors = ['#dc2626', '#2563eb', '#16a34a', '#9333ea', '#ea580c'];
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        this.reportDistChart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: Object.keys(typeCounts),
                datasets: [{
                    data: Object.values(typeCounts),
                    backgroundColor: chartColors.slice(0, Object.keys(typeCounts).length),
                    borderWidth: 2,
                    borderColor: isDark ? '#1e1e2e' : '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: isDark ? '#ccc' : '#666', padding: 12 }
                    }
                }
            }
        });
    }

    // ===== Students Page =====
    renderStudentsPage() {
        // Populate filter dropdowns with existing grades/periods
        const existingGrades = [...new Set(this.students.map(s => s.grade))].sort((a, b) => a - b);
        const existingPeriods = [...new Set(this.students.map(s => s.period))].sort((a, b) => a - b);
        
        const gradeSelect = document.getElementById('spGradeFilter');
        const currentGrade = gradeSelect.value;
        gradeSelect.innerHTML = '<option value="all">All Grades</option>' +
            existingGrades.map(g => `<option value="${g}">${g}th Grade</option>`).join('');
        gradeSelect.value = currentGrade || 'all';

        const periodSelect = document.getElementById('spPeriodFilter');
        const currentPeriod = periodSelect.value;
        periodSelect.innerHTML = '<option value="all">All Periods</option>' +
            existingPeriods.map(p => `<option value="${p}">Period ${p}</option>`).join('');
        periodSelect.value = currentPeriod || 'all';

        // Get filter values
        const nameFilter = document.getElementById('spNameFilter').value.toLowerCase();
        const gradeFilter = gradeSelect.value;
        const periodFilter = periodSelect.value;
        const idFilter = document.getElementById('spIdFilter').value.toLowerCase();

        // Filter students
        let filtered = this.students;
        if (nameFilter) filtered = filtered.filter(s => `${s.first} ${s.last}`.toLowerCase().includes(nameFilter));
        if (gradeFilter !== 'all') filtered = filtered.filter(s => String(s.grade) === gradeFilter);
        if (periodFilter !== 'all') filtered = filtered.filter(s => String(s.period) === periodFilter);
        if (idFilter) filtered = filtered.filter(s => s.id.toLowerCase().includes(idFilter));

        // Update stats
        document.getElementById('spTotalStudents').textContent = this.students.length;
        document.getElementById('spFilteredStudents').textContent = filtered.length;

        // Render table
        const tbody = document.getElementById('studentsPageBody');
        tbody.innerHTML = filtered.map(s => {
            const studentGrades = this.grades[s.id] || {};
            const completed = Object.keys(studentGrades).length;
            return `
                <tr>
                    <td style="font-weight:600">${s.first} ${s.last}</td>
                    <td>${s.id}</td>
                    <td>${s.grade}th</td>
                    <td>Period ${s.period}</td>
                    <td>${completed} of ${this.assessments.length}</td>
                    <td><button class="view-btn" data-sid="${s.id}">View</button></td>
                </tr>
            `;
        }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:2rem;">No students found</td></tr>';

        tbody.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openStudentDetail(btn.dataset.sid);
            });
        });
    }

    // ===== Classes Page =====
    renderClassesPage() {
        const grid = document.getElementById('classesPageGrid');
        grid.innerHTML = this.classes.map(c => {
            const students = this.students.filter(s => String(s.period) === String(c.period) && String(s.grade) === String(c.grade));
            const studentCount = students.length;
            let totalGraded = 0;
            students.forEach(s => {
                totalGraded += Object.keys(this.grades[s.id] || {}).length;
            });
            return `
                <div class="class-page-card" data-cid="${c.id}">
                    <div class="class-page-card-title">${c.name}</div>
                    <div class="class-page-card-info">Period ${c.period} &middot; Grade ${c.grade}</div>
                    <div class="class-page-card-stat">
                        <div><span>${studentCount}</span> Students</div>
                        <div><span>${totalGraded}</span> Grades Entered</div>
                    </div>
                </div>
            `;
        }).join('') || '<div style="text-align:center;color:var(--text-muted);padding:2rem;grid-column:1/-1;">No classes yet. Click "+ Add Class" to create one.</div>';

        grid.querySelectorAll('.class-page-card').forEach(card => {
            card.addEventListener('click', () => this.openClassDetail(card.dataset.cid));
        });
    }

    // ===== Sidebar Renders =====
    renderSidebarAssessments() {
        const el = document.getElementById('sidebarAssessments');
        document.getElementById('assessmentCount').textContent = this.assessments.length + ' assessments';
        el.innerHTML = this.assessments.map(a => `
            <div class="panel-item" data-id="${a.id}">
                <div class="panel-item-title">${a.name}</div>
                <div class="panel-item-sub">${this.typeLabel(a.type)} &middot; ${a.periods.length} period${a.periods.length > 1 ? 's' : ''}</div>
            </div>
        `).join('');
        el.querySelectorAll('.panel-item').forEach(item => {
            item.addEventListener('click', () => this.openAssessmentDetail(item.dataset.id));
        });
    }

    renderSidebarClasses() {
        const el = document.getElementById('sidebarClasses');
        document.getElementById('classCount').textContent = this.classes.length + ' classes';
        el.innerHTML = this.classes.map(c => {
            const count = this.students.filter(s => s.period === c.period && s.grade === c.grade).length;
            return `
                <div class="panel-item" data-id="${c.id}">
                    <div class="panel-item-title">${c.name}</div>
                    <div class="panel-item-sub">Period ${c.period} &middot; ${count} student${count !== 1 ? 's' : ''}</div>
                </div>
            `;
        }).join('');
        el.querySelectorAll('.panel-item').forEach(item => {
            item.addEventListener('click', () => this.openClassDetail(item.dataset.id));
        });
    }

    renderSidebarStudents() {
        this.filterStudents();
    }

    filterStudents() {
        const el = document.getElementById('sidebarStudents');
        if (!el) return;

        const nameEl = document.getElementById('studentNameFilter');
        const gradeEl = document.getElementById('studentGradeFilter');
        const periodEl = document.getElementById('studentPeriodFilter');
        const idEl = document.getElementById('studentIdFilter');

        const nameFilter = nameEl ? nameEl.value.toLowerCase() : '';
        const gradeFilter = gradeEl ? gradeEl.value : '';
        const periodFilter = periodEl ? periodEl.value : '';
        const idFilter = idEl ? idEl.value.toLowerCase() : '';

        let filtered = this.students;

        if (nameFilter) {
            filtered = filtered.filter(s => 
                `${s.first} ${s.last}`.toLowerCase().includes(nameFilter)
            );
        }
        if (gradeFilter) {
            filtered = filtered.filter(s => String(s.grade) === gradeFilter);
        }
        if (periodFilter) {
            filtered = filtered.filter(s => String(s.period) === periodFilter);
        }
        if (idFilter) {
            filtered = filtered.filter(s => s.id.toLowerCase().includes(idFilter));
        }

        document.getElementById('studentCount').textContent = 
            `${filtered.length} of ${this.students.length} students`;

        el.innerHTML = filtered.map(s => `
            <div class="panel-item" data-id="${s.id}">
                <div class="panel-item-title">${s.first} ${s.last}</div>
                <div class="panel-item-sub">ID: ${s.id} &middot; Grade ${s.grade} &middot; Period ${s.period}</div>
            </div>
        `).join('');
        
        el.querySelectorAll('.panel-item').forEach(item => {
            item.addEventListener('click', () => this.openStudentDetail(item.dataset.id));
        });
    }

    updateStudentFilterOptions() {
        // Check if filter elements exist before updating
        const gradeFilter = document.getElementById('studentGradeFilter');
        const periodFilter = document.getElementById('studentPeriodFilter');
        
        if (!gradeFilter || !periodFilter) return;

        // Get existing grades from current students
        const existingGrades = [...new Set(this.students.map(s => s.grade))].sort((a, b) => a - b);
        gradeFilter.innerHTML = '<option value="">All Grades</option>' +
            existingGrades.map(grade => `<option value="${grade}">${grade}th Grade</option>`).join('');

        // Get existing periods from current students
        const existingPeriods = [...new Set(this.students.map(s => s.period))].sort((a, b) => a - b);
        periodFilter.innerHTML = '<option value="">All Periods</option>' +
            existingPeriods.map(period => `<option value="${period}">Period ${period}</option>`).join('');
    }

    resetStudentFilters() {
        document.getElementById('studentNameFilter').value = '';
        document.getElementById('studentGradeFilter').value = '';
        document.getElementById('studentPeriodFilter').value = '';
        document.getElementById('studentIdFilter').value = '';
        this.filterStudents();
    }

    renderSidebarScores() {
        const el = document.getElementById('sidebarScores');
        const filterVal = document.getElementById('scoreFilter').value;
        const scores = this.getAllScores(filterVal !== 'all' ? filterVal : null);
        document.getElementById('scoreCount').textContent = scores.length + ' scores';
        el.innerHTML = scores.slice(0, 20).map((s, i) => {
            const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
            return `
                <div class="leader-item">
                    <div class="leader-rank ${rankClass}">${i + 1}</div>
                    <div class="leader-info">
                        <div class="leader-name">${s.studentName}</div>
                        <div class="leader-detail">${s.assessmentName}</div>
                    </div>
                    <div class="leader-score">${s.result}</div>
                </div>
            `;
        }).join('') || '<div style="padding:1rem;text-align:center;color:var(--text-muted);font-size:0.85rem;">No scores yet</div>';
    }

    renderScoreFilterOptions() {
        const sel = document.getElementById('scoreFilter');
        sel.innerHTML = '<option value="all">All Assessments</option>' +
            this.assessments.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
    }

    // ===== Detail Views =====
    openAssessmentDetail(id, studentId = null) {
        const a = this.assessments.find(x => x.id === id);
        if (!a) return;
        this.selectedItem = a;
        this.selectedStudentId = studentId; // Store the selected student
        document.getElementById('assessmentDetailName').textContent = a.name;
        document.getElementById('assessmentDetailType').textContent = this.typeLabel(a.type) + ' Assessment';

        document.getElementById('assessmentInfo').innerHTML = `
            <div><div class="detail-item-label">Assessment Type</div><div class="detail-item-value">${this.typeLabel(a.type)}</div></div>
        `;

        // Period filter - show one period at a time
        const pf = document.getElementById('gradePeriodFilter');
        pf.innerHTML = a.periods.map(p => `<option value="${p}">Period ${p}</option>`).join('');
        pf.onchange = () => this.renderGradeTable(a, pf.value);

        // If a specific student is provided, set the period filter to that student's period
        let initialPeriod = a.periods[0];
        if (studentId) {
            const student = this.students.find(s => s.id === studentId);
            if (student && a.periods.includes(student.period)) {
                initialPeriod = student.period;
                pf.value = initialPeriod;
            }
        }

        this.renderGradeTable(a, initialPeriod);
        this.showView('assessment');
    }

    renderGradeTable(assessment, periodFilter) {
        const tbody = document.getElementById('gradeTableBody');
        const students = periodFilter === 'all'
            ? this.students.filter(s => assessment.periods.includes(s.period))
            : this.students.filter(s => s.period === periodFilter);

        tbody.innerHTML = students.map(s => {
            const g = (this.grades[s.id] || {})[assessment.id] || {};
            const isHighlighted = this.selectedStudentId === s.id;
            return `
                <tr ${isHighlighted ? 'class="highlighted-student"' : ''}>
                    <td>${s.first} ${s.last}</td>
                    <td>Period ${s.period}</td>
                    <td><input class="grade-input" data-sid="${s.id}" data-field="time" value="${g.time || ''}" placeholder="e.g. 6:45"></td>
                    <td><input class="grade-input" data-sid="${s.id}" data-field="reps" value="${g.reps || ''}" placeholder="e.g. 38"></td>
                    <td><input class="grade-input wide" data-sid="${s.id}" data-field="notes" value="${g.notes || ''}" placeholder="Notes"></td>
                    <td><button class="save-grade-btn" data-sid="${s.id}">Save</button></td>
                </tr>
            `;
        }).join('');

        tbody.querySelectorAll('.save-grade-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const sid = btn.dataset.sid;
                const row = btn.closest('tr');
                const time = row.querySelector('[data-field="time"]').value;
                const reps = row.querySelector('[data-field="reps"]').value;
                const notes = row.querySelector('[data-field="notes"]').value;
                if (!this.grades[sid]) this.grades[sid] = {};
                this.grades[sid][assessment.id] = { time, reps, notes, date: new Date().toISOString().split('T')[0] };
                this.save();
                this.renderSidebarScores();
                this.toast('Grade saved for ' + this.students.find(x => x.id === sid).first);
            });
        });
    }

    openClassDetail(id) {
        const c = this.classes.find(x => x.id === id);
        if (!c) return;
        this.selectedItem = c;
        document.getElementById('classDetailName').textContent = c.name;
        document.getElementById('classDetailInfo').textContent = `Period ${c.period} — Grade ${c.grade}`;

        // Clear search
        document.getElementById('classStudentSearch').value = '';
        document.getElementById('classStudentSearchResults').innerHTML = '';

        this.renderClassStudents(c);
        this.showView('class');
    }

    renderClassStudents(classObj) {
        const students = this.students.filter(s => s.period === classObj.period && s.grade === classObj.grade);
        const tbody = document.getElementById('classStudentsBody');
        tbody.innerHTML = students.map(s => {
            const studentGrades = this.grades[s.id] || {};
            const completed = Object.keys(studentGrades).length;
            const results = Object.values(studentGrades).map(g => [g.time, g.reps].filter(Boolean).join(' / ')).filter(Boolean);
            const avg = results.length > 0 ? results.slice(0, 2).join(', ') + (results.length > 2 ? '...' : '') : '—';
            return `
                <tr class="clickable-row" data-sid="${s.id}">
                    <td>${s.first} ${s.last}</td>
                    <td>${s.id}</td>
                    <td>${completed}</td>
                    <td>${avg}</td>
                    <td><button class="btn btn-outline btn-sm" onclick="app.removeStudentFromClass('${s.id}', '${classObj.id}')">Remove</button></td>
                </tr>
            `;
        }).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">No students in this class</td></tr>';

        tbody.querySelectorAll('.clickable-row').forEach(row => {
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => this.openStudentDetail(row.dataset.sid));
        });
    }

    searchClassStudents(query) {
        const resultsDiv = document.getElementById('classStudentSearchResults');
        
        if (!query.trim()) {
            resultsDiv.innerHTML = '';
            return;
        }

        const currentClass = this.selectedItem;
        if (!currentClass) return;

        // Search for students not already in this class
        const availableStudents = this.students.filter(s => {
            const isInClass = s.period === currentClass.period && s.grade === currentClass.grade;
            const matchesSearch = `${s.first} ${s.last} ${s.id}`.toLowerCase().includes(query.toLowerCase());
            return !isInClass && matchesSearch;
        });

        if (availableStudents.length === 0) {
            resultsDiv.innerHTML = '<div style="padding: 0.5rem; color: var(--text-muted); font-size: 0.85rem;">No students found</div>';
            return;
        }

        resultsDiv.innerHTML = availableStudents.map(s => `
            <div class="student-search-item">
                <div class="student-search-info">
                    <div class="student-search-name">${s.first} ${s.last}</div>
                    <div class="student-search-details">ID: ${s.id} &middot; Grade ${s.grade} &middot; Period ${s.period}</div>
                </div>
                <button class="student-search-add-btn" onclick="app.addStudentToClass('${s.id}', '${currentClass.id}')">
                    Add to Class
                </button>
            </div>
        `).join('');
    }

    addStudentToClass(studentId, classId) {
        const student = this.students.find(s => s.id === studentId);
        const classObj = this.classes.find(c => c.id === classId);
        
        if (!student || !classObj) return;

        // Update student's period and grade to match the class
        student.period = classObj.period;
        student.grade = classObj.grade;

        this.save();
        this.renderClassStudents(classObj);
        
        // Clear search
        document.getElementById('classStudentSearch').value = '';
        document.getElementById('classStudentSearchResults').innerHTML = '';
        
        this.toast(`${student.first} ${student.last} added to ${classObj.name}`);
    }

    removeStudentFromClass(studentId, classId) {
        const student = this.students.find(s => s.id === studentId);
        const classObj = this.classes.find(c => c.id === classId);
        
        if (!student || !classObj) return;

        // Remove student from class by setting them to a different period/grade
        student.period = 0; // Set to 0 to indicate not in any class
        student.grade = 0;

        this.save();
        this.renderClassStudents(classObj);
        
        this.toast(`${student.first} ${student.last} removed from ${classObj.name}`);
    }

    openStudentDetail(id) {
        const s = this.students.find(x => x.id === id);
        if (!s) return;
        this.selectedItem = s;
        document.getElementById('studentDetailName').textContent = `${s.first} ${s.last}`;
        document.getElementById('studentDetailInfo').textContent = `ID: ${s.id} — Grade ${s.grade} — Period ${s.period}`;

        const studentGrades = this.grades[s.id] || {};
        const tbody = document.getElementById('studentGradesBody');
        tbody.innerHTML = this.assessments.map(a => {
            const g = studentGrades[a.id];
            if (!g) return `
                <tr>
                    <td><button class="assessment-link" data-assessment-id="${a.id}" data-student-id="${s.id}">${a.name}</button></td>
                    <td>${this.typeLabel(a.type)}</td>
                    <td colspan="4" style="color:var(--text-muted)">Not graded</td>
                </tr>
            `;
            return `
                <tr>
                    <td><button class="assessment-link" data-assessment-id="${a.id}" data-student-id="${s.id}">${a.name}</button></td>
                    <td>${this.typeLabel(a.type)}</td>
                    <td>${g.time || '—'}</td>
                    <td>${g.reps || '—'}</td>
                    <td>${g.notes || '—'}</td>
                    <td>${g.date}</td>
                </tr>
            `;
        }).join('');

        // Add click listeners to assessment links
        tbody.querySelectorAll('.assessment-link').forEach(link => {
            link.addEventListener('click', () => {
                this.openAssessmentDetail(link.dataset.assessmentId, link.dataset.studentId);
            });
        });

        this.showView('student');
        this.renderStudentProgressChart(s.id);
    }

    // ===== Leaderboard =====
    populateLbAssessmentFilter() {
        const sel = document.getElementById('lbFilterAssessment');
        const current = sel.value;
        sel.innerHTML = '<option value="all">All Assessments</option>' +
            this.assessments.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
        sel.value = current || 'all';
    }

    renderLeaderboard() {
        const container = document.getElementById('leaderboard');
        const summary = document.getElementById('lbSummary');
        const filterAssessment = document.getElementById('lbFilterAssessment').value;
        const filterPeriod = document.getElementById('lbFilterPeriod').value;
        const filterGrade = document.getElementById('lbFilterGrade').value;
        const sortBy = document.getElementById('lbSortBy').value;

        // Build flat list of all scores with student info
        let allScores = [];
        Object.keys(this.grades).forEach(sid => {
            const s = this.students.find(x => x.id === sid);
            if (!s) return;
            if (filterPeriod !== 'all' && s.period !== filterPeriod) return;
            if (filterGrade !== 'all' && s.grade !== filterGrade) return;
            Object.keys(this.grades[sid]).forEach(aid => {
                if (filterAssessment !== 'all' && aid !== filterAssessment) return;
                const a = this.assessments.find(x => x.id === aid);
                if (!a) return;
                const g = this.grades[sid][aid];
                allScores.push({
                    name: `${s.first} ${s.last}`,
                    studentId: sid,
                    period: s.period,
                    gradeLevel: s.grade,
                    assessmentName: a.name,
                    assessmentId: aid,
                    time: g.time,
                    reps: g.reps,
                    result: [g.time, g.reps].filter(Boolean).join(' / ') || '—',
                    notes: g.notes,
                    date: g.date
                });
            });
        });

        // Sort
        switch (sortBy) {
            case 'result-asc': allScores.sort((a, b) => a.result.localeCompare(b.result)); break;
            case 'result-desc': allScores.sort((a, b) => b.result.localeCompare(a.result)); break;
            case 'name-asc': allScores.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'name-desc': allScores.sort((a, b) => b.name.localeCompare(a.name)); break;
            case 'date-desc': allScores.sort((a, b) => {
                if (!a.date) return 1;
                if (!b.date) return -1;
                return new Date(b.date) - new Date(a.date);
            }); break;
            case 'date-asc': allScores.sort((a, b) => {
                if (!a.date) return -1;
                if (!b.date) return 1;
                return new Date(a.date) - new Date(b.date);
            }); break;
        }

        // Summary
        const uniqueStudents = new Set(allScores.map(s => s.studentId)).size;
        const uniqueAssessments = new Set(allScores.map(s => s.assessmentId)).size;
        summary.innerHTML = `
            <div class="lb-summary-item">Showing <span class="lb-summary-value">${allScores.length}</span> scores</div>
            <div class="lb-summary-item">from <span class="lb-summary-value">${uniqueStudents}</span> students</div>
            <div class="lb-summary-item">across <span class="lb-summary-value">${uniqueAssessments}</span> assessments</div>
        `;

        // Group by assessment for display
        const byAssessment = {};
        allScores.forEach(s => {
            if (!byAssessment[s.assessmentId]) byAssessment[s.assessmentId] = { name: s.assessmentName, scores: [] };
            byAssessment[s.assessmentId].scores.push(s);
        });

        container.innerHTML = Object.values(byAssessment).map(group => {
            return `
                <div class="lb-card">
                    <div class="lb-card-title">${group.name}</div>
                    ${group.scores.map((s, i) => {
                        const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
                        return `
                            <div class="leader-item">
                                <div class="leader-rank ${rankClass}">${i + 1}</div>
                                <div class="leader-info">
                                    <div class="leader-name">${s.name}</div>
                                    <div class="leader-detail">Period ${s.period} &middot; Grade ${s.gradeLevel}</div>
                                </div>
                                <div class="leader-score">${s.result}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }).join('') || '<div style="padding:2rem;text-align:center;color:var(--text-muted)">No scores match your filters</div>';
    }

    // ===== Modals =====
    openModal(type) {
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        if (type === 'student') {
            title.textContent = 'Add Student';
            body.innerHTML = `
                <form id="modalForm">
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">First Name</label><input class="form-input" id="f_first" required></div>
                        <div class="form-group"><label class="form-label">Last Name</label><input class="form-input" id="f_last" required></div>
                    </div>
                    <div class="form-group"><label class="form-label">Student ID</label><input class="form-input" id="f_sid" required></div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Grade</label>
                            <select class="form-select" id="f_grade" required>
                                <option value="">Select</option><option value="6">6th</option><option value="7">7th</option><option value="8">8th</option>
                            </select>
                        </div>
                        <div class="form-group"><label class="form-label">Period</label>
                            <select class="form-select" id="f_period" required>
                                <option value="">Select</option><option value="1">Period 1</option><option value="2">Period 2</option><option value="3">Period 3</option><option value="4">Period 4</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Student</button>
                    </div>
                </form>
            `;
            body.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); this.addStudent(); });
        } else if (type === 'class') {
            title.textContent = 'Add Class';
            body.innerHTML = `
                <form id="modalForm">
                    <div class="form-group"><label class="form-label">Class Name</label><input class="form-input" id="f_cname" required></div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Period</label>
                            <select class="form-select" id="f_cperiod" required>
                                <option value="">Select</option><option value="1">Period 1</option><option value="2">Period 2</option><option value="3">Period 3</option><option value="4">Period 4</option>
                            </select>
                        </div>
                        <div class="form-group"><label class="form-label">Grade Level</label>
                            <select class="form-select" id="f_cgrade" required>
                                <option value="">Select</option><option value="6">6th</option><option value="7">7th</option><option value="8">8th</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Class</button>
                    </div>
                </form>
            `;
            body.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); this.addClass(); });
        } else if (type === 'assessment') {
            title.textContent = 'Create Assessment';
            body.innerHTML = `
                <form id="modalForm">
                    <div class="form-group"><label class="form-label">Assessment Name</label><input class="form-input" id="f_aname" required></div>
                    <div class="form-group"><label class="form-label">Type</label>
                        <select class="form-select" id="f_atype" required>
                            <option value="">Select</option><option value="cardio">Cardiovascular</option><option value="strength">Strength</option><option value="flexibility">Flexibility</option><option value="skills">Sports Skills</option>
                        </select>
                    </div>
                    <div class="form-group"><label class="form-label">Exercises / Activities</label><textarea class="form-textarea" id="f_aexercises" rows="3" required placeholder="One per line"></textarea></div>
                    <div class="form-group"><label class="form-label">Grading Standards</label><textarea class="form-textarea" id="f_astandards" rows="3" placeholder="Describe grading criteria"></textarea></div>
                    <div class="form-group"><label class="form-label">Target Periods</label>
                        <select class="form-select" id="f_aperiods" multiple style="height:80px">
                            <option value="1">Period 1</option><option value="2">Period 2</option><option value="3">Period 3</option><option value="4">Period 4</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Create Assessment</button>
                    </div>
                </form>
            `;
            body.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); this.addAssessment(); });
        }

        document.getElementById('modalOverlay').classList.add('open');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('open');
    }

    // ===== CRUD =====
    addStudent() {
        const id = document.getElementById('f_sid').value.trim();
        if (this.students.find(s => s.id === id)) { this.toast('Student ID already exists'); return; }
        this.students.push({
            id,
            first: document.getElementById('f_first').value.trim(),
            last: document.getElementById('f_last').value.trim(),
            grade: document.getElementById('f_grade').value,
            period: document.getElementById('f_period').value
        });
        this.save();
        this.renderAll();
        this.closeModal();
        this.toast('Student added successfully');
    }

    addClass() {
        this.classes.push({
            id: 'C' + String(Date.now()).slice(-6),
            name: document.getElementById('f_cname').value.trim(),
            period: document.getElementById('f_cperiod').value,
            grade: document.getElementById('f_cgrade').value
        });
        this.save();
        this.renderAll();
        this.closeModal();
        this.toast('Class added successfully');
    }

    addAssessment() {
        const periods = Array.from(document.getElementById('f_aperiods').selectedOptions).map(o => o.value);
        if (periods.length === 0) { this.toast('Select at least one period'); return; }
        this.assessments.push({
            id: 'A' + String(Date.now()).slice(-6),
            name: document.getElementById('f_aname').value.trim(),
            type: document.getElementById('f_atype').value,
            exercises: document.getElementById('f_aexercises').value.trim(),
            standards: document.getElementById('f_astandards').value.trim(),
            periods,
            date: new Date().toISOString().split('T')[0]
        });
        this.save();
        this.renderAll();
        this.closeModal();
        this.toast('Assessment created successfully');
    }

    deleteAssessment() {
        if (!this.selectedItem || !confirm('Delete this assessment and all related grades?')) return;
        const id = this.selectedItem.id;
        this.assessments = this.assessments.filter(a => a.id !== id);
        Object.keys(this.grades).forEach(sid => { delete this.grades[sid][id]; });
        this.save();
        this.renderAll();
        this.showDashboard();
        this.toast('Assessment deleted');
    }

    deleteClass() {
        if (!this.selectedItem || !confirm('Delete this class?')) return;
        this.classes = this.classes.filter(c => c.id !== this.selectedItem.id);
        this.save();
        this.renderAll();
        this.showDashboard();
        this.toast('Class deleted');
    }

    deleteStudent() {
        if (!this.selectedItem || !confirm('Delete this student and all their grades?')) return;
        const id = this.selectedItem.id;
        this.students = this.students.filter(s => s.id !== id);
        delete this.grades[id];
        this.save();
        this.renderAll();
        this.showDashboard();
        this.toast('Student deleted');
    }

    // ===== Edit Functions =====
    editAssessment() {
        if (!this.selectedItem) return;
        const a = this.selectedItem;
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        
        title.textContent = 'Edit Assessment';
        body.innerHTML = `
            <form id="modalForm">
                <div class="form-group"><label class="form-label">Assessment Name</label><input class="form-input" id="f_aname" value="${a.name}" required></div>
                <div class="form-group"><label class="form-label">Type</label>
                    <select class="form-select" id="f_atype" required>
                        <option value="">Select</option><option value="cardio" ${a.type === 'cardio' ? 'selected' : ''}>Cardiovascular</option><option value="strength" ${a.type === 'strength' ? 'selected' : ''}>Strength</option><option value="flexibility" ${a.type === 'flexibility' ? 'selected' : ''}>Flexibility</option><option value="skills" ${a.type === 'skills' ? 'selected' : ''}>Sports Skills</option>
                    </select>
                </div>
                <div class="form-group"><label class="form-label">Exercises / Activities</label><textarea class="form-textarea" id="f_aexercises" rows="3" required placeholder="One per line">${a.exercises}</textarea></div>
                <div class="form-group"><label class="form-label">Grading Standards</label><textarea class="form-textarea" id="f_astandards" rows="3" placeholder="Describe grading criteria">${a.standards}</textarea></div>
                <div class="form-group"><label class="form-label">Target Periods</label>
                    <select class="form-select" id="f_aperiods" multiple style="height:80px">
                        <option value="1" ${a.periods.includes('1') ? 'selected' : ''}>Period 1</option><option value="2" ${a.periods.includes('2') ? 'selected' : ''}>Period 2</option><option value="3" ${a.periods.includes('3') ? 'selected' : ''}>Period 3</option><option value="4" ${a.periods.includes('4') ? 'selected' : ''}>Period 4</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        `;
        body.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); this.updateAssessment(); });
        document.getElementById('modalOverlay').classList.add('open');
    }

    editClass() {
        if (!this.selectedItem) return;
        const c = this.selectedItem;
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        
        title.textContent = 'Edit Class';
        body.innerHTML = `
            <form id="modalForm">
                <div class="form-group"><label class="form-label">Class Name</label><input class="form-input" id="f_cname" value="${c.name}" required></div>
                <div class="form-row">
                    <div class="form-group"><label class="form-label">Period</label>
                        <select class="form-select" id="f_cperiod" required>
                            <option value="">Select</option><option value="1" ${c.period === '1' ? 'selected' : ''}>Period 1</option><option value="2" ${c.period === '2' ? 'selected' : ''}>Period 2</option><option value="3" ${c.period === '3' ? 'selected' : ''}>Period 3</option><option value="4" ${c.period === '4' ? 'selected' : ''}>Period 4</option>
                        </select>
                    </div>
                    <div class="form-group"><label class="form-label">Grade Level</label>
                        <select class="form-select" id="f_cgrade" required>
                            <option value="">Select</option><option value="6" ${c.grade === '6' ? 'selected' : ''}>6th</option><option value="7" ${c.grade === '7' ? 'selected' : ''}>7th</option><option value="8" ${c.grade === '8' ? 'selected' : ''}>8th</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        `;
        body.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); this.updateClass(); });
        document.getElementById('modalOverlay').classList.add('open');
    }

    editStudent() {
        if (!this.selectedItem) return;
        const s = this.selectedItem;
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        
        title.textContent = 'Edit Student';
        body.innerHTML = `
            <form id="modalForm">
                <div class="form-row">
                    <div class="form-group"><label class="form-label">First Name</label><input class="form-input" id="f_first" value="${s.first}" required></div>
                    <div class="form-group"><label class="form-label">Last Name</label><input class="form-input" id="f_last" value="${s.last}" required></div>
                </div>
                <div class="form-group"><label class="form-label">Student ID</label><input class="form-input" id="f_sid" value="${s.id}" required></div>
                <div class="form-row">
                    <div class="form-group"><label class="form-label">Grade</label>
                        <select class="form-select" id="f_grade" required>
                            <option value="">Select</option><option value="6" ${s.grade === '6' ? 'selected' : ''}>6th</option><option value="7" ${s.grade === '7' ? 'selected' : ''}>7th</option><option value="8" ${s.grade === '8' ? 'selected' : ''}>8th</option>
                        </select>
                    </div>
                    <div class="form-group"><label class="form-label">Period</label>
                        <select class="form-select" id="f_period" required>
                            <option value="">Select</option><option value="1" ${s.period === '1' ? 'selected' : ''}>Period 1</option><option value="2" ${s.period === '2' ? 'selected' : ''}>Period 2</option><option value="3" ${s.period === '3' ? 'selected' : ''}>Period 3</option><option value="4" ${s.period === '4' ? 'selected' : ''}>Period 4</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        `;
        body.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); this.updateStudent(); });
        document.getElementById('modalOverlay').classList.add('open');
    }

    updateAssessment() {
        const periods = Array.from(document.getElementById('f_aperiods').selectedOptions).map(o => o.value);
        if (periods.length === 0) { this.toast('Select at least one period'); return; }
        
        const a = this.selectedItem;
        a.name = document.getElementById('f_aname').value.trim();
        a.type = document.getElementById('f_atype').value;
        a.exercises = document.getElementById('f_aexercises').value.trim();
        a.standards = document.getElementById('f_astandards').value.trim();
        a.periods = periods;
        
        this.save();
        this.renderAll();
        this.openAssessmentDetail(a.id);
        this.closeModal();
        this.toast('Assessment updated successfully');
    }

    updateClass() {
        const c = this.selectedItem;
        c.name = document.getElementById('f_cname').value.trim();
        c.period = document.getElementById('f_cperiod').value;
        c.grade = document.getElementById('f_cgrade').value;
        
        this.save();
        this.renderAll();
        this.openClassDetail(c.id);
        this.closeModal();
        this.toast('Class updated successfully');
    }

    updateStudent() {
        const s = this.selectedItem;
        const newId = document.getElementById('f_sid').value.trim();
        const oldId = s.id;
        
        if (newId !== oldId && this.students.find(st => st.id === newId)) {
            this.toast('Student ID already exists');
            return;
        }
        
        s.id = newId;
        s.first = document.getElementById('f_first').value.trim();
        s.last = document.getElementById('f_last').value.trim();
        s.grade = document.getElementById('f_grade').value;
        s.period = document.getElementById('f_period').value;
        
        // Update grades if ID changed
        if (newId !== oldId) {
            this.grades[newId] = this.grades[oldId];
            delete this.grades[oldId];
        }
        
        this.save();
        this.renderAll();
        this.openStudentDetail(s.id);
        this.closeModal();
        this.toast('Student updated successfully');
    }

    // ===== Helpers =====
    typeLabel(type) {
        return { cardio: 'Cardiovascular', strength: 'Strength', flexibility: 'Flexibility', skills: 'Sports Skills' }[type] || type;
    }

    getAllScores(assessmentId = null) {
        const scores = [];
        Object.keys(this.grades).forEach(sid => {
            const s = this.students.find(x => x.id === sid);
            if (!s) return;
            Object.keys(this.grades[sid]).forEach(aid => {
                if (assessmentId && aid !== assessmentId) return;
                const a = this.assessments.find(x => x.id === aid);
                if (!a) return;
                const g = this.grades[sid][aid];
                const result = [g.time, g.reps].filter(Boolean).join(' / ') || '—';
                scores.push({ studentName: `${s.first} ${s.last}`, assessmentName: a.name, result, ...g });
            });
        });
        scores.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        return scores;
    }

    globalSearch(query) {
        if (!query.trim()) { this.showDashboard(); return; }
        const q = query.toLowerCase();
        const student = this.students.find(s => `${s.first} ${s.last} ${s.id}`.toLowerCase().includes(q));
        if (student) { this.openStudentDetail(student.id); return; }
        const assessment = this.assessments.find(a => a.name.toLowerCase().includes(q));
        if (assessment) { this.openAssessmentDetail(assessment.id); return; }
        const cls = this.classes.find(c => c.name.toLowerCase().includes(q));
        if (cls) { this.openClassDetail(cls.id); return; }
    }

    toast(msg) {
        const container = document.getElementById('toastContainer');
        const el = document.createElement('div');
        el.className = 'toast';
        el.textContent = msg;
        container.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => { app = new App(); });
