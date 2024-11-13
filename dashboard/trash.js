document.addEventListener('DOMContentLoaded', function() {
            const trashItems = document.getElementById('trash-items');
            const searchInput = document.getElementById('search-input');
            const restoreBtn = document.getElementById('restore-btn');
            const deleteBtn = document.getElementById('delete-btn');
            const selectAllCheckbox = document.getElementById('select-all');

            let items = [
                { id: 1, name: 'documento.pdf', type: 'file', deletedAt: '2024-03-10', size: '2.5 MB' },
                { id: 2, name: 'imagen.jpg', type: 'file', deletedAt: '2024-03-09', size: '1.8 MB' },
                { id: 3, name: 'Proyecto Antiguo', type: 'folder', deletedAt: '2024-03-08', size: '15 MB' },
                { id: 4, name: 'presentacion.pptx', type: 'file', deletedAt: '2024-03-07', size: '5.2 MB' },
            ];

            function renderItems() {
                trashItems.innerHTML = '';
                items.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap">
                            <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" data-id="${item.id}">
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <i class="fas ${item.type === 'file' ? 'fa-file' : 'fa-folder'} text-gray-400 mr-2"></i>
                                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">${item.name}</div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-500 dark:text-gray-400">${item.type}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-500 dark:text-gray-400">${item.deletedAt}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            ${item.size}
                        </td>
                    `;
                    trashItems.appendChild(row);
                });
            }

            function filterItems(searchTerm) {
                return items.filter(item => 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.type.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            searchInput.addEventListener('input', function() {
                const filteredItems = filterItems(this.value);
                items = filteredItems;
                renderItems();
            });

            selectAllCheckbox.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('#trash-items input[type="checkbox"]');
                checkboxes.forEach(checkbox => checkbox.checked = this.checked);
            });

            restoreBtn.addEventListener('click', function() {
                const selectedIds = getSelectedIds();
                if (selectedIds.length === 0) {
                    showNotification('Por favor, seleccione los elementos que desea restaurar.', 'warning');
                    return;
                }
                showConfirmDialog('¿Está seguro de que desea restaurar los elementos seleccionados?', () => {
                    items = items.filter(item => !selectedIds.includes(item.id));
                    renderItems();
                    showNotification('Elementos restaurados con éxito.', 'success');
                });
            });

            deleteBtn.addEventListener('click', function() {
                const selectedIds = getSelectedIds();
                if (selectedIds.length === 0) {
                    showNotification('Por favor, seleccione los elementos que desea eliminar permanentemente.', 'warning');
                    return;
                }
                showConfirmDialog('¿Está seguro de que desea eliminar permanentemente los elementos seleccionados? Esta acción no se puede deshacer.', () => {
                    items = items.filter(item => !selectedIds.includes(item.id));
                    renderItems();
                    showNotification('Elementos eliminados permanentemente.', 'success');
                });
            });

            function getSelectedIds() {
                const checkboxes = document.querySelectorAll('#trash-items input[type="checkbox"]:checked');
                return Array.from(checkboxes).map(checkbox => parseInt(checkbox.dataset.id));
            }

            function showNotification(message, icon) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: icon,
                    title: message,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            }

            function showConfirmDialog(message, confirmCallback) {
                Swal.fire({
                    title: '¿Está seguro?',
                    text: message,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, continuar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        confirmCallback();
                    }
                });
            }

            renderItems();
});