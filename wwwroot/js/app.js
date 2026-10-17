// Employee Management System - Frontend Application
const API_BASE = '/api/employees';

let employeeModal;
let deleteModal;
let deleteEmployeeId = null;
let searchTimeout = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    loadEmployees();
    loadSummary();
});

// ==================== API CALLS ====================

async function loadEmployees(search = '') {
    showLoading(true);
    hideError();

    try {
        const url = search ? `${API_BASE}?search=${encodeURIComponent(search)}` : API_BASE;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to load employees (HTTP ${response.status})`);
        }

        const employees = await response.json();
        renderEmployeeTable(employees);
    } catch (error) {
        console.error('Error loading employees:', error);
        showError(error.message || 'Failed to load employees. Please try again.');
    } finally {
        showLoading(false);
    }
}

async function loadSummary() {
    try {
        const response = await fetch(`${API_BASE}/summary`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('totalEmployees').textContent = data.totalEmployees;
            document.getElementById('totalDepartments').textContent = data.totalDepartments;
        }
    } catch (error) {
        console.error('Error loading summary:', error);
    }
}

async function saveEmployee() {
    // Validate form
    if (!validateForm()) {
        return;
    }

    const id = document.getElementById('employeeId').value;
    const isEdit = id !== '';

    const employee = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        department: document.getElementById('department').value.trim(),
        designation: document.getElementById('designation').value.trim(),
        salary: parseFloat(document.getElementById('salary').value),
        joiningDate: document.getElementById('joiningDate').value
    };

    // Show loading state
    setSaveLoading(true);
    hideFormError();

    try {
        const url = isEdit ? `${API_BASE}/${id}` : API_BASE;
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });

        if (response.ok || response.status === 201) {
            employeeModal.hide();
            showToast(isEdit ? 'Employee updated successfully!' : 'Employee added successfully!', 'success');
            loadEmployees();
            loadSummary();
        } else {
            const errorData = await response.json().catch(() => null);
            let errorMessage = 'Failed to save employee.';

            if (response.status === 409) {
                errorMessage = errorData?.message || 'An employee with this email already exists.';
            } else if (response.status === 400) {
                if (errorData?.errors) {
                    const messages = [];
                    for (const key in errorData.errors) {
                        messages.push(...errorData.errors[key]);
                    }
                    errorMessage = messages.join(' ');
                } else if (errorData?.message) {
                    errorMessage = errorData.message;
                }
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            }

            showFormError(errorMessage);
        }
    } catch (error) {
        console.error('Error saving employee:', error);
        showFormError('Network error. Please check your connection and try again.');
    } finally {
        setSaveLoading(false);
    }
}

async function confirmDelete() {
    if (!deleteEmployeeId) return;

    setDeleteLoading(true);

    try {
        const response = await fetch(`${API_BASE}/${deleteEmployeeId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            deleteModal.hide();
            showToast('Employee deleted successfully!', 'success');
            loadEmployees(document.getElementById('searchInput').value);
            loadSummary();
        } else {
            const errorData = await response.json().catch(() => null);
            deleteModal.hide();
            showToast(errorData?.message || 'Failed to delete employee.', 'danger');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        deleteModal.hide();
        showToast('Network error. Please try again.', 'danger');
    } finally {
        setDeleteLoading(false);
        deleteEmployeeId = null;
    }
}

// ==================== UI RENDERING ====================

function renderEmployeeTable(employees) {
    const tbody = document.getElementById('employeeTableBody');
    const tableContainer = document.getElementById('tableContainer');
    const emptyState = document.getElementById('emptyState');

    if (employees.length === 0) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    tableContainer.style.display = 'block';

    tbody.innerHTML = employees.map(emp => `
        <tr class="fade-in">
            <td><span class="badge bg-secondary">${emp.id}</span></td>
            <td class="fw-semibold">${escapeHtml(emp.fullName)}</td>
            <td><a href="mailto:${escapeHtml(emp.email)}" class="text-decoration-none">${escapeHtml(emp.email)}</a></td>
            <td><span class="dept-badge bg-primary bg-opacity-10 text-primary">${escapeHtml(emp.department)}</span></td>
            <td>${escapeHtml(emp.designation)}</td>
            <td class="salary-cell">$${Number(emp.salary).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td>${formatDate(emp.joiningDate)}</td>
            <td class="text-center">
                <button class="btn btn-outline-primary btn-action" onclick="openEditModal(${emp.id})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger btn-action" onclick="openDeleteModal(${emp.id}, '${escapeHtml(emp.fullName).replace(/'/g, "\\'")}')" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ==================== MODAL OPERATIONS ====================

function openAddModal() {
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeId').value = '';
    document.getElementById('employeeModalLabel').innerHTML = '<i class="bi bi-person-plus me-2"></i>Add Employee';
    document.getElementById('saveBtnText').textContent = 'Save Employee';
    clearValidation();
    hideFormError();
    employeeModal.show();
}

async function openEditModal(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) {
            showToast('Failed to load employee data.', 'danger');
            return;
        }

        const emp = await response.json();

        document.getElementById('employeeId').value = emp.id;
        document.getElementById('fullName').value = emp.fullName;
        document.getElementById('email').value = emp.email;
        document.getElementById('department').value = emp.department;
        document.getElementById('designation').value = emp.designation;
        document.getElementById('salary').value = emp.salary;
        document.getElementById('joiningDate').value = emp.joiningDate ? emp.joiningDate.split('T')[0] : '';

        document.getElementById('employeeModalLabel').innerHTML = '<i class="bi bi-pencil me-2"></i>Edit Employee';
        document.getElementById('saveBtnText').textContent = 'Update Employee';
        clearValidation();
        hideFormError();
        employeeModal.show();
    } catch (error) {
        console.error('Error loading employee:', error);
        showToast('Failed to load employee data.', 'danger');
    }
}

function openDeleteModal(id, name) {
    deleteEmployeeId = id;
    document.getElementById('deleteEmployeeName').textContent = name;
    deleteModal.show();
}

// ==================== SEARCH ====================

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');

    clearBtn.style.display = searchInput.value ? 'block' : 'none';

    // Debounce search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        loadEmployees(searchInput.value.trim());
    }, 300);
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearchBtn').style.display = 'none';
    loadEmployees();
}

// ==================== VALIDATION ====================

function validateForm() {
    let isValid = true;
    clearValidation();

    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const department = document.getElementById('department');
    const designation = document.getElementById('designation');
    const salary = document.getElementById('salary');
    const joiningDate = document.getElementById('joiningDate');

    if (!fullName.value.trim()) {
        setInvalid(fullName, 'Full name is required.');
        isValid = false;
    } else if (fullName.value.trim().length > 100) {
        setInvalid(fullName, 'Full name cannot exceed 100 characters.');
        isValid = false;
    }

    if (!email.value.trim()) {
        setInvalid(email, 'Email is required.');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        setInvalid(email, 'Please enter a valid email address.');
        isValid = false;
    }

    if (!department.value.trim()) {
        setInvalid(department, 'Department is required.');
        isValid = false;
    }

    if (!designation.value.trim()) {
        setInvalid(designation, 'Designation is required.');
        isValid = false;
    }

    if (!salary.value || parseFloat(salary.value) <= 0) {
        setInvalid(salary, 'Salary must be greater than zero.');
        isValid = false;
    }

    if (!joiningDate.value) {
        setInvalid(joiningDate, 'Joining date is required.');
        isValid = false;
    }

    return isValid;
}

function setInvalid(element, message) {
    element.classList.add('is-invalid');
    const errorDiv = element.closest('.col-md-6')?.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function clearValidation() {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.style.display = '');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ==================== UI HELPERS ====================

function showLoading(show) {
    document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
    if (show) {
        document.getElementById('tableContainer').style.display = 'none';
        document.getElementById('emptyState').style.display = 'none';
    }
}

function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    document.getElementById('errorMessage').textContent = message;
    errorAlert.style.display = 'block';
}

function hideError() {
    document.getElementById('errorAlert').style.display = 'none';
}

function showFormError(message) {
    const formError = document.getElementById('formError');
    formError.textContent = message;
    formError.style.display = 'block';
}

function hideFormError() {
    document.getElementById('formError').style.display = 'none';
}

function setSaveLoading(loading) {
    const btn = document.getElementById('saveBtn');
    const spinner = document.getElementById('saveBtnSpinner');

    btn.disabled = loading;
    spinner.style.display = loading ? 'inline-block' : 'none';
}

function setDeleteLoading(loading) {
    const btn = document.getElementById('confirmDeleteBtn');
    const spinner = document.getElementById('deleteBtnSpinner');

    btn.disabled = loading;
    spinner.style.display = loading ? 'inline-block' : 'none';
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toastId = 'toast-' + Date.now();

    const iconMap = {
        success: 'bi-check-circle-fill',
        danger: 'bi-exclamation-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
    };

    const bgMap = {
        success: 'bg-success',
        danger: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info'
    };

    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgMap[type] || bgMap.info} border-0 shadow-lg"
             role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center">
                    <i class="bi ${iconMap[type] || iconMap.info} me-2 fs-5"></i>
                    ${escapeHtml(message)}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 4000 });
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
