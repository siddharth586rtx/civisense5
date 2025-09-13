class CivicReportingSystem {
    constructor() {
        this.issues = this.loadIssues();
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.renderIssues();
        this.loadSampleData();
    }

    setupEventListeners() {
        const form = document.getElementById('reportForm');
        const searchInput = document.getElementById('searchInput');
        const filterStatus = document.getElementById('filterStatus');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        searchInput.addEventListener('input', (e) => this.handleSearch(e));
        filterStatus.addEventListener('change', (e) => this.handleFilter(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const photoFile = document.getElementById('photo').files[0];
        
        const issue = {
            id: Date.now().toString(),
            type: document.getElementById('issueType').value,
            description: document.getElementById('description').value,
            location: document.getElementById('location').value,
            priority: document.getElementById('priority').value,
            status: 'pending',
            date: new Date().toISOString(),
            photo: photoFile ? URL.createObjectURL(photoFile) : null
        };

        this.issues.unshift(issue);
        this.saveIssues();
        this.renderIssues();
        e.target.reset();
        
        // Show success message
        this.showNotification('Issue reported successfully!');
    }

    handleSearch(e) {
        this.renderIssues(e.target.value);
    }

    handleFilter(e) {
        this.renderIssues(null, e.target.value);
    }

    renderIssues(searchTerm = '', statusFilter = 'all') {
        const issuesList = document.getElementById('issuesList');
        let filteredIssues = this.issues;

        // Filter by search term
        if (searchTerm) {
            filteredIssues = filteredIssues.filter(issue =>
                issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                issue.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filteredIssues = filteredIssues.filter(issue => issue.status === statusFilter);
        }

        if (filteredIssues.length === 0) {
            issuesList.innerHTML = '<div class="no-issues">No issues found</div>';
            return;
        }

        issuesList.innerHTML = filteredIssues.map(issue => this.createIssueCard(issue)).join('');
    }

    createIssueCard(issue) {
        const date = new Date(issue.date).toLocaleDateString();
        const photoHtml = issue.photo ? `<img src="${issue.photo}" alt="Issue photo" class="issue-photo">` : '';
        
        return `
            <div class="issue-card priority-${issue.priority}">
                <div class="issue-header">
                    <span class="issue-type">${issue.type}</span>
                    <span class="issue-status status-${issue.status}">${this.formatStatus(issue.status)}</span>
                </div>
                ${photoHtml}
                <div class="issue-description">${issue.description}</div>
                <div class="issue-location">📍 ${issue.location}</div>
                <div class="issue-date">Reported: ${date}</div>
            </div>
        `;
    }

    formatStatus(status) {
        return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    loadIssues() {
        const stored = localStorage.getItem('civicIssues');
        return stored ? JSON.parse(stored) : [];
    }

    saveIssues() {
        localStorage.setItem('civicIssues', JSON.stringify(this.issues));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2c2c2c;
            color: white;
            padding: 1rem 2rem;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    loadSampleData() {
        if (this.issues.length === 0) {
            const sampleIssues = [
                {
                    id: '1',
                    type: 'pothole',
                    description: 'Large pothole causing traffic issues and potential vehicle damage',
                    location: 'Main Street near City Park',
                    priority: 'high',
                    status: 'in-progress',
                    date: new Date(Date.now() - 86400000).toISOString(),
                    photo: 'https://images.pexels.com/photos/1006129/pexels-photo-1006129.jpeg?auto=compress&cs=tinysrgb&w=400'
                },
                {
                    id: '2',
                    type: 'streetlight',
                    description: 'Streetlight has been flickering for several days, creating safety concerns',
                    location: '5th Avenue and Oak Street intersection',
                    priority: 'medium',
                    status: 'pending',
                    date: new Date(Date.now() - 172800000).toISOString(),
                    photo: null
                },
                {
                    id: '3',
                    type: 'garbage',
                    description: 'Garbage bins have not been collected for over a week',
                    location: 'Residential area on Elm Street',
                    priority: 'medium',
                    status: 'resolved',
                    date: new Date(Date.now() - 259200000).toISOString(),
                    photo: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=400'
                },
                {
                    id: '4',
                    type: 'water',
                    description: 'Water main break causing flooding in the area',
                    location: 'Downtown Commercial District',
                    priority: 'high',
                    status: 'in-progress',
                    date: new Date(Date.now() - 43200000).toISOString(),
                    photo: null
                }
            ];
            
            this.issues = sampleIssues;
            this.saveIssues();
            this.renderIssues();
        }
    }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CivicReportingSystem();
});