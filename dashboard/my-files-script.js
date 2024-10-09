/*
██████╗░░█████╗░██╗░░░██╗██╗██████╗░  ░█████╗░██████╗░███████╗░█████╗░████████╗
██╔══██╗██╔══██╗██║░░░██║██║██╔══██╗  ██╔══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝
██║░░██║███████║╚██╗░██╔╝██║██║░░██║  ██║░░╚═╝██████╔╝█████╗░░███████║░░░██║░░░
██║░░██║██╔══██║░╚████╔╝░██║██║░░██║  ██║░░██╗██╔══██╗██╔══╝░░██╔══██║░░░██║░░░
██████╔╝██║░░██║░░╚██╔╝░░██║██████╔╝  ╚█████╔╝██║░░██║███████╗██║░░██║░░░██║░░░
╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚═╝╚═════╝░  ░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝░░░╚═╝░░░
David Fonseca "DavidCreat" https://github.com/DavidCreat
  Copyright © 2024 David Fonseca "DavidCreat"
  Todos los derechos reservados.
  Este script está protegido por derechos de autor y no puede ser copiado, modificado ni distribuido sin permiso del autor.
  https://github.com/DavidCreat
*/

document.addEventListener('DOMContentLoaded', function() {
    const fileGrid = document.getElementById('file-grid');
    const createFolderBtn = document.getElementById('create-folder-btn');
    const uploadFileBtn = document.getElementById('upload-file-btn');
    const fileUploadInput = document.getElementById('file-upload-input');
    const filePreviewModal = document.getElementById('file-preview-modal');
    const filePreviewContent = document.getElementById('file-preview-content');
    const closePreviewModal = document.getElementById('close-preview-modal');
    const currentFolderElement = document.getElementById('current-folder');

    let currentPath = [];
    let files = [
        { type: 'folder', name: 'Documentos', color: 'bg-blue-500' },
        { type: 'folder', name: 'Imágenes', color: 'bg-green-500' },
        { type: 'folder', name: 'Vídeos', color: 'bg-red-500' },
        { type: 'file', name: 'informe.pdf', extension: 'pdf' },
        { type: 'file', name: 'foto.jpg', extension: 'jpg' },
        { type: 'file', name: 'presentacion.pptx', extension: 'pptx' },
    ];

    function renderFiles() {
        fileGrid.innerHTML = '';
        files.forEach((item, index) => {
            const element = document.createElement('div');
            element.className = `${item.type}-item p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center cursor-pointer`;

            if (item.type === 'folder') {
                element.innerHTML = `
                    <div class="w-16 h-16 ${item.color} rounded-lg flex items-center justify-center mb-2">
                        <i class="fas fa-folder text-white text-3xl"></i>
                    </div>
                    <p class="text-center font-medium truncate w-full">${item.name}</p>
                `;
                element.addEventListener('click', () => openFolder(item.name));
            } else {
                element.innerHTML = `
                    <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                        <i class="fas ${getFileIcon(item.extension)} text-gray-500 dark:text-gray-400 text-3xl"></i>
                    </div>
                    <p class="text-center font-medium truncate w-full">${item.name}</p>
                `;
                element.addEventListener('click', () => previewFile(item));
            }

            const actionsMenu = createActionsMenu(item, index);
            element.appendChild(actionsMenu);

            fileGrid.appendChild(element);
        });
    }

    function createActionsMenu(item, index) {
        const menu = document.createElement('div');
        menu.className = 'absolute top-2 right-2 hidden group-hover:block';
        menu.innerHTML = `
            <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <i class="fas fa-ellipsis-v"></i>
            </button>
        `;

        const dropdown = document.createElement('div');
        dropdown.className = 'absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 hidden';
        dropdown.innerHTML = `
            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <a href="#" class="rename-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-600" role="menuitem">Renombrar</a>
                <a href="#" class="delete-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-600" role="menuitem">Eliminar</a>
            </div>
        `;

        menu.appendChild(dropdown);

        menu.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        menu.querySelector('.rename-item').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            renameItem(item, index);
        });

        menu.querySelector('.delete-item').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteItem(index);
        });

        return menu;
    }

    function getFileIcon(extension) {
        const icons = {
            pdf: 'fa-file-pdf',
            doc: 'fa-file-word',
            docx: 'fa-file-word',
            xls: 'fa-file-excel',
            xlsx: 'fa-file-excel',
            ppt: 'fa-file-powerpoint',
            pptx: 'fa-file-powerpoint',
            jpg: 'fa-file-image',
            jpeg: 'fa-file-image',
            png: 'fa-file-image',
            gif: 'fa-file-image',
            mp4: 'fa-file-video',
            avi: 'fa-file-video',
            mp3: 'fa-file-audio',
            wav: 'fa-file-audio',
        };
        return icons[extension.toLowerCase()] || 'fa-file';
    }

    function openFolder(folderName) {
        currentPath.push(folderName);
        updateBreadcrumb();
        // Aquí simularíamos la carga de archivos de la carpeta
        // Por ahora, solo mostraremos una notificación
        showNotification(`Abriendo carpeta: ${folderName}`, 'info');
    }

    function updateBreadcrumb() {
        let breadcrumbHTML = `
            <div class="flex items-center">
                <svg class="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                </svg>
                <a href="#" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">Mis Archivos</a>
            </div>
        `;

        currentPath.forEach((folder, index) => {
            breadcrumbHTML += `
                <div class="flex items-center">
                    <svg class="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <a href="#" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white" data-index="${index}">${folder}</a>
                </div>
            `;
        });

        currentFolderElement.innerHTML = breadcrumbHTML;

        // Add click event listeners to breadcrumb items
        currentFolderElement.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const index = e.target.dataset.index;
                if (index !== undefined) {
                    currentPath = currentPath.slice(0, parseInt(index) + 1);
                    updateBreadcrumb();
                    // Here you would typically load the contents of the selected folder
                    showNotification(`Navegando a: ${currentPath.join('/')}`, 'info');
                } else {
                    currentPath = [];
                    updateBreadcrumb();
                    // Here you would typically load the root folder contents
                    showNotification('Navegando a la raíz', 'info');
                }
            });
        });
    }

    function previewFile(file) {
        filePreviewContent.innerHTML = '';
        const extension = file.extension.toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            const img = document.createElement('img');
            img.src = `path/to/your/files/${file.name}`; // Replace with actual path
            img.alt = file.name;
            filePreviewContent.appendChild(img);
        } else if (['mp4', 'webm'].includes(extension)) {
            const video = document.createElement('video');
            video.src = `path/to/your/files/${file.name}`; // Replace with actual path
            video.controls = true;
            filePreviewContent.appendChild(video);
        } else if (extension === 'pdf') {
            const iframe = document.createElement('iframe');
            iframe.src = `path/to/your/files/${file.name}`; // Replace with actual path
            filePreviewContent.appendChild(iframe);
        } else {
            filePreviewContent.textContent = `No preview available for ${file.name}`;
        }

        filePreviewModal.classList.remove('hidden');
    }

    closePreviewModal.addEventListener('click', () => {
        filePreviewModal.classList.add('hidden');
    });

    createFolderBtn.addEventListener('click', createFolder);
    uploadFileBtn.addEventListener('click', () => fileUploadInput.click());
    fileUploadInput.addEventListener('change', handleFileUpload);

    function createFolder() {
        Swal.fire({
            title: 'Crear nueva carpeta',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Crear',
            showLoaderOnConfirm: true,
            preConfirm: (folderName) => {
                if (!folderName) {
                    Swal.showValidationMessage('Por favor, ingrese un nombre para la carpeta');
                } else {
                    // Aquí agregaríamos la lógica para crear la carpeta
                    files.push({ type: 'folder', name: folderName, color: getRandomColor() });
                    renderFiles();
                    showNotification(`Carpeta "${folderName}" creada con éxito`, 'success');
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });
    }

    function handleFileUpload(event) {
        const uploadedFiles = event.target.files;
        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            const extension = file.name.split('.').pop();
            files.push({ type: 'file', name: file.name, extension: extension });
        }
        renderFiles();
        showNotification(`${uploadedFiles.length} archivo(s) subido(s) con éxito`, 'success');
    }

    function renameItem(item, index) {
        Swal.fire({
            title: `Renombrar ${item.type === 'folder' ? 'carpeta' : 'archivo'}`,
            input: 'text',
            inputValue: item.name,
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Renombrar',
            showLoaderOnConfirm: true,
            preConfirm: (newName) => {
                if (!newName) {
                    Swal.showValidationMessage('Por favor, ingrese un nuevo nombre');
                } else {
                    files[index].name = newName;
                    renderFiles();
                    showNotification(`${item.type === 'folder' ? 'Carpeta' : 'Archivo'} renombrado a "${newName}"`, 'success');
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });
    }

    function deleteItem(index) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                const deletedItem = files.splice(index, 1)[0];
                renderFiles();
                showNotification(`${deletedItem.type === 'folder' ? 'Carpeta' : 'Archivo'} "${deletedItem.name}" eliminado`, 'success');
            }
        });
    }

    function showNotification(message, type) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: type,
            title: message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
    }

    function getRandomColor() {
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    renderFiles();
});

/*
██████╗░░█████╗░██╗░░░██╗██╗██████╗░  ░█████╗░██████╗░███████╗░█████╗░████████╗
██╔══██╗██╔══██╗██║░░░██║██║██╔══██╗  ██╔══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝
██║░░██║███████║╚██╗░██╔╝██║██║░░██║  ██║░░╚═╝██████╔╝█████╗░░███████║░░░██║░░░
██║░░██║██╔══██║░╚████╔╝░██║██║░░██║  ██║░░██╗██╔══██╗██╔══╝░░██╔══██║░░░██║░░░
██████╔╝██║░░██║░░╚██╔╝░░██║██████╔╝  ╚█████╔╝██║░░██║███████╗██║░░██║░░░██║░░░
╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚═╝╚═════╝░  ░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝░░░╚═╝░░░
David Fonseca "DavidCreat" https://github.com/DavidCreat
  Copyright © 2024 David Fonseca "DavidCreat"
  Todos los derechos reservados.
  Este script está protegido por derechos de autor y no puede ser copiado, modificado ni distribuido sin permiso del autor.
  https://github.com/DavidCreat
*/