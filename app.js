// Инициализация Telegram Web App
const tg = window.Telegram?.WebApp || {};

// Инициализация при загрузке
tg.ready && tg.ready();
tg.expand && tg.expand();

// Получаем данные пользователя
const user = tg.initDataUnsafe.user;

// Отображаем информацию о пользователе
document.getElementById('user-data').innerHTML = `
    <p>👤 <b>${user.first_name || 'Аноним'}</b></p>
    ${user.username ? `<p>@${user.username}</p>` : ''}
    <p>ID: ${user.id}</p>
`;

// Функция для показа alert
function showAlert() {
    tg.showAlert('Привет от Mini App!');
}

// Функция для отправки данных
const BACKEND_URL = 'http://localhost:3000';

async function sendData() {
    const data = {
        action: 'button_click',
        user_id: user.id,
        timestamp: Date.now()
    };
    
    try {
        const response = await fetch(`${BACKEND_URL}/web-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                initData: window.Telegram.WebApp.initData, // Важно!
                data: data,
                user: user
            })
        });
        
        const result = await response.json();
        tg.showAlert(`Ответ сервера: ${result.message}`);
    } catch (error) {
        console.error('Error:', error);
        tg.showAlert('Ошибка отправки');
    }
}

// Закрытие приложения
function closeApp() {
    tg.close();
}

// Показываем главную кнопку
tg.MainButton.text = "Закрыть";
tg.MainButton.show();
tg.MainButton.onClick(closeApp);

// Логируем событие открытия

console.log('App launched:', tg.initDataUnsafe);


