/**
 * Lab Inventory & Borrowing System - Core Application Logic
 */

(function () {
  'use strict';

  // State
  let items = [];
  let borrowings = [];
  let pendingDeleteAction = null;

  // DOM Elements
  const elements = {
    // Stats
    statTotalItems: document.getElementById('statTotalItems'),
    statTotalStock: document.getElementById('statTotalStock'),
    statBorrowedStock: document.getElementById('statBorrowedStock'),
    statActiveLoans: document.getElementById('statActiveLoans'),

    // Badges
    badgeInventoryCount: document.getElementById('badgeInventoryCount'),
    badgeActiveCount: document.getElementById('badgeActiveCount'),
    badgeHistoryCount: document.getElementById('badgeHistoryCount'),

    // Tables
    inventoryTableBody: document.getElementById('inventoryTableBody'),
    activeLoansTableBody: document.getElementById('activeLoansTableBody'),
    historyTableBody: document.getElementById('historyTableBody'),

    // Search & Filter
    searchItemInput: document.getElementById('searchItemInput'),
    filterCategory: document.getElementById('filterCategory'),
    filterAvailability: document.getElementById('filterAvailability'),
    searchActiveLoanInput: document.getElementById('searchActiveLoanInput'),
    searchHistoryInput: document.getElementById('searchHistoryInput'),
    filterHistoryStatus: document.getElementById('filterHistoryStatus'),

    // Buttons
    btnOpenAddItem: document.getElementById('btnOpenAddItem'),
    btnOpenAddBorrow: document.getElementById('btnOpenAddBorrow'),
    btnResetData: document.getElementById('btnResetData'),
    dateText: document.getElementById('dateText'),

    // Modals
    modalItemBackdrop: document.getElementById('modalItemBackdrop'),
    formItem: document.getElementById('formItem'),
    modalItemTitle: document.getElementById('modalItemTitle'),
    itemIdField: document.getElementById('itemIdField'),
    itemCodeField: document.getElementById('itemCodeField'),
    itemCategoryField: document.getElementById('itemCategoryField'),
    itemNameField: document.getElementById('itemNameField'),
    itemLocationField: document.getElementById('itemLocationField'),
    itemConditionField: document.getElementById('itemConditionField'),
    itemStockField: document.getElementById('itemStockField'),
    itemStockHelperText: document.getElementById('itemStockHelperText'),
    itemDescField: document.getElementById('itemDescField'),

    // Modal CRUD Controls
    btnModeCreate: document.getElementById('btnModeCreate'),
    btnModeEdit: document.getElementById('btnModeEdit'),
    quickItemSelectorWrapper: document.getElementById('quickItemSelectorWrapper'),
    quickItemSelect: document.getElementById('quickItemSelect'),
    crudStatusBanner: document.getElementById('crudStatusBanner'),
    crudStatusTag: document.getElementById('crudStatusTag'),
    crudStatusDesc: document.getElementById('crudStatusDesc'),
    crudItemBadgeStatus: document.getElementById('crudItemBadgeStatus'),
    btnCrudDelete: document.getElementById('btnCrudDelete'),
    btnCrudReset: document.getElementById('btnCrudReset'),
    btnCrudRead: document.getElementById('btnCrudRead'),
    btnCrudUpdate: document.getElementById('btnCrudUpdate'),
    btnCrudCreate: document.getElementById('btnCrudCreate'),

    // In-Page CRUD Workspace Controls
    tabBtnCrudItem: document.getElementById('tabBtnCrudItem'),
    btnPageModeCreate: document.getElementById('btnPageModeCreate'),
    btnPageModeEdit: document.getElementById('btnPageModeEdit'),
    pageQuickItemWrapper: document.getElementById('pageQuickItemWrapper'),
    pageQuickItemSelect: document.getElementById('pageQuickItemSelect'),
    formPageItem: document.getElementById('formPageItem'),
    pageItemIdField: document.getElementById('pageItemIdField'),
    pageItemCodeField: document.getElementById('pageItemCodeField'),
    pageItemCategoryField: document.getElementById('pageItemCategoryField'),
    pageItemNameField: document.getElementById('pageItemNameField'),
    pageItemLocationField: document.getElementById('pageItemLocationField'),
    pageItemConditionField: document.getElementById('pageItemConditionField'),
    pageItemStockField: document.getElementById('pageItemStockField'),
    pageItemStockHelperText: document.getElementById('pageItemStockHelperText'),
    pageItemDescField: document.getElementById('pageItemDescField'),
    pageCrudStatusBanner: document.getElementById('pageCrudStatusBanner'),
    pageCrudStatusTag: document.getElementById('pageCrudStatusTag'),
    pageCrudStatusDesc: document.getElementById('pageCrudStatusDesc'),
    pageCrudItemBadge: document.getElementById('pageCrudItemBadge'),
    btnPageCrudDelete: document.getElementById('btnPageCrudDelete'),
    btnPageCrudReset: document.getElementById('btnPageCrudReset'),
    btnPageCrudRead: document.getElementById('btnPageCrudRead'),
    btnPageCrudUpdate: document.getElementById('btnPageCrudUpdate'),
    btnPageCrudCreate: document.getElementById('btnPageCrudCreate'),

    modalBorrowBackdrop: document.getElementById('modalBorrowBackdrop'),
    formBorrow: document.getElementById('formBorrow'),
    borrowIdField: document.getElementById('borrowIdField'),
    borrowTitle: document.getElementById('modalBorrowTitle'),
    borrowSelectProduct: document.getElementById('borrowSelectProduct'),
    borrowStockIndicator: document.getElementById('borrowStockIndicator'),
    borrowAvailableCount: document.getElementById('borrowAvailableCount'),
    borrowQuantity: document.getElementById('borrowQuantity'),
    borrowRole: document.getElementById('borrowRole'),
    borrowerName: document.getElementById('borrowerName'),
    borrowerId: document.getElementById('borrowerId'),
    borrowerContact: document.getElementById('borrowerContact'),
    borrowDate: document.getElementById('borrowDate'),
    borrowExpectedReturn: document.getElementById('borrowExpectedReturn'),
    borrowPurpose: document.getElementById('borrowPurpose'),

    modalReturnBackdrop: document.getElementById('modalReturnBackdrop'),
    formReturn: document.getElementById('formReturn'),
    returnBorrowId: document.getElementById('returnBorrowId'),
    returnDetailBorrower: document.getElementById('returnDetailBorrower'),
    returnDetailItem: document.getElementById('returnDetailItem'),
    returnDetailQty: document.getElementById('returnDetailQty'),
    returnActualDate: document.getElementById('returnActualDate'),
    returnCondition: document.getElementById('returnCondition'),
    returnNotes: document.getElementById('returnNotes'),

    modalDeleteBackdrop: document.getElementById('modalDeleteBackdrop'),
    deleteModalTitle: document.getElementById('deleteModalTitle'),
    deleteModalMessage: document.getElementById('deleteModalMessage'),
    btnConfirmDelete: document.getElementById('btnConfirmDelete'),

    toastContainer: document.getElementById('toastContainer')
  };

  // =========================================================================
  // Initialization
  // =========================================================================

  function init() {
    loadData();
    setupHeaderDate();
    setupTabs();
    setupEvents();
    renderAll();
  }

  function loadData() {
    items = LabStorage.getItems();
    borrowings = LabStorage.getBorrowings();
  }

  function setupHeaderDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    elements.dateText.textContent = today.toLocaleDateString('id-ID', options);
  }

  // =========================================================================
  // Tab Navigation
  // =========================================================================

  function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  function switchTab(tabId) {
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (targetBtn) {
      targetBtn.click();
    }
  }

  // =========================================================================
  // Renderers & Calculations
  // =========================================================================

  function renderAll() {
    populateCategoryDropdown();
    populateQuickItemSelectors();
    renderStats();
    renderInventoryTable();
    renderActiveLoansTable();
    renderHistoryTable();
  }

  function populateQuickItemSelectors() {
    if (elements.quickItemSelect) {
      const currentModalVal = elements.quickItemSelect.value;
      elements.quickItemSelect.innerHTML = '<option value="">-- Pilih Barang untuk Dibaca/Diedit --</option>';
      items.forEach(it => {
        const opt = document.createElement('option');
        opt.value = it.id;
        opt.textContent = `${it.code} - ${it.name} (Tersedia: ${it.availableStock}/${it.totalStock})`;
        elements.quickItemSelect.appendChild(opt);
      });
      if (currentModalVal && items.some(it => it.id === currentModalVal)) {
        elements.quickItemSelect.value = currentModalVal;
      }
    }

    if (elements.pageQuickItemSelect) {
      const currentPageVal = elements.pageQuickItemSelect.value;
      elements.pageQuickItemSelect.innerHTML = '<option value="">-- Pilih Barang untuk Dibaca/Diedit --</option>';
      items.forEach(it => {
        const opt = document.createElement('option');
        opt.value = it.id;
        opt.textContent = `${it.code} - ${it.name} (Tersedia: ${it.availableStock}/${it.totalStock})`;
        elements.pageQuickItemSelect.appendChild(opt);
      });
      if (currentPageVal && items.some(it => it.id === currentPageVal)) {
        elements.pageQuickItemSelect.value = currentPageVal;
      }
    }
  }

  function renderStats() {
    const totalItems = items.length;
    const totalStock = items.reduce((sum, item) => sum + Number(item.totalStock || 0), 0);
    const activeBorrowings = borrowings.filter(b => b.status === 'Dipinjam');
    const borrowedStock = activeBorrowings.reduce((sum, b) => sum + Number(b.quantity || 0), 0);

    elements.statTotalItems.textContent = totalItems.toLocaleString('id-ID');
    elements.statTotalStock.textContent = totalStock.toLocaleString('id-ID');
    elements.statBorrowedStock.textContent = borrowedStock.toLocaleString('id-ID');
    elements.statActiveLoans.textContent = activeBorrowings.length.toLocaleString('id-ID');

    elements.badgeInventoryCount.textContent = totalItems;
    elements.badgeActiveCount.textContent = activeBorrowings.length;
    elements.badgeHistoryCount.textContent = borrowings.length;
  }

  function populateCategoryDropdown() {
    const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean))).sort();
    const currentVal = elements.filterCategory.value;

    elements.filterCategory.innerHTML = '<option value="all">Semua Kategori</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      elements.filterCategory.appendChild(opt);
    });

    if (categories.includes(currentVal)) {
      elements.filterCategory.value = currentVal;
    }
  }

  // --- Table 1: Inventory & Stock ---
  function renderInventoryTable() {
    const query = elements.searchItemInput.value.trim().toLowerCase();
    const catFilter = elements.filterCategory.value;
    const availFilter = elements.filterAvailability.value;

    const filtered = items.filter(item => {
      const matchText = (item.name || '').toLowerCase().includes(query) ||
                        (item.code || '').toLowerCase().includes(query) ||
                        (item.location || '').toLowerCase().includes(query) ||
                        (item.description || '').toLowerCase().includes(query);

      const matchCat = catFilter === 'all' || item.category === catFilter;
      const matchAvail = availFilter === 'all' ||
                         (availFilter === 'available' && item.availableStock > 0) ||
                         (availFilter === 'empty' && item.availableStock <= 0);

      return matchText && matchCat && matchAvail;
    });

    if (filtered.length === 0) {
      elements.inventoryTableBody.innerHTML = `
        <tr>
          <td colspan="9">
            <div class="empty-table-state">
              <div class="empty-table-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <p>Tidak ada alat atau barang ditemukan</p>
              <span>Ubah kata kunci pencarian atau tambah item baru.</span>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    elements.inventoryTableBody.innerHTML = filtered.map(item => {
      let stockBadgeClass = 'badge-success';
      let stockText = 'Tersedia';

      if (item.availableStock === 0) {
        stockBadgeClass = 'badge-danger';
        stockText = 'Habis';
      } else if (item.availableStock <= 2) {
        stockBadgeClass = 'badge-warning';
        stockText = 'Stok Tipis';
      }

      return `
        <tr>
          <td><span style="font-family: monospace; font-weight: 600; color: var(--text-muted);">${escapeHtml(item.code)}</span></td>
          <td>
            <div class="item-title">${escapeHtml(item.name)}</div>
            ${item.description ? `<div class="item-subtitle">${escapeHtml(item.description)}</div>` : ''}
          </td>
          <td><span class="badge badge-neutral">${escapeHtml(item.category || '-')}</span></td>
          <td>${escapeHtml(item.location || '-')}</td>
          <td style="text-align: center; font-weight: 500;">${item.totalStock}</td>
          <td style="text-align: center; font-weight: 600; color: ${item.availableStock > 0 ? 'var(--text-main)' : 'var(--danger)'};">
            ${item.availableStock}
          </td>
          <td>
            <span class="badge ${stockBadgeClass}">
              <span class="badge-dot"></span>
              ${stockText}
            </span>
          </td>
          <td>${escapeHtml(item.condition || 'Baik')}</td>
          <td style="text-align: right;">
            <div class="table-actions" style="justify-content: flex-end;">
              <button class="btn btn-secondary btn-sm" onclick="App.openBorrowModal('${item.id}')" title="Pinjam alat ini" ${item.availableStock <= 0 ? 'disabled' : ''}>
                Pinjam
              </button>
              <button class="btn btn-secondary btn-sm btn-icon-only" onclick="App.openEditItemModal('${item.id}')" title="Ubah data">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn btn-danger btn-sm btn-icon-only" onclick="App.confirmDeleteItem('${item.id}')" title="Hapus alat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- Table 2: Active Loans ---
  function renderActiveLoansTable() {
    const query = elements.searchActiveLoanInput.value.trim().toLowerCase();
    const active = borrowings.filter(b => b.status === 'Dipinjam');

    const filtered = active.filter(b => {
      return (b.borrowerName || '').toLowerCase().includes(query) ||
             (b.borrowerId || '').toLowerCase().includes(query) ||
             (b.itemName || '').toLowerCase().includes(query) ||
             (b.itemCode || '').toLowerCase().includes(query) ||
             (b.id || '').toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      elements.activeLoansTableBody.innerHTML = `
        <tr>
          <td colspan="9">
            <div class="empty-table-state">
              <div class="empty-table-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <p>Tidak ada peminjaman yang sedang aktif</p>
              <span>Semua alat telah dikembalikan atau belum ada transaksi baru.</span>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    elements.activeLoansTableBody.innerHTML = filtered.map(b => {
      const isOverdue = b.expectedReturnDate && b.expectedReturnDate < todayStr;

      return `
        <tr>
          <td><span style="font-family: monospace; font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(b.id)}</span></td>
          <td>
            <div class="item-title">${escapeHtml(b.borrowerName)}</div>
            <div class="item-subtitle">${escapeHtml(b.borrowerId || '-')} • ${escapeHtml(b.borrowerContact || '-')}</div>
          </td>
          <td><span class="badge badge-neutral">${escapeHtml(b.borrowerRole || 'Mahasiswa')}</span></td>
          <td>
            <div class="item-title">${escapeHtml(b.itemName)}</div>
            <div class="item-subtitle">Kode: ${escapeHtml(b.itemCode)}</div>
          </td>
          <td style="text-align: center; font-weight: 600;">${b.quantity}</td>
          <td>${formatDate(b.borrowDate)}</td>
          <td>
            <span style="${isOverdue ? 'color: var(--danger); font-weight: 600;' : ''}">
              ${formatDate(b.expectedReturnDate)}
            </span>
            ${isOverdue ? '<span class="badge badge-danger" style="margin-left: 0.25rem;">Terlambat</span>' : ''}
          </td>
          <td><span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(b.purpose || '-')}</span></td>
          <td style="text-align: right;">
            <div class="table-actions" style="justify-content: flex-end;">
              <button class="btn btn-primary btn-sm" onclick="App.openReturnModal('${b.id}')" title="Proses pengembalian alat">
                Kembalikan
              </button>
              <button class="btn btn-secondary btn-sm btn-icon-only" onclick="App.openEditBorrowModal('${b.id}')" title="Ubah data peminjaman">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- Table 3: Complete History ---
  function renderHistoryTable() {
    const query = elements.searchHistoryInput.value.trim().toLowerCase();
    const statusFilter = elements.filterHistoryStatus.value;

    const filtered = borrowings.filter(b => {
      const matchText = (b.borrowerName || '').toLowerCase().includes(query) ||
                        (b.borrowerId || '').toLowerCase().includes(query) ||
                        (b.itemName || '').toLowerCase().includes(query) ||
                        (b.itemCode || '').toLowerCase().includes(query) ||
                        (b.id || '').toLowerCase().includes(query) ||
                        (b.returnNotes || '').toLowerCase().includes(query);

      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchText && matchStatus;
    });

    if (filtered.length === 0) {
      elements.historyTableBody.innerHTML = `
        <tr>
          <td colspan="9">
            <div class="empty-table-state">
              <div class="empty-table-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                </svg>
              </div>
              <p>Tidak ada rekaman riwayat yang sesuai</p>
              <span>Ubah filter atau pencarian Anda.</span>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    elements.historyTableBody.innerHTML = filtered.map(b => {
      const isReturned = b.status === 'Dikembalikan';
      const statusBadge = isReturned 
        ? '<span class="badge badge-success"><span class="badge-dot"></span>Dikembalikan</span>'
        : '<span class="badge badge-info"><span class="badge-dot"></span>Sedang Dipinjam</span>';

      return `
        <tr>
          <td><span style="font-family: monospace; font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(b.id)}</span></td>
          <td>
            <div class="item-title">${escapeHtml(b.borrowerName)}</div>
            <div class="item-subtitle">${escapeHtml(b.borrowerId || '-')} • ${escapeHtml(b.borrowerRole || 'Mahasiswa')}</div>
          </td>
          <td>
            <div class="item-title">${escapeHtml(b.itemName)}</div>
            <div class="item-subtitle">Kode: ${escapeHtml(b.itemCode)}</div>
          </td>
          <td style="text-align: center; font-weight: 600;">${b.quantity}</td>
          <td>${formatDate(b.borrowDate)}</td>
          <td>
            ${isReturned ? formatDate(b.actualReturnDate) : `<span style="color: var(--text-muted);">Est: ${formatDate(b.expectedReturnDate)}</span>`}
          </td>
          <td>${statusBadge}</td>
          <td>
            <div style="font-size: 0.75rem; color: var(--text-main);">
              ${escapeHtml(b.returnNotes || b.purpose || '-')}
            </div>
            ${b.returnCondition ? `<div class="item-subtitle">Kondisi: ${escapeHtml(b.returnCondition)}</div>` : ''}
          </td>
          <td style="text-align: right;">
            <div class="table-actions" style="justify-content: flex-end;">
              <button class="btn btn-danger btn-sm btn-icon-only" onclick="App.confirmDeleteBorrowing('${b.id}')" title="Hapus rekaman riwayat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // =========================================================================
  // Modal Handlers & Form Actions
  // =========================================================================

  function setupEvents() {
    // Open Add Item Modal
    elements.btnOpenAddItem.addEventListener('click', () => {
      openAddItemModal();
    });

    // Open Add Borrow Modal
    elements.btnOpenAddBorrow.addEventListener('click', () => {
      openBorrowModal();
    });

    // Close Modals on click [data-close-modal] or backdrop
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => closeModal());
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeModal();
        }
      });
    });

    // Escape key to close modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    // Modal CRUD Mode Switcher & Selector
    if (elements.btnModeCreate) {
      elements.btnModeCreate.addEventListener('click', () => setModalCrudMode('create'));
    }
    if (elements.btnModeEdit) {
      elements.btnModeEdit.addEventListener('click', () => setModalCrudMode('edit'));
    }
    if (elements.quickItemSelect) {
      elements.quickItemSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          loadItemIntoModal(e.target.value);
        }
      });
    }

    // Modal CRUD Action Buttons
    if (elements.btnCrudReset) {
      elements.btnCrudReset.addEventListener('click', () => {
        setModalCrudMode('create');
        showToast('Formulir input telah dibersihkan.', 'info');
      });
    }
    if (elements.btnCrudRead) {
      elements.btnCrudRead.addEventListener('click', () => {
        handleCrudRead(elements.itemIdField.value, true);
      });
    }
    if (elements.btnCrudUpdate) {
      elements.btnCrudUpdate.addEventListener('click', (e) => {
        e.preventDefault();
        handleItemUpdate(elements.itemIdField.value, getModalFormData(), true);
      });
    }
    if (elements.btnCrudDelete) {
      elements.btnCrudDelete.addEventListener('click', () => {
        confirmDeleteItem(elements.itemIdField.value);
      });
    }

    // In-Page CRUD Workspace Mode Switcher & Selector
    if (elements.btnPageModeCreate) {
      elements.btnPageModeCreate.addEventListener('click', () => setPageCrudMode('create'));
    }
    if (elements.btnPageModeEdit) {
      elements.btnPageModeEdit.addEventListener('click', () => setPageCrudMode('edit'));
    }
    if (elements.pageQuickItemSelect) {
      elements.pageQuickItemSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          loadItemIntoPage(e.target.value);
        }
      });
    }

    // In-Page CRUD Action Buttons
    if (elements.btnPageCrudReset) {
      elements.btnPageCrudReset.addEventListener('click', () => {
        setPageCrudMode('create');
        showToast('Formulir telah dibersihkan.', 'info');
      });
    }
    if (elements.btnPageCrudRead) {
      elements.btnPageCrudRead.addEventListener('click', () => {
        handleCrudRead(elements.pageItemIdField.value, false);
      });
    }
    if (elements.btnPageCrudUpdate) {
      elements.btnPageCrudUpdate.addEventListener('click', (e) => {
        e.preventDefault();
        handleItemUpdate(elements.pageItemIdField.value, getPageFormData(), false);
      });
    }
    if (elements.btnPageCrudDelete) {
      elements.btnPageCrudDelete.addEventListener('click', () => {
        confirmDeleteItem(elements.pageItemIdField.value);
      });
    }
    if (elements.formPageItem) {
      elements.formPageItem.addEventListener('submit', (e) => {
        e.preventDefault();
        handleItemCreate(getPageFormData(), false);
      });
    }

    // Item Form Submit (Modal)
    elements.formItem.addEventListener('submit', handleItemFormSubmit);

    // Borrow Form Submit
    elements.formBorrow.addEventListener('submit', handleBorrowFormSubmit);

    // Borrow select change handler
    elements.borrowSelectProduct.addEventListener('change', updateBorrowModalStockIndicator);

    // Return Form Submit
    elements.formReturn.addEventListener('submit', handleReturnFormSubmit);

    // Confirm Delete Click
    elements.btnConfirmDelete.addEventListener('click', () => {
      if (typeof pendingDeleteAction === 'function') {
        pendingDeleteAction();
      }
      closeModal();
    });

    // Search & Filter listeners
    elements.searchItemInput.addEventListener('input', renderInventoryTable);
    elements.filterCategory.addEventListener('change', renderInventoryTable);
    elements.filterAvailability.addEventListener('change', renderInventoryTable);

    elements.searchActiveLoanInput.addEventListener('input', renderActiveLoansTable);
    elements.searchHistoryInput.addEventListener('input', renderHistoryTable);
    elements.filterHistoryStatus.addEventListener('change', renderHistoryTable);

    // Reset Data button
    elements.btnResetData.addEventListener('click', () => {
      openDeleteConfirmModal(
        'Reset Data Laboratorium',
        'Semua data perubahan lokal akan dikembalikan ke data awal bawaan sistem. Apakah Anda yakin?',
        () => {
          LabStorage.resetAll();
          loadData();
          renderAll();
          setPageCrudMode('create');
          showToast('Data sistem berhasil direset ke pengaturan awal.', 'info');
        }
      );
    });
  }

  function closeModal() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
    pendingDeleteAction = null;
  }

  // --- ITEM CRUD OPERATIONS ---

  function getModalFormData() {
    return {
      code: elements.itemCodeField.value.trim(),
      name: elements.itemNameField.value.trim(),
      category: elements.itemCategoryField.value.trim(),
      location: elements.itemLocationField.value.trim(),
      condition: elements.itemConditionField.value,
      totalStock: parseInt(elements.itemStockField.value, 10),
      description: elements.itemDescField.value.trim()
    };
  }

  function getPageFormData() {
    return {
      code: elements.pageItemCodeField.value.trim(),
      name: elements.pageItemNameField.value.trim(),
      category: elements.pageItemCategoryField.value.trim(),
      location: elements.pageItemLocationField.value.trim(),
      condition: elements.pageItemConditionField.value,
      totalStock: parseInt(elements.pageItemStockField.value, 10),
      description: elements.pageItemDescField.value.trim()
    };
  }

  function setModalCrudMode(mode, itemId) {
    if (mode === 'create') {
      elements.modalItemTitle.textContent = 'Tambah Alat / Barang Baru (Create)';
      if (elements.btnModeCreate) elements.btnModeCreate.classList.add('active');
      if (elements.btnModeEdit) elements.btnModeEdit.classList.remove('active');
      if (elements.quickItemSelectorWrapper) elements.quickItemSelectorWrapper.style.display = 'none';

      elements.itemIdField.value = '';
      elements.itemCodeField.value = '';
      elements.itemNameField.value = '';
      elements.itemCategoryField.value = '';
      elements.itemLocationField.value = '';
      elements.itemConditionField.value = 'Baik';
      elements.itemStockField.value = '';
      elements.itemDescField.value = '';
      elements.itemStockHelperText.textContent = 'Stok awal unit di laboratorium.';

      if (elements.crudStatusTag) {
        elements.crudStatusTag.textContent = '[MODE: CREATE]';
        elements.crudStatusTag.style.color = 'var(--accent)';
      }
      if (elements.crudStatusDesc) {
        elements.crudStatusDesc.textContent = 'Membuat data barang baru ke dalam katalog.';
      }
      if (elements.crudItemBadgeStatus) {
        elements.crudItemBadgeStatus.className = 'badge badge-neutral';
        elements.crudItemBadgeStatus.textContent = 'Baru';
      }

      if (elements.btnCrudDelete) elements.btnCrudDelete.style.display = 'none';
      if (elements.btnCrudUpdate) elements.btnCrudUpdate.style.display = 'none';
      if (elements.btnCrudCreate) {
        elements.btnCrudCreate.style.display = 'inline-flex';
        elements.btnCrudCreate.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Simpan Baru (Create)
        `;
      }
    } else {
      elements.modalItemTitle.textContent = 'Kelola / Edit Data Alat & Barang';
      if (elements.btnModeCreate) elements.btnModeCreate.classList.remove('active');
      if (elements.btnModeEdit) elements.btnModeEdit.classList.add('active');
      if (elements.quickItemSelectorWrapper) elements.quickItemSelectorWrapper.style.display = 'block';

      if (itemId) {
        if (elements.quickItemSelect) elements.quickItemSelect.value = itemId;
        loadItemIntoModal(itemId);
      } else if (elements.quickItemSelect && elements.quickItemSelect.value) {
        loadItemIntoModal(elements.quickItemSelect.value);
      } else if (items.length > 0) {
        if (elements.quickItemSelect) elements.quickItemSelect.value = items[0].id;
        loadItemIntoModal(items[0].id);
      }
    }
  }

  function loadItemIntoModal(itemId) {
    const item = items.find(it => it.id === itemId);
    if (!item) return;

    elements.itemIdField.value = item.id;
    elements.itemCodeField.value = item.code;
    elements.itemNameField.value = item.name;
    elements.itemCategoryField.value = item.category || '';
    elements.itemLocationField.value = item.location || '';
    elements.itemConditionField.value = item.condition || 'Baik';
    elements.itemStockField.value = item.totalStock;
    elements.itemDescField.value = item.description || '';

    const borrowedCount = item.totalStock - item.availableStock;
    elements.itemStockHelperText.textContent = borrowedCount > 0
      ? `Saat ini ${borrowedCount} unit sedang dipinjam. Stok tidak boleh kurang dari ${borrowedCount}.`
      : 'Ubah total unit yang dimiliki lab.';

    if (elements.crudStatusTag) {
      elements.crudStatusTag.textContent = '[MODE: UPDATE / DELETE]';
      elements.crudStatusTag.style.color = 'var(--warning)';
    }
    if (elements.crudStatusDesc) {
      elements.crudStatusDesc.textContent = `Sedang mengelola: ${item.code} - ${item.name}`;
    }

    let badgeClass = 'badge-success';
    let badgeText = `${item.availableStock} Unit Tersedia`;
    if (item.availableStock === 0) {
      badgeClass = 'badge-danger';
      badgeText = 'Stok Habis';
    } else if (item.availableStock <= 2) {
      badgeClass = 'badge-warning';
      badgeText = 'Stok Tipis';
    }

    if (elements.crudItemBadgeStatus) {
      elements.crudItemBadgeStatus.className = `badge ${badgeClass}`;
      elements.crudItemBadgeStatus.textContent = badgeText;
    }

    if (elements.btnCrudDelete) elements.btnCrudDelete.style.display = 'inline-flex';
    if (elements.btnCrudUpdate) elements.btnCrudUpdate.style.display = 'inline-flex';
    if (elements.btnCrudCreate) {
      elements.btnCrudCreate.style.display = 'inline-flex';
      elements.btnCrudCreate.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Simpan Sebagai Baru (Clone)
      `;
    }
  }

  function setPageCrudMode(mode, itemId) {
    if (mode === 'create') {
      if (elements.btnPageModeCreate) elements.btnPageModeCreate.classList.add('active');
      if (elements.btnPageModeEdit) elements.btnPageModeEdit.classList.remove('active');
      if (elements.pageQuickItemWrapper) elements.pageQuickItemWrapper.style.display = 'none';

      if (elements.pageItemIdField) elements.pageItemIdField.value = '';
      if (elements.pageItemCodeField) elements.pageItemCodeField.value = '';
      if (elements.pageItemNameField) elements.pageItemNameField.value = '';
      if (elements.pageItemCategoryField) elements.pageItemCategoryField.value = '';
      if (elements.pageItemLocationField) elements.pageItemLocationField.value = '';
      if (elements.pageItemConditionField) elements.pageItemConditionField.value = 'Baik';
      if (elements.pageItemStockField) elements.pageItemStockField.value = '';
      if (elements.pageItemDescField) elements.pageItemDescField.value = '';
      if (elements.pageItemStockHelperText) elements.pageItemStockHelperText.textContent = 'Stok awal unit di laboratorium.';

      if (elements.pageCrudStatusTag) {
        elements.pageCrudStatusTag.textContent = '[MODE: CREATE]';
        elements.pageCrudStatusTag.style.color = 'var(--accent)';
      }
      if (elements.pageCrudStatusDesc) {
        elements.pageCrudStatusDesc.textContent = 'Siap menambahkan alat atau barang baru ke katalog.';
      }
      if (elements.pageCrudItemBadge) {
        elements.pageCrudItemBadge.className = 'badge badge-neutral';
        elements.pageCrudItemBadge.textContent = 'Baru';
      }

      if (elements.btnPageCrudDelete) elements.btnPageCrudDelete.style.display = 'none';
      if (elements.btnPageCrudUpdate) elements.btnPageCrudUpdate.style.display = 'none';
      if (elements.btnPageCrudCreate) {
        elements.btnPageCrudCreate.style.display = 'inline-flex';
        elements.btnPageCrudCreate.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Simpan Baru (Create)
        `;
      }
    } else {
      if (elements.btnPageModeCreate) elements.btnPageModeCreate.classList.remove('active');
      if (elements.btnPageModeEdit) elements.btnPageModeEdit.classList.add('active');
      if (elements.pageQuickItemWrapper) elements.pageQuickItemWrapper.style.display = 'block';

      if (itemId) {
        if (elements.pageQuickItemSelect) elements.pageQuickItemSelect.value = itemId;
        loadItemIntoPage(itemId);
      } else if (elements.pageQuickItemSelect && elements.pageQuickItemSelect.value) {
        loadItemIntoPage(elements.pageQuickItemSelect.value);
      } else if (items.length > 0) {
        if (elements.pageQuickItemSelect) elements.pageQuickItemSelect.value = items[0].id;
        loadItemIntoPage(items[0].id);
      }
    }
  }

  function loadItemIntoPage(itemId) {
    const item = items.find(it => it.id === itemId);
    if (!item) return;

    if (elements.pageItemIdField) elements.pageItemIdField.value = item.id;
    if (elements.pageItemCodeField) elements.pageItemCodeField.value = item.code;
    if (elements.pageItemNameField) elements.pageItemNameField.value = item.name;
    if (elements.pageItemCategoryField) elements.pageItemCategoryField.value = item.category || '';
    if (elements.pageItemLocationField) elements.pageItemLocationField.value = item.location || '';
    if (elements.pageItemConditionField) elements.pageItemConditionField.value = item.condition || 'Baik';
    if (elements.pageItemStockField) elements.pageItemStockField.value = item.totalStock;
    if (elements.pageItemDescField) elements.pageItemDescField.value = item.description || '';

    const borrowedCount = item.totalStock - item.availableStock;
    if (elements.pageItemStockHelperText) {
      elements.pageItemStockHelperText.textContent = borrowedCount > 0
        ? `Saat ini ${borrowedCount} unit sedang dipinjam. Stok tidak boleh kurang dari ${borrowedCount}.`
        : 'Ubah total unit yang dimiliki lab.';
    }

    if (elements.pageCrudStatusTag) {
      elements.pageCrudStatusTag.textContent = '[MODE: UPDATE / DELETE]';
      elements.pageCrudStatusTag.style.color = 'var(--warning)';
    }
    if (elements.pageCrudStatusDesc) {
      elements.pageCrudStatusDesc.textContent = `Sedang mengelola: ${item.code} - ${item.name}`;
    }

    let badgeClass = 'badge-success';
    let badgeText = `${item.availableStock} Unit Tersedia`;
    if (item.availableStock === 0) {
      badgeClass = 'badge-danger';
      badgeText = 'Stok Habis';
    } else if (item.availableStock <= 2) {
      badgeClass = 'badge-warning';
      badgeText = 'Stok Tipis';
    }

    if (elements.pageCrudItemBadge) {
      elements.pageCrudItemBadge.className = `badge ${badgeClass}`;
      elements.pageCrudItemBadge.textContent = badgeText;
    }

    if (elements.btnPageCrudDelete) elements.btnPageCrudDelete.style.display = 'inline-flex';
    if (elements.btnPageCrudUpdate) elements.btnPageCrudUpdate.style.display = 'inline-flex';
    if (elements.btnPageCrudCreate) {
      elements.btnPageCrudCreate.style.display = 'inline-flex';
      elements.btnPageCrudCreate.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Simpan Sebagai Baru (Clone)
      `;
    }
  }

  function handleCrudRead(itemId, isModal) {
    if (isModal) {
      closeModal();
    }
    switchTab('tab-inventory');

    const item = items.find(it => it.id === itemId);
    if (item) {
      elements.searchItemInput.value = item.code;
      renderInventoryTable();
      showToast(`[Read] Menampilkan alat "${item.name}" di tabel inventaris.`, 'info');
    } else {
      elements.searchItemInput.value = '';
      renderInventoryTable();
      showToast('[Read] Menampilkan seluruh katalog alat & barang di tabel inventaris.', 'info');
    }
  }

  function handleItemCreate(formData, isModal) {
    const { code, name, category, location, condition, totalStock, description } = formData;

    if (!code || !name || isNaN(totalStock) || totalStock < 1) {
      showToast('Mohon isi semua data wajib dengan benar.', 'danger');
      return;
    }

    // Check duplicate code
    if (items.some(it => it.code.toLowerCase() === code.toLowerCase())) {
      showToast(`Peringatan: Kode barang "${code}" sudah digunakan. Gunakan kode yang unik.`, 'warning');
    }

    const newItemId = 'ITM-' + Date.now().toString().slice(-6);
    const newItem = {
      id: newItemId,
      code,
      name,
      category: category || 'Umum',
      location: location || 'Rak Umum',
      totalStock,
      availableStock: totalStock,
      condition: condition || 'Baik',
      description: description || ''
    };

    items.push(newItem);
    LabStorage.setItems(items);
    renderAll();

    showToast(`[Create] Alat baru "${name}" (${code}) berhasil disimpan ke katalog.`, 'success');

    if (isModal) {
      closeModal();
    } else {
      setPageCrudMode('create');
    }
  }

  function handleItemUpdate(itemId, formData, isModal) {
    if (!itemId) {
      // If no ID, fallback to create
      handleItemCreate(formData, isModal);
      return;
    }

    const { code, name, category, location, condition, totalStock, description } = formData;

    if (!code || !name || isNaN(totalStock) || totalStock < 1) {
      showToast('Mohon isi semua data wajib dengan benar.', 'danger');
      return;
    }

    const index = items.findIndex(it => it.id === itemId);
    if (index === -1) {
      showToast('Data alat tidak ditemukan.', 'danger');
      return;
    }

    const currentItem = items[index];
    const currentlyBorrowed = currentItem.totalStock - currentItem.availableStock;

    if (totalStock < currentlyBorrowed) {
      showToast(`Total stok tidak boleh kurang dari jumlah yang sedang dipinjam (${currentlyBorrowed} unit).`, 'danger');
      return;
    }

    const newAvailableStock = totalStock - currentlyBorrowed;

    items[index] = {
      ...currentItem,
      code,
      name,
      category,
      location,
      condition,
      totalStock,
      availableStock: newAvailableStock,
      description
    };

    // Update active borrowings metadata
    borrowings.forEach(b => {
      if (b.itemId === itemId) {
        b.itemName = name;
        b.itemCode = code;
      }
    });
    LabStorage.setBorrowings(borrowings);
    LabStorage.setItems(items);
    renderAll();

    showToast(`[Update] Data alat "${name}" berhasil diperbarui.`, 'success');

    if (isModal) {
      closeModal();
    } else {
      loadItemIntoPage(itemId);
    }
  }

  function openAddItemModal() {
    setModalCrudMode('create');
    elements.modalItemBackdrop.classList.add('open');
    elements.itemCodeField.focus();
  }

  function openEditItemModal(itemId) {
    setModalCrudMode('edit', itemId);
    elements.modalItemBackdrop.classList.add('open');
    elements.itemNameField.focus();
  }

  function handleItemFormSubmit(e) {
    e.preventDefault();
    const id = elements.itemIdField.value;
    const formData = getModalFormData();

    if (id) {
      handleItemUpdate(id, formData, true);
    } else {
      handleItemCreate(formData, true);
    }
  }

  function confirmDeleteItem(itemId) {
    if (!itemId) {
      showToast('Pilih alat/barang terlebih dahulu yang ingin dihapus.', 'danger');
      return;
    }

    const item = items.find(it => it.id === itemId);
    if (!item) return;

    // Check if actively borrowed
    const hasActiveBorrowing = borrowings.some(b => b.itemId === itemId && b.status === 'Dipinjam');
    if (hasActiveBorrowing) {
      showToast(`Alat "${item.name}" tidak dapat dihapus karena masih ada unit yang sedang dipinjam.`, 'danger');
      return;
    }

    openDeleteConfirmModal(
      'Hapus Alat / Barang (Delete)',
      `Apakah Anda yakin ingin menghapus "${item.name}" (${item.code}) dari katalog laboratorium? Tindakan ini permanen.`,
      () => {
        items = items.filter(it => it.id !== itemId);
        LabStorage.setItems(items);
        renderAll();
        setPageCrudMode('create');
        if (elements.modalItemBackdrop.classList.contains('open')) {
          closeModal();
        }
        showToast(`[Delete] Alat "${item.name}" berhasil dihapus dari sistem.`, 'info');
      }
    );
  }

  // --- BORROWING CRUD ---

  function openBorrowModal(preselectedItemId) {
    elements.borrowTitle.textContent = 'Peminjaman Alat Baru';
    elements.borrowIdField.value = '';

    // Populate item select
    elements.borrowSelectProduct.innerHTML = '<option value="">-- Pilih Alat / Barang --</option>';
    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = `${item.name} (${item.code}) - Sisa Stok: ${item.availableStock}`;
      if (item.availableStock <= 0) {
        option.disabled = true;
      }
      elements.borrowSelectProduct.appendChild(option);
    });

    if (preselectedItemId) {
      elements.borrowSelectProduct.value = preselectedItemId;
    }

    updateBorrowModalStockIndicator();

    // Default dates
    const today = new Date();
    const nextThreeDays = new Date();
    nextThreeDays.setDate(today.getDate() + 3);

    elements.borrowQuantity.value = 1;
    elements.borrowerName.value = '';
    elements.borrowerId.value = '';
    elements.borrowerContact.value = '';
    elements.borrowDate.value = today.toISOString().split('T')[0];
    elements.borrowExpectedReturn.value = nextThreeDays.toISOString().split('T')[0];
    elements.borrowPurpose.value = '';

    // Unlock item picker
    elements.borrowSelectProduct.disabled = false;

    elements.modalBorrowBackdrop.classList.add('open');
    elements.borrowSelectProduct.focus();
  }

  function openEditBorrowModal(borrowId) {
    const borrow = borrowings.find(b => b.id === borrowId);
    if (!borrow) return;

    elements.borrowTitle.textContent = 'Edit Data Peminjaman';
    elements.borrowIdField.value = borrow.id;

    // Populate item select with current item selected (locked in edit mode to avoid stock inconsistency)
    elements.borrowSelectProduct.innerHTML = `<option value="${borrow.itemId}">${borrow.itemName} (${borrow.itemCode})</option>`;
    elements.borrowSelectProduct.value = borrow.itemId;
    elements.borrowSelectProduct.disabled = true;

    elements.borrowStockIndicator.style.display = 'none';

    elements.borrowQuantity.value = borrow.quantity;
    elements.borrowQuantity.disabled = true; // prevent changing quantity in simple edit

    elements.borrowRole.value = borrow.borrowerRole || 'Mahasiswa';
    elements.borrowerName.value = borrow.borrowerName || '';
    elements.borrowerId.value = borrow.borrowerId || '';
    elements.borrowerContact.value = borrow.borrowerContact || '';
    elements.borrowDate.value = borrow.borrowDate || '';
    elements.borrowExpectedReturn.value = borrow.expectedReturnDate || '';
    elements.borrowPurpose.value = borrow.purpose || '';

    elements.modalBorrowBackdrop.classList.add('open');
    elements.borrowerName.focus();
  }

  function updateBorrowModalStockIndicator() {
    const selectedId = elements.borrowSelectProduct.value;
    const item = items.find(it => it.id === selectedId);

    if (item) {
      elements.borrowStockIndicator.style.display = 'flex';
      elements.borrowAvailableCount.textContent = `${item.availableStock} Unit`;
      elements.borrowQuantity.max = item.availableStock;
      if (parseInt(elements.borrowQuantity.value, 10) > item.availableStock) {
        elements.borrowQuantity.value = Math.max(1, item.availableStock);
      }
    } else {
      elements.borrowStockIndicator.style.display = 'none';
      elements.borrowQuantity.removeAttribute('max');
    }
  }

  function handleBorrowFormSubmit(e) {
    e.preventDefault();

    const borrowId = elements.borrowIdField.value;
    const borrowerName = elements.borrowerName.value.trim();
    const borrowerId = elements.borrowerId.value.trim();
    const borrowerRole = elements.borrowRole.value;
    const borrowerContact = elements.borrowerContact.value.trim();
    const borrowDate = elements.borrowDate.value;
    const expectedReturnDate = elements.borrowExpectedReturn.value;
    const purpose = elements.borrowPurpose.value.trim();

    if (!borrowerName || !borrowDate || !expectedReturnDate) {
      showToast('Mohon lengkapi formulir peminjaman.', 'danger');
      return;
    }

    if (borrowId) {
      // Edit existing transaction
      const idx = borrowings.findIndex(b => b.id === borrowId);
      if (idx === -1) return;

      borrowings[idx] = {
        ...borrowings[idx],
        borrowerName,
        borrowerId,
        borrowerRole,
        borrowerContact,
        borrowDate,
        expectedReturnDate,
        purpose
      };

      LabStorage.setBorrowings(borrowings);
      showToast('Data peminjaman berhasil diperbarui.', 'success');
    } else {
      // Create new borrowing
      const itemId = elements.borrowSelectProduct.value;
      const quantity = parseInt(elements.borrowQuantity.value, 10);

      const item = items.find(it => it.id === itemId);
      if (!item) {
        showToast('Pilih alat/barang yang valid.', 'danger');
        return;
      }

      if (quantity <= 0 || quantity > item.availableStock) {
        showToast(`Jumlah pinjam tidak valid. Maksimal tersedia: ${item.availableStock} unit.`, 'danger');
        return;
      }

      // Decrement item stock
      item.availableStock -= quantity;
      LabStorage.setItems(items);

      // Create record
      const year = new Date().getFullYear();
      const newBorrowId = `PINJAM-${year}-${(borrowings.length + 1).toString().padStart(3, '0')}`;
      const newRecord = {
        id: newBorrowId,
        itemId: item.id,
        itemName: item.name,
        itemCode: item.code,
        borrowerName,
        borrowerId,
        borrowerRole,
        borrowerContact,
        quantity,
        borrowDate,
        expectedReturnDate,
        actualReturnDate: null,
        purpose,
        status: 'Dipinjam',
        returnNotes: ''
      };

      borrowings.unshift(newRecord);
      LabStorage.setBorrowings(borrowings);

      showToast(`Peminjaman ${item.name} (${quantity} unit) berhasil dicatat.`, 'success');
      switchTab('tab-active-loans');
    }

    closeModal();
    renderAll();
  }

  // --- RETURN PROCESS ---

  function openReturnModal(borrowId) {
    const borrow = borrowings.find(b => b.id === borrowId);
    if (!borrow) return;

    elements.returnBorrowId.value = borrow.id;
    elements.returnDetailBorrower.textContent = `${borrow.borrowerName} (${borrow.borrowerId || '-'})`;
    elements.returnDetailItem.textContent = `${borrow.itemName} [${borrow.itemCode}]`;
    elements.returnDetailQty.textContent = `${borrow.quantity} Unit`;

    elements.returnActualDate.value = new Date().toISOString().split('T')[0];
    elements.returnCondition.value = 'Lengkap & Baik';
    elements.returnNotes.value = '';

    elements.modalReturnBackdrop.classList.add('open');
  }

  function handleReturnFormSubmit(e) {
    e.preventDefault();

    const borrowId = elements.returnBorrowId.value;
    const actualReturnDate = elements.returnActualDate.value;
    const condition = elements.returnCondition.value;
    const notes = elements.returnNotes.value.trim();

    const borrow = borrowings.find(b => b.id === borrowId);
    if (!borrow) return;

    // Update borrowing record
    borrow.status = 'Dikembalikan';
    borrow.actualReturnDate = actualReturnDate;
    borrow.returnCondition = condition;
    borrow.returnNotes = notes ? `[${condition}] ${notes}` : `[${condition}] Dikembalikan`;

    // Restore stock to inventory item
    const item = items.find(it => it.id === borrow.itemId);
    if (item) {
      item.availableStock = Math.min(item.totalStock, item.availableStock + borrow.quantity);
      LabStorage.setItems(items);
    }

    LabStorage.setBorrowings(borrowings);
    showToast(`Pengembalian ${borrow.itemName} telah selesai dicatat. Stok kembali bertambah.`, 'success');

    closeModal();
    renderAll();
  }

  function confirmDeleteBorrowing(borrowId) {
    const borrow = borrowings.find(b => b.id === borrowId);
    if (!borrow) return;

    const isActive = borrow.status === 'Dipinjam';
    const message = isActive
      ? `Transaksi ${borrow.id} masih AKTIF. Menghapus rekaman ini akan mengembalikan ${borrow.quantity} unit ke stok barang "${borrow.itemName}". Lanjutkan?`
      : `Hapus catatan riwayat transaksi ${borrow.id} (${borrow.borrowerName})?`;

    openDeleteConfirmModal('Hapus Riwayat Peminjaman', message, () => {
      if (isActive) {
        const item = items.find(it => it.id === borrow.itemId);
        if (item) {
          item.availableStock = Math.min(item.totalStock, item.availableStock + borrow.quantity);
          LabStorage.setItems(items);
        }
      }

      borrowings = borrowings.filter(b => b.id !== borrowId);
      LabStorage.setBorrowings(borrowings);
      showToast('Rekaman transaksi berhasil dihapus.', 'info');
      renderAll();
    });
  }

  function openDeleteConfirmModal(title, message, onConfirm) {
    elements.deleteModalTitle.textContent = title;
    elements.deleteModalMessage.textContent = message;
    pendingDeleteAction = onConfirm;
    elements.modalDeleteBackdrop.classList.add('open');
  }

  // =========================================================================
  // Toast Notifications
  // =========================================================================

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--success); flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'danger') {
      iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--danger); flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        ${iconSvg}
        <span class="toast-message">${escapeHtml(message)}</span>
      </div>
      <button class="toast-close" aria-label="Tutup notifikasi">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.remove();
    });

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 200ms ease';
        setTimeout(() => toast.remove(), 200);
      }
    }, 4000);
  }

  // =========================================================================
  // Utility Helpers
  // =========================================================================

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Public API attached to window for HTML inline calls
  window.App = {
    openAddItemModal,
    openEditItemModal,
    confirmDeleteItem,
    openBorrowModal,
    openEditBorrowModal,
    openReturnModal,
    confirmDeleteBorrowing
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

