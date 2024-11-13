document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('[role="tab"]');
    const tabContents = document.querySelectorAll('[role="tabpanel"]');

    tabs.forEach(tab => {
        tab.addEventListener('click', changeTabs);
    });

    function changeTabs(e) {
        const target = e.target;
        const parent = target.parentNode;
        const grandparent = parent.parentNode;

        // Remove all current selected tabs
        parent.querySelectorAll('[aria-selected="true"]').forEach(t => t.setAttribute('aria-selected', false));

        // Set this tab as selected
        target.setAttribute('aria-selected', true);

        // Hide all tab panels
        tabContents.forEach(content => content.classList.add('hidden'));

        // Show the selected panel
        document.querySelector(`#${target.getAttribute('data-tabs-target').substring(1)}`).classList.remove('hidden');
    }

    // Initialize to show the first active content when loading
    document.getElementById('profile').classList.remove('hidden');

    // Form submission handlers
    const profileForm = document.getElementById('profile-form');
    const securityForm = document.getElementById('security-form');
    const notificationsForm = document.getElementById('notifications-form');
    const appearanceForm = document.getElementById('appearance-form');

    profileForm.addEventListener('submit', handleProfileSubmit);
    securityForm.addEventListener('submit', handleSecuritySubmit);
    notificationsForm.addEventListener('submit', handleNotificationsSubmit);
    appearanceForm.addEventListener('submit', handleAppearanceSubmit);

    function handleProfileSubmit(e) {
        e.preventDefault();
        const formData = new FormData(profileForm);
        const updatedData = Object.fromEntries(formData.entries());
        
        // Update UI
        document.getElementById('profile-name').textContent = updatedData.fullName;
        document.getElementById('profile-email').textContent = updatedData.email;
        document.getElementById('sidebar-name').textContent = updatedData.fullName;
        
        showNotification('Perfil actualizado con éxito', 'success');
    }

    function handleSecuritySubmit(e) {
        e.preventDefault();
        // Aquí iría la lógica para actualizar la configuración de seguridad
        showNotification('Configuración de seguridad actualizada', 'success');
    }

    function handleNotificationsSubmit(e) {
        e.preventDefault();
        // Aquí iría la lógica para actualizar las preferencias de notificaciones
        showNotification('Preferencias de notificaciones guardadas', 'success');
    }

    function handleAppearanceSubmit(e) {
        e.preventDefault();
        const theme = document.getElementById('theme').value;
        const fontSize = document.getElementById('font-size').value;
        const animations = document.getElementById('animations').checked;

        // Aplicar tema
        document.documentElement.className = theme === 'dark' ? 'dark' : '';

        // Aplicar tamaño de fuente
        document.body.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';

        // Aplicar animaciones
        document.body.style.setProperty('--animate-duration', animations ? '0.3s' : '0s');

        showNotification('Configuración de apariencia guardada', 'success');
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

    // Cargar datos del usuario (simulado)
    function loadUserData() {
        const userData = {
            fullName: 'David Fonseca',
            email: 'david@example.com',
            phone: '+34 123 456 789',
            country: 'ES',
            bio: 'Desarrollador web apasionado por la tecnología.',
            twoFactor: true,
            emailNotifications: true,
            pushNotifications: false,
            notificationFrequency: 'daily',
            theme: 'dark',
            fontSize: 'medium',
            animations: true
        };

        // Rellenar el formulario de perfil
        document.getElementById('fullName').value = userData.fullName;
        document.getElementById('email').value = userData.email;
        document.getElementById('phone').value = userData.phone;
        document.getElementById('country').value = userData.country;
        document.getElementById('bio').value = userData.bio;

        // Actualizar nombre y correo en la UI
        document.getElementById('profile-name').textContent = userData.fullName;
        document.getElementById('profile-email').textContent = userData.email;
        document.getElementById('sidebar-name').textContent = userData.fullName;

        // Configurar opciones de seguridad
        document.getElementById('two-factor').checked = userData.twoFactor;

        // Configurar preferencias de notificaciones
        document.getElementById('email-notifications').checked = userData.emailNotifications;
        document.getElementById('push-notifications').checked = userData.pushNotifications;
        document.getElementById('notification-frequency').value = userData.notificationFrequency;

        // Configurar opciones de apariencia
        document.getElementById('theme').value = userData.theme;
        document.getElementById('font-size').value = userData.fontSize;
        document.getElementById('animations').checked = userData.animations;

        // Aplicar configuración de apariencia
        document.documentElement.className = userData.theme === 'dark' ? 'dark' : '';
        document.body.style.fontSize = userData.fontSize === 'small' ? '14px' : userData.fontSize === 'large' ? '18px' : '16px';
        document.body.style.setProperty('--animate-duration', userData.animations ? '0.3s' : '0s');
    }

    loadUserData();

    // Manejar la carga de la imagen de perfil
    const avatarUpload = document.getElementById('avatar-upload');
    const profileImage = document.getElementById('profile-image');
    const sidebarAvatar = document.getElementById('sidebar-avatar');

    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
                sidebarAvatar.src = e.target.result;
                showNotification('Imagen de perfil actualizada', 'success');
            }
            reader.readAsDataURL(file);
        }
    });
});
