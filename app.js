// Sample data
const sampleData = {
  students: [
    {"rollNumber": "2025001", "name": "Aarav Sharma", "class": "10A", "section": "A", "email": "aarav@school.edu"},
    {"rollNumber": "2025002", "name": "Priya Patel", "class": "10A", "section": "A", "email": "priya@school.edu"},
    {"rollNumber": "2025003", "name": "Arjun Singh", "class": "10B", "section": "B", "email": "arjun@school.edu"},
    {"rollNumber": "2025004", "name": "Kavya Reddy", "class": "10B", "section": "B", "email": "kavya@school.edu"},
    {"rollNumber": "2025005", "name": "Rohit Kumar", "class": "10C", "section": "C", "email": "rohit@school.edu"}
  ],
  attendanceRecords: [
    {"id": 1, "rollNumber": "2025001", "name": "Aarav Sharma", "date": "2025-08-07", "time": "09:15:30", "status": "Present", "synced": true},
    {"id": 2, "rollNumber": "2025002", "name": "Priya Patel", "date": "2025-08-07", "time": "09:16:45", "status": "Present", "synced": true},
    {"id": 3, "rollNumber": "2025003", "name": "Arjun Singh", "date": "2025-08-07", "time": "09:17:12", "status": "Present", "synced": false},
    {"id": 4, "rollNumber": "2025004", "name": "Kavya Reddy", "date": "2025-08-07", "time": "09:25:03", "status": "Late", "synced": false},
    {"id": 5, "rollNumber": "2025005", "name": "Rohit Kumar", "date": "2025-08-06", "time": "09:14:22", "status": "Present", "synced": true}
  ],
  systemStatus: {
    isOnline: true,
    lastSyncTime: "2025-08-07T09:30:00Z",
    pendingSyncCount: 2,
    totalScansToday: 4,
    googleSheetsConnected: true
  }
};

// App State
let appState = {
  currentPage: 'scannerPage',
  isOnline: true,
  students: [...sampleData.students],
  attendanceRecords: [...sampleData.attendanceRecords],
  systemStatus: {...sampleData.systemStatus}
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  updateUI();
});

function initializeApp() {
  // Update status indicator
  updateStatusIndicator();
  
  // Populate initial data
  renderStudentList();
  renderAttendanceRecords();
  updateQuickStats();
  updateSyncStatistics();
  
  // Show scanner page by default
  showPage('scannerPage');
}

function setupEventListeners() {
  // Navigation - Fixed to use proper event delegation
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = item.getAttribute('data-page');
      if (pageId) {
        showPage(pageId);
        updateActiveNav(item);
      }
    });
  });

  // Scanner functionality
  const scanBtn = document.getElementById('scanBtn');
  if (scanBtn) {
    scanBtn.addEventListener('click', simulateQRScan);
  }

  // File upload - Fixed to properly handle file input
  const qrFileInput = document.getElementById('qrFileInput');
  if (qrFileInput) {
    qrFileInput.addEventListener('change', handleFileUpload);
  }

  // Search functionality
  const studentSearch = document.getElementById('studentSearch');
  if (studentSearch) {
    studentSearch.addEventListener('input', filterStudents);
  }

  // Filter functionality
  const statusFilter = document.getElementById('statusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', filterRecords);
  }

  // Button actions
  const addStudentBtn = document.getElementById('addStudentBtn');
  if (addStudentBtn) {
    addStudentBtn.addEventListener('click', () => {
      alert('Add student functionality would open a form in a real app');
    });
  }

  const manualSyncBtn = document.getElementById('manualSyncBtn');
  if (manualSyncBtn) {
    manualSyncBtn.addEventListener('click', performManualSync);
  }

  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.addEventListener('click', showInstallPrompt);
  }

  const architectureBtn = document.getElementById('architectureBtn');
  if (architectureBtn) {
    architectureBtn.addEventListener('click', showArchitecture);
  }

  // Modal controls
  const closeScanModal = document.getElementById('closeScanModal');
  if (closeScanModal) {
    closeScanModal.addEventListener('click', () => hideModal('scanResultModal'));
  }

  const closeArchitectureModal = document.getElementById('closeArchitectureModal');
  if (closeArchitectureModal) {
    closeArchitectureModal.addEventListener('click', () => hideModal('architectureModal'));
  }

  // Close modals when clicking outside
  const scanResultModal = document.getElementById('scanResultModal');
  if (scanResultModal) {
    scanResultModal.addEventListener('click', (e) => {
      if (e.target === scanResultModal) hideModal('scanResultModal');
    });
  }
  
  const architectureModal = document.getElementById('architectureModal');
  if (architectureModal) {
    architectureModal.addEventListener('click', (e) => {
      if (e.target === architectureModal) hideModal('architectureModal');
    });
  }

  // Simulate online/offline toggle (for demo)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'o' && e.ctrlKey) {
      e.preventDefault();
      toggleOnlineStatus();
    }
  });
}

function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    appState.currentPage = pageId;
  }
}

function updateActiveNav(activeItem) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
  });
  activeItem.classList.add('active');
}

function updateStatusIndicator() {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  
  if (statusDot && statusText) {
    if (appState.isOnline) {
      statusDot.classList.remove('offline');
      statusText.textContent = 'Online';
    } else {
      statusDot.classList.add('offline');
      statusText.textContent = 'Offline';
    }
  }
}

function updateQuickStats() {
  const todayScans = document.getElementById('todayScans');
  const pendingSync = document.getElementById('pendingSync');
  
  if (todayScans) todayScans.textContent = appState.systemStatus.totalScansToday;
  if (pendingSync) pendingSync.textContent = appState.systemStatus.pendingSyncCount;
}

function simulateQRScan() {
  const scanBtn = document.getElementById('scanBtn');
  if (!scanBtn) return;
  
  // Simulate scanning process
  scanBtn.innerHTML = '<span class="loading"></span> Scanning...';
  scanBtn.disabled = true;
  
  setTimeout(() => {
    // Simulate successful scan
    const randomStudent = appState.students[Math.floor(Math.random() * appState.students.length)];
    processQRScanResult(randomStudent.rollNumber);
    
    scanBtn.innerHTML = '📱 Scan QR Code';
    scanBtn.disabled = false;
  }, 2000);
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Show loading state
    const uploadLabel = document.querySelector('label[for="qrFileInput"]');
    if (uploadLabel) {
      const originalText = uploadLabel.innerHTML;
      uploadLabel.innerHTML = '<span class="loading"></span> Processing...';
      
      // Simulate QR code processing from uploaded image
      setTimeout(() => {
        const randomStudent = appState.students[Math.floor(Math.random() * appState.students.length)];
        processQRScanResult(randomStudent.rollNumber);
        
        // Reset button
        uploadLabel.innerHTML = originalText;
        event.target.value = ''; // Clear file input
      }, 1500);
    }
  }
}

function processQRScanResult(rollNumber) {
  const student = appState.students.find(s => s.rollNumber === rollNumber);
  
  if (student) {
    // Create new attendance record
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    const dateString = now.toISOString().split('T')[0];
    
    const newRecord = {
      id: appState.attendanceRecords.length + 1,
      rollNumber: student.rollNumber,
      name: student.name,
      date: dateString,
      time: timeString,
      status: now.getHours() > 9 ? 'Late' : 'Present',
      synced: appState.isOnline
    };
    
    appState.attendanceRecords.unshift(newRecord);
    
    // Update statistics
    appState.systemStatus.totalScansToday++;
    if (!appState.isOnline) {
      appState.systemStatus.pendingSyncCount++;
    }
    
    // Show success modal
    showScanResult(student, newRecord);
    
    // Update UI
    updateQuickStats();
    updateSyncStatistics();
    renderAttendanceRecords();
  } else {
    showScanResult(null, null, 'Student not found');
  }
}

function showScanResult(student, record, error = null) {
  const modalBody = document.getElementById('scanResultContent');
  if (!modalBody) return;
  
  if (error) {
    modalBody.innerHTML = `
      <div class="scan-result">
        <div class="scan-result-error" style="color: var(--color-error); font-size: var(--font-size-4xl); margin-bottom: var(--space-16);">❌</div>
        <h4 style="color: var(--color-error);">Scan Failed</h4>
        <p>${error}</p>
        <button class="btn btn--primary btn--full-width" onclick="hideModal('scanResultModal')">Try Again</button>
      </div>
    `;
  } else {
    modalBody.innerHTML = `
      <div class="scan-result">
        <div class="scan-result-success">✅</div>
        <div class="scan-result-info">
          <h4>Attendance Recorded</h4>
          <div class="scan-result-details">
            <div class="detail-row">
              <span><strong>Name:</strong></span>
              <span>${student.name}</span>
            </div>
            <div class="detail-row">
              <span><strong>Roll Number:</strong></span>
              <span>${student.rollNumber}</span>
            </div>
            <div class="detail-row">
              <span><strong>Class:</strong></span>
              <span>${student.class}</span>
            </div>
            <div class="detail-row">
              <span><strong>Status:</strong></span>
              <span class="attendance-status ${record.status.toLowerCase()}">${record.status}</span>
            </div>
            <div class="detail-row">
              <span><strong>Time:</strong></span>
              <span>${record.time}</span>
            </div>
            <div class="detail-row">
              <span><strong>Sync Status:</strong></span>
              <span>${record.synced ? '✅ Synced' : '⏳ Pending'}</span>
            </div>
          </div>
          <button class="btn btn--primary btn--full-width" onclick="hideModal('scanResultModal')">Continue</button>
        </div>
      </div>
    `;
  }
  
  showModal('scanResultModal');
}

function renderStudentList() {
  const studentList = document.getElementById('studentList');
  if (!studentList) return;
  
  const filteredStudents = getFilteredStudents();
  
  studentList.innerHTML = filteredStudents.map(student => `
    <div class="student-item">
      <div class="student-header">
        <div class="student-name">${student.name}</div>
        <div class="student-roll">${student.rollNumber}</div>
      </div>
      <div class="student-details">
        <div>Class: ${student.class} | Section: ${student.section}</div>
        <div>Email: ${student.email}</div>
      </div>
    </div>
  `).join('');
}

function getFilteredStudents() {
  const studentSearch = document.getElementById('studentSearch');
  const searchTerm = studentSearch ? studentSearch.value.toLowerCase() : '';
  
  return appState.students.filter(student => 
    student.name.toLowerCase().includes(searchTerm) ||
    student.rollNumber.toLowerCase().includes(searchTerm) ||
    student.class.toLowerCase().includes(searchTerm)
  );
}

function filterStudents() {
  renderStudentList();
}

function renderAttendanceRecords() {
  const recordsList = document.getElementById('recordsList');
  if (!recordsList) return;
  
  const filteredRecords = getFilteredRecords();
  
  recordsList.innerHTML = filteredRecords.map(record => `
    <div class="record-item">
      <div class="record-header">
        <div class="record-name">${record.name}</div>
        <div class="sync-status">
          <div class="sync-icon ${record.synced ? 'synced' : 'pending'}"></div>
          <span class="status-text">${record.synced ? 'Synced' : 'Pending'}</span>
        </div>
      </div>
      <div class="record-details">
        <div>
          <span>Roll: ${record.rollNumber}</span> | 
          <span class="attendance-status ${record.status.toLowerCase()}">${record.status}</span>
        </div>
        <div>${record.date} ${record.time}</div>
      </div>
    </div>
  `).join('');
}

function getFilteredRecords() {
  const statusFilter = document.getElementById('statusFilter');
  const filterValue = statusFilter ? statusFilter.value : 'all';
  
  return appState.attendanceRecords.filter(record => {
    if (filterValue === 'all') return true;
    if (filterValue === 'synced') return record.synced;
    if (filterValue === 'pending') return !record.synced;
    return true;
  });
}

function filterRecords() {
  renderAttendanceRecords();
}

function updateSyncStatistics() {
  const totalRecords = appState.attendanceRecords.length;
  const syncedRecords = appState.attendanceRecords.filter(r => r.synced).length;
  const pendingRecords = totalRecords - syncedRecords;
  
  const totalElement = document.getElementById('totalRecords');
  const syncedElement = document.getElementById('syncedRecords');
  const pendingElement = document.getElementById('pendingRecords');
  
  if (totalElement) totalElement.textContent = totalRecords;
  if (syncedElement) syncedElement.textContent = syncedRecords;
  if (pendingElement) pendingElement.textContent = pendingRecords;
}

function performManualSync() {
  const manualSyncBtn = document.getElementById('manualSyncBtn');
  if (!manualSyncBtn) return;
  
  if (!appState.isOnline) {
    alert('Cannot sync while offline. Please check your internet connection.');
    return;
  }
  
  manualSyncBtn.innerHTML = '<span class="loading"></span> Syncing...';
  manualSyncBtn.disabled = true;
  
  setTimeout(() => {
    // Mark all pending records as synced
    appState.attendanceRecords.forEach(record => {
      if (!record.synced) {
        record.synced = true;
      }
    });
    
    // Update system status
    appState.systemStatus.pendingSyncCount = 0;
    appState.systemStatus.lastSyncTime = new Date().toISOString();
    
    // Update UI
    updateQuickStats();
    updateSyncStatistics();
    renderAttendanceRecords();
    updateLastSyncTime();
    
    manualSyncBtn.innerHTML = '🔄 Manual Sync';
    manualSyncBtn.disabled = false;
    
    alert('✅ Sync completed successfully!');
  }, 2000);
}

function updateLastSyncTime() {
  const lastSyncElement = document.getElementById('lastSyncTime');
  if (lastSyncElement) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    lastSyncElement.textContent = `Today, ${timeString}`;
  }
}

function showInstallPrompt() {
  const installMessage = `📱 Install Attendance Scanner as a Progressive Web App?

Benefits:
• Works offline
• Faster loading
• App-like experience
• Home screen icon

This is a demo - in a real PWA, this would trigger the browser's install prompt.`;
  
  if (confirm(installMessage)) {
    alert('🎉 App installed successfully!\n\n(In a real PWA, the app would be added to your device)');
  }
}

function showArchitecture() {
  showModal('architectureModal');
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

function toggleOnlineStatus() {
  appState.isOnline = !appState.isOnline;
  updateStatusIndicator();
  
  // Show notification
  const status = appState.isOnline ? 'Online' : 'Offline';
  
  // Create temporary notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-${appState.isOnline ? 'success' : 'warning'});
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 1001;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    animation: slideInUp 0.3s ease-out;
  `;
  notification.textContent = `📡 Status: ${status}`;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Utility function to update UI elements
function updateUI() {
  updateStatusIndicator();
  updateQuickStats();
  updateSyncStatistics();
  updateLastSyncTime();
}

// Demo feature: Add some interactive help
document.addEventListener('keydown', (e) => {
  if (e.key === 'h' && e.ctrlKey) {
    e.preventDefault();
    showDemoHelp();
  }
});

function showDemoHelp() {
  const helpContent = `🔧 Attendance Scanner Demo - Keyboard Shortcuts:

• Ctrl + O: Toggle Online/Offline status
• Ctrl + H: Show this help

Demo Features:
• Simulated QR code scanning
• Offline-first data storage
• Real-time sync status
• Mobile-responsive design
• PWA installation simulation

Navigation:
• Use bottom navigation to switch between pages
• Search students in the database
• Filter attendance records by sync status
• View system architecture diagram

Try uploading any image file to simulate QR code scanning!`;
  
  alert(helpContent);
}

// Global function to ensure modal closing works from onclick handlers
window.hideModal = hideModal;

// Simulate periodic status updates (in a real app, this would be based on actual network status)
setInterval(() => {
  // Occasionally simulate connection changes for demo purposes
  if (Math.random() < 0.05) { // 5% chance every 10 seconds
    // Don't actually toggle, just update sync count if offline
    if (!appState.isOnline && appState.systemStatus.pendingSyncCount > 0) {
      // Simulate some background sync attempts
      console.log('Background sync attempt...');
    }
  }
}, 10000);