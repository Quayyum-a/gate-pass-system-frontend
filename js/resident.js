document.addEventListener('DOMContentLoaded', () => {
  const { user, userType } = getSession();
  if (!user || userType !== 'resident') {
    window.location.href = '../login.html';
    return;
  }

  const userNameElement = document.getElementById('user-name');
  if (userNameElement) {
    userNameElement.textContent = user.fullName;
  }

  const generateTokenForm = document.getElementById('generate-token-form');
  if (generateTokenForm) {
    generateTokenForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const visitorName = document.getElementById('visitor-name').value;
      const visitorPhone = document.getElementById('visitor-phone').value;
      const whomToSee = document.getElementById('whom-to-see').value;

      if (!validatePhone(visitorPhone)) {
        showError('Invalid phone number');
        return;
      }

      try {
        const data = await apiCall('/api/resident/generate/code', 'POST', {
          visitorName,
          visitorPhone,
          whomToSee
        });
        const tokenResult = document.getElementById('token-result');
        const generatedToken = document.getElementById('generated-token');
        generatedToken.textContent = data.token;
        tokenResult.classList.remove('hidden');
        document.getElementById('copy-token').addEventListener('click', () => {
          navigator.clipboard.writeText(data.token);
          alert('Token copied!');
        });
      } catch (error) {
        // Error handled in api.js
      }
    });
  }

  // Token Management
  const tokenTable = document.getElementById('token-table');
  if (tokenTable) {
    const loadTokens = async (status = 'all', search = '') => {
      try {
        const data = await apiCall('/api/resident/find/code', 'POST', { status, search });
        tokenTable.innerHTML = '';
        data.tokens.forEach(token => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${token.token}</td>
            <td>${token.visitorName}</td>
            <td>${token.visitorPhone}</td>
            <td>${token.whomToSee}</td>
            <td>${token.status}</td>
            <td><button class="button button--secondary" data-token="${token.token}" ${token.status !== 'active' ? 'disabled' : ''}>Revoke</button></td>
          `;
          tokenTable.appendChild(row);
        });

        document.querySelectorAll('.button[data-token]').forEach(button => {
          button.addEventListener('click', async () => {
            try {
              await apiCall('/api/resident/revoke/code', 'POST', { token: button.dataset.token });
              loadTokens(document.getElementById('status-filter').value, document.getElementById('search').value);
            } catch (error) {
              // Error handled in api.js
            }
          });
        });
      } catch (error) {
        // Error handled in api.js
      }
    };

    document.getElementById('status-filter')?.addEventListener('change', (e) => {
      loadTokens(e.target.value, document.getElementById('search').value);
    });
    document.getElementById('search')?.addEventListener('input', (e) => {
      loadTokens(document.getElementById('status-filter').value, e.target.value);
    });

    loadTokens();
  }

  // Visitor History
  const visitorTable = document.getElementById('visitor-table');
  if (visitorTable) {
    const loadVisitors = async (fromDate = '', toDate = '') => {
      try {
        const data = await apiCall('/api/resident/visitor/history', 'POST', { fromDate, toDate });
        visitorTable.innerHTML = '';
        data.visitors.forEach(visitor => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${visitor.name}</td>
            <td>${visitor.phone}</td>
            <td>${visitor.whomToSee}</td>
            <td>${new Date(visitor.visitDate).toLocaleDateString()}</td>
            <td>${visitor.purpose}</td>
          `;
          visitorTable.appendChild(row);
        });
      } catch (error) {
        // Error handled in api.js
      }
    };

    document.getElementById('filter-visitors')?.addEventListener('click', () => {
      const fromDate = document.getElementById('date-from').value;
      const toDate = document.getElementById('date-to').value;
      loadVisitors(fromDate, toDate);
    });

    loadVisitors();
  }

  // Profile Management
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    document.getElementById('fullName').value = user.fullName;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;
    document.getElementById('address').value = user.address || '';

    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('fullName').value;
      const phone = document.getElementById('phone').value;
      const address = document.getElementById('address').value;

      if (!validatePhone(phone)) {
        showError('Invalid phone number');
        return;
      }

      try {
        const data = await apiCall('/api/resident/profile', 'POST', { fullName, phone, address });
        setSession({ ...user, fullName, phone, address }, 'resident');
        alert('Profile updated successfully');
      } catch (error) {
        // Error handled in api.js
      }
    });
  }

  const passwordForm = document.getElementById('password-form');
  if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;

      try {
        await apiCall('/api/resident/change-password', 'POST', { currentPassword, newPassword });
        alert('Password changed successfully');
        passwordForm.reset();
      } catch (error) {
        // Error handled in api.js
      }
    });
  }

  const profilePictureUpload = document.getElementById('profile-picture-upload');
  if (profilePictureUpload) {
    profilePictureUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          document.getElementById('profile-picture').src = event.target.result;
          // Backend call for upload can be added here
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Placeholder for dashboard stats
  if (document.getElementById('tokens-generated')) {
    document.getElementById('tokens-generated').textContent = '10'; // Mock data
    document.getElementById('active-visitors').textContent = '3'; // Mock data
  }
});