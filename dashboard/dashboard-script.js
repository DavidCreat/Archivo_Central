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
    const fileUpload = document.getElementById('file-upload');
    const dropZone = document.getElementById('drop-zone');
    const uploadQueue = document.getElementById('upload-queue');
    const uploadAllBtn = document.getElementById('upload-all-btn');
    const uploadPopup = document.getElementById('upload-popup');
    const progressBar = document.getElementById('progress-bar');
    const popupIcon = document.getElementById('popup-icon');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const closePopupBtn = document.getElementById('close-popup');
    const recentFilesList = document.getElementById('recent-files-list');

    let filesToUpload = [];

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-indigo-500');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-indigo-500');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-indigo-500');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    fileUpload.addEventListener('change', (e) => {
        const files = e.target.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            addFileToQueue(files[i]);
        }
    }

    function addFileToQueue(file) {
        const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
        filesToUpload.push({ id: fileId, file: file });

        const li = document.createElement('li');
        li.className = 'queue-item py-3 flex justify-between items-center';
        li.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${getFileIcon(file.name)} text-indigo-500 mr-2"></i>
                <span class="text-sm font-medium">${file.name}</span>
            </div>
            <div class="flex items-center">
                <span class="text-xs text-gray-500 mr-2">${formatFileSize(file.size)}</span>
                <button class="remove-file text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        uploadQueue.appendChild(li);

        li.querySelector('.remove-file').addEventListener('click', () => removeFileFromQueue(fileId));
    }

    function removeFileFromQueue(fileId) {
        filesToUpload = filesToUpload.filter(file => file.id !== fileId);
        updateUploadQueue();
    }

    function updateUploadQueue() {
        uploadQueue.innerHTML = '';
        filesToUpload.forEach(file => addFileToQueue(file.file));
    }

    uploadAllBtn.addEventListener('click', () => {
        if (filesToUpload.length > 0) {
            uploadPopup.classList.remove('hidden');
            uploadPopup.classList.add('show');
            simulateFileUpload();
        }
    });

    function simulateFileUpload() {
        let totalFiles = filesToUpload.length;
        let uploadedFiles = 0;

        const uploadInterval = setInterval(() => {
            if (uploadedFiles < totalFiles) {
                uploadedFiles++;
                let progress = (uploadedFiles / totalFiles) * 100;
                progressBar.style.width = `${progress}%`;
                popupMessage.textContent = `Subiendo archivo ${uploadedFiles} de ${totalFiles}`;

                if (uploadedFiles === totalFiles) {
                    clearInterval(uploadInterval);
                    popupIcon.className = 'fas fa-check text-green-500 text-xl';
                    popupTitle.textContent = 'Subida completada';
                    popupMessage.textContent = 'Todos los archivos se han subido correctamente.';
                    closePopupBtn.classList.remove('hidden');
                    updateRecentFiles();
                }
            }
        }, 1000);
    }

    function updateRecentFiles() {
        recentFilesList.innerHTML = '';
        const recentFiles = filesToUpload.slice(-4).reverse();
        recentFiles.forEach(file => {
            const li = document.createElement('li');
            li.className = 'px-4 py-4 sm:px-6 animate-fadeIn';
            li.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas ${getFileIcon(file.file.name)} text-xl mr-3"></i>
                        <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                            ${file.file.name}
                        </p>
                    </div>
                    <div class="ml-2 flex-shrink-0 flex">
                        <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                            Recién subido
                        </p>
                    </div>
                </div>
            `;
            recentFilesList.appendChild(li);
        });
        filesToUpload = [];
        updateUploadQueue();
    }

    closePopupBtn.addEventListener('click', () => {
        uploadPopup.classList.add('hide');
        setTimeout(() => {
            uploadPopup.classList.add('hidden');
            uploadPopup.classList.remove('show', 'hide');
            progressBar.style.width = '0%';
            popupIcon.className = 'fas fa-cloud-upload-alt text-indigo-600 text-xl';
            popupTitle.textContent = 'Subiendo archivos';
            popupMessage.textContent = 'Por favor, espere mientras se suben los archivos...';
            closePopupBtn.classList.add('hidden');
        }, 300);
    });

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function getFileIcon(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'fa-file-pdf';
            case 'doc':
            case 'docx':
                return 'fa-file-word';
            case 'xls':
            case 'xlsx':
                return 'fa-file-excel';
            case 'ppt':
            case 'pptx':
                return 'fa-file-powerpoint';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return 'fa-file-image';
            default:
                return 'fa-file';
        }
    }

    const cards = document.querySelectorAll('.bg-white.overflow-hidden.shadow.rounded-lg');
    cards.forEach(card => {
        card.classList.add('hover-scale');
    });

    const sidebar = document.querySelector('aside');
    sidebar.classList.add('animate-slideIn');

    const mainContent = document.querySelector('main');
    mainContent.classList.add('animate-fadeIn');
});

// Simulación de carga de datos
setTimeout(() => {
    const storageUsed = document.querySelector('.text-lg.font-medium');
    let usage = 0;
    const interval = setInterval(() => {
        usage += 1;
        storageUsed.textContent = `${usage.toFixed(1)} GB / 100 GB`;
        if (usage >= 45.5) {
            clearInterval(interval);
        }
    }, 50);
}, 1000);

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