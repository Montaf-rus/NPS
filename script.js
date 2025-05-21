// Инициализация Supabase клиента
const supabaseUrl = 'https://kslgwbdrrbnczerjanpw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzbGd3YmRycmJuY3plcmphbnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyOTgzNjgsImV4cCI6MjA2Mjg3NDM2OH0.n8WqxtleNSJmVDwr41MepOhZgxFOe9lZaxHopGsW-Wo';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// DOM элементы
const npsForm = document.getElementById('npsForm');
const contactMeCheckbox = document.getElementById('contactMe');
const phoneInputContainer = document.getElementById('phoneInputContainer');
const phoneInput = document.getElementById('phone');
const thankYouMessage = document.getElementById('thankYouMessage');

// Обработка чекбокса для активации/деактивации поля телефона
contactMeCheckbox.addEventListener('change', function() {
    if (this.checked) {
        phoneInputContainer.classList.add('active');
        phoneInput.disabled = false;
        phoneInput.required = true;
    } else {
        phoneInputContainer.classList.remove('active');
        phoneInput.disabled = true;
        phoneInput.required = false;
    }
});

// Валидация номера телефона
phoneInput.addEventListener('input', function() {
    // Убедимся, что номер начинается с +7
    if (!this.value.startsWith('+7')) {
        this.value = '+7';
    }
    
    // Удаляем все нецифровые символы, кроме +
    let cleaned = this.value.replace(/[^\d+]/g, '');
    
    // Ограничиваем длину до 12 символов (включая +7)
    if (cleaned.length > 12) {
        cleaned = cleaned.substring(0, 12);
    }
    
    this.value = cleaned;
});

// Обработка отправки формы
npsForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Собираем данные формы
    const formData = {
        nps_score: parseInt(document.querySelector('input[name="nps"]:checked').value),
        quality_rating: parseInt(document.querySelector('input[name="quality"]:checked').value),
        photographer_rating: parseInt(document.querySelector('input[name="photographer"]:checked').value),
        makeup_rating: parseInt(document.querySelector('input[name="makeup"]:checked').value),
        comfort_rating: parseInt(document.querySelector('input[name="comfort"]:checked').value),
        admin_rating: parseInt(document.querySelector('input[name="admin"]:checked').value),
        comment: document.getElementById('comment').value,
        liked: document.getElementById('liked').value,
        improve: document.getElementById('improve').value,
        contact_requested: contactMeCheckbox.checked,
        phone: contactMeCheckbox.checked ? phoneInput.value : null,
        created_at: new Date().toISOString()
    };
    
    try {
        // Отправляем данные в Supabase
        const { data, error } = await supabaseClient
            .from('nps_feedback')
            .insert([formData]);
        
        if (error) {
            console.error('Ошибка при отправке данных:', error);
            alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
            return;
        }
        
        // Скрываем форму и показываем сообщение благодарности
        npsForm.style.display = 'none';
        thankYouMessage.classList.remove('hidden');
        
        console.log('Данные успешно отправлены:', data);
    } catch (err) {
        console.error('Ошибка:', err);
        alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
    }
});

// Инициализация звездного рейтинга
document.querySelectorAll('.stars').forEach(starGroup => {
    const inputs = starGroup.querySelectorAll('input');
    const labels = starGroup.querySelectorAll('label');
    
    // Добавляем эффект подсветки при наведении
    labels.forEach((label, index) => {
        label.addEventListener('mouseenter', () => {
            for (let i = 0; i <= index; i++) {
                labels[i].style.backgroundColor = '#ffdd55';
            }
        });
        
        label.addEventListener('mouseleave', () => {
            labels.forEach(l => {
                if (!l.previousElementSibling.checked) {
                    l.style.backgroundColor = '#ddd';
                } else {
                    l.style.backgroundColor = '#ffcc00';
                }
            });
        });
    });
    
    // Обработка клика на звезду
    inputs.forEach((input, index) => {
        input.addEventListener('change', () => {
            labels.forEach((l, i) => {
                if (i <= index) {
                    l.style.backgroundColor = '#ffcc00';
                } else {
                    l.style.backgroundColor = '#ddd';
                }
            });
        });
    });
});
