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
    const breadcrumb = document.getElementById('breadcrumb');
    const uploadPopup = document.getElementById('upload-popup');
    const progressBar = document.getElementById('progress-bar');
    const popupIcon = document.getElementById('popup-icon');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const closePopupBtn = document.getElementById('close-popup');
    const contextMenu = document.getElementById('context-menu');
    const contextRename = document.getElementById('context-rename');
    const contextDelete = document.getElementById('context-delete');

    let currentPath = [];
    let files = [
        { type: 'folder', name: 'Documentos', color: 'bg-blue-500', contents: [] },
        { type: 'folder', name: 'Imágenes', color: 'bg-green-500', contents: [] },
        { type: 'folder', name: 'Vídeos', color: 'bg-red-500', contents: [] },
        { type: 'file', name: 'informe.pdf', extension: 'pdf' },
        { type: 'file', name: 'foto.jpg', extension: 'jpg' },
        { type: 'file', name: 'presentacion.pptx', extension: 'pptx' },
    ];

    function renderFiles() {
        fileGrid.innerHTML = '';
        let currentFolder = getCurrentFolder();
        currentFolder.forEach((item, index) => {
            const element = document.createElement('div');
            element.className = `${item.type}-item p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center cursor-pointer relative`;
            element.setAttribute('data-index', index);

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

            element.addEventListener('contextmenu', handleContextMenu);
            fileGrid.appendChild(element);
        });
    }

    function handleContextMenu(e) {
        e.preventDefault();
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;

        const index = e.target.closest('[data-index]').getAttribute('data-index');
        contextMenu.setAttribute('data-target-index', index);
    }

    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });

    contextRename.addEventListener('click', (e) => {
        e.preventDefault();
        const index = contextMenu.getAttribute('data-target-index');
        renameItem(getCurrentFolder()[index], index);
    });

    contextDelete.addEventListener('click', (e) => {
        e.preventDefault();
        const index = contextMenu.getAttribute('data-target-index');
        deleteItem(index);
    });

    function getCurrentFolder() {
        let currentFolder = files;
        for (let folderName of currentPath) {
            currentFolder = currentFolder.find(item => item.type === 'folder' && item.name === folderName).contents;
        }
        return currentFolder;
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
        renderFiles();
        showNotification(`Abriendo carpeta: ${folderName}`, 'info');
    }

    function updateBreadcrumb() {
        breadcrumb.innerHTML = `
            <li class="inline-flex items-center">
                <a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                    <svg class="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    Inicio
                </a>
            </li>
        `;

        currentPath.forEach((folder, index) => {
            breadcrumb.innerHTML += `
                <li>
                    <div class="flex items-center">
                        <svg class="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <a href="#" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white" data-index="${index}">${folder}</a>
                    </div>
                </li>
            `;
        });

        breadcrumb.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const index = e.target.dataset.index;
                if (index !== undefined) {
                    currentPath = currentPath.slice(0, parseInt(index) + 1);
                    updateBreadcrumb();
                    renderFiles();
                } else {
                    currentPath = [];
                    updateBreadcrumb();
                    renderFiles();
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
                    getCurrentFolder().push({ type: 'folder', name: folderName, color: getRandomColor(), contents: [] });
                    renderFiles();
                    showNotification(`Carpeta "${folderName}" creada con éxito`, 'success');
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });
    }

    function handleFileUpload(event) {
        const uploadedFiles = event.target.files;
        showUploadPopup();
        let filesUploaded = 0;

        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            const extension = file.name.split('.').pop();

            setTimeout(() => {
                getCurrentFolder().push({ type: 'file', name: file.name, extension: extension });
                filesUploaded++;
                updateUploadProgress(filesUploaded, uploadedFiles.length);

                if (filesUploaded === uploadedFiles.length) {
                    renderFiles();
                    showNotification(`${uploadedFiles.length} archivo(s) subido(s) con éxito`, 'success');
                    setTimeout(hideUploadPopup, 1000);
                }
            }, i * 1000); // Simulating upload time
        }
    }

    function showUploadPopup() {
        uploadPopup.classList.remove('hidden');
        progressBar.style.width = '0%';
        popupIcon.className = 'fas fa-cloud-upload-alt text-indigo-600 text-xl';
        popupTitle.textContent = 'Subiendo archivos';
        popupMessage.textContent = 'Por favor, espere mientras se suben los archivos...';
        closePopupBtn.classList.add('hidden');
    }

    function updateUploadProgress(current, total) {
        const progress = (current / total) * 100;
        progressBar.style.width = `${progress}%`;
        popupMessage.textContent = `Subiendo archivo ${current} de ${total}`;
    }

    function hideUploadPopup() {
        uploadPopup.classList.add('hidden');
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
                    getCurrentFolder()[index].name = newName;
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
                const deletedItem = getCurrentFolder().splice(index, 1)[0];
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
    updateBreadcrumb();
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