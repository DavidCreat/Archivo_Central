document.addEventListener('DOMContentLoaded', function() {
    const fileList = document.getElementById('file-list');
    const previewContent = document.getElementById('preview-content');
    const shareBtn = document.getElementById('share-btn');
    const shareLink = document.getElementById('share-link');
    const shareUrl = document.getElementById('share-url');
    const copyBtn = document.getElementById('copy-btn');
    const breadcrumb = document.getElementById('breadcrumb');

    let currentPath = [];
    let files = [
        { type: 'folder', name: 'Documentos', contents: [
            { type: 'file', name: 'informe.pdf', extension: 'pdf' },
            { type: 'file', name: 'presentacion.pptx', extension: 'pptx' }
        ]},
        { type: 'folder', name: 'Imágenes', contents: [
            { type: 'file', name: 'foto.jpg', extension: 'jpg' },
            { type: 'file', name: 'grafico.png', extension: 'png' }
        ]},
        { type: 'folder', name: 'Multimedia', contents: [
            { type: 'file', name: 'video.mp4', extension: 'mp4' },
            { type: 'file', name: 'audio.mp3', extension: 'mp3' }
        ]},
        { type: 'file', name: 'documento.pdf', extension: 'pdf' },
        { type: 'file', name: 'imagen.jpg', extension: 'jpg' },
        { type: 'file', name: 'animacion.gif', extension: 'gif' },
    ];

    function renderFiles() {
        fileList.innerHTML = '';
        let currentFolder = getCurrentFolder();
        currentFolder.forEach((item, index) => {
            const element = document.createElement('div');
            element.className = `${item.type}-item p-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center space-x-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300`;
            
            if (item.type === 'folder') {
                element.innerHTML = `
                    <i class="fas fa-folder text-yellow-500"></i>
                    <span>${item.name}</span>
                `;
                element.addEventListener('click', () => openFolder(item.name));
            } else {
                element.innerHTML = `
                    <i class="fas ${getFileIcon(item.extension)} text-blue-500"></i>
                    <span>${item.name}</span>
                `;
                element.addEventListener('click', () => previewFile(item));
            }
            
            fileList.appendChild(element);
        });
    }

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
        previewContent.innerHTML = '';
        const extension = file.extension.toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            const img = document.createElement('img');
            img.src = `path/to/your/files/${file.name}`;
            img.alt = file.name;
            previewContent.appendChild(img);
        } else if (['mp4', 'webm'].includes(extension)) {
            const video = document.createElement('video');
            video.src = `path/to/your/files/${file.name}`;
            video.controls = true;
            previewContent.appendChild(video);
        } else if (['mp3', 'wav'].includes(extension)) {
            const audio = document.createElement('audio');
            audio.src = `path/to/your/files/${file.name}`;
            audio.controls = true;
            previewContent.appendChild(audio);
        } else if (extension === 'pdf') {
            const iframe = document.createElement('iframe');
            iframe.src = `path/to/your/files/${file.name}`;
            previewContent.appendChild(iframe);
        } else {
            previewContent.innerHTML = `<p class="text-center">No se puede previsualizar ${file.name}</p>`;
        }

        shareBtn.classList.remove('hidden');
        shareLink.classList.add('hidden');
    }

    shareBtn.addEventListener('click', () => {
        shareBtn.classList.add('hidden');
        shareLink.classList.remove('hidden');
        const randomString = Math.random().toString(36).substring(2, 15);
        shareUrl.value = `https://ejemplo.com/compartir/${randomString}`;
    });

    copyBtn.addEventListener('click', () => {
        shareUrl.select();
        document.execCommand('copy');
        showNotification('Enlace copiado al portapapeles', 'success');
    });

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

    renderFiles();
    updateBreadcrumb();
});