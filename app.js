// app.js - полный исправленный код

const BACKEND_URL = 'https://backflaskasdfsfg.vercel.app/api'; 
// Ждем полной загрузки страницы и Telegram SDK
document.addEventListener('DOMContentLoaded', function() {
    initTelegramApp();
});

function initTelegramApp() {
    // Проверяем, что Telegram Web App SDK загружен
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Инициализируем Web App
        tg.ready(); // Важно! Сообщаем Telegram, что приложение готово
        tg.expand(); // Расширяем на весь экран
        
        // Получаем данные пользователя
        const user = tg.initDataUnsafe?.user;
        
        // Отображаем информацию о пользователе
        const userDataElement = document.getElementById('user-data');
        if (userDataElement && user) {
            userDataElement.innerHTML = `
                <p>👤 <b>${user.first_name || 'Аноним'}</b></p>
                ${user.username ? `<p>@${user.username}</p>` : ''}
                <p>ID: ${user.id}</p>
                <p>Language: ${user.language_code || 'не указан'}</p>
            `;
        } else if (userDataElement) {
            userDataElement.innerHTML = '<p>Данные пользователя недоступны</p>';
        }
        
        // Показываем главную кнопку
        if (tg.MainButton) {
            tg.MainButton.setText("Закрыть");
            tg.MainButton.show();
            tg.MainButton.onClick(() => {
                tg.close();
            });
        }
        
        // Делаем функцию showAlert глобально доступной
        window.showAlert = function() {
            if (tg && tg.showAlert) {
                tg.showAlert('Привет от Mini App! 🎉');
            } else {
                // Фолбэк для отладки вне Telegram
                alert('Привет от Mini App! (тестовый режим)');
            }
        };
        
        // Функция для отправки данных
       

window.sendData = async function() { // Добавил async
    // Проверяем доступность Telegram WebApp
    if (!window.Telegram?.WebApp) {
        alert('Запустите в Telegram WebView');
        return;
    }
    
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user;
    
    // Проверяем наличие пользователя
    if (!user?.id) {
        tg.showAlert('Данные пользователя недоступны');
        return;
    }
    
    const data = {
        action: 'button_click',
        user_id: user.id,
        user_name: user.first_name || 'Аноним',
        timestamp: Date.now()
    };

    // Показываем URL для отладки
    tg.showAlert(`Отправка на: ${BACKEND_URL}/webhook`);
    
    try {
        const response = await fetch(`${BACKEND_URL}/webhook`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                initData: tg.initData, // Используем tg вместо window.Telegram.WebApp
                data: data,
                user: user,
                timestamp: new Date().toISOString()
            })
        });
        
        const result = await response.json();
        tg.showAlert(`✅ Успех!\nОтвет сервера: ${result.message || 'Данные получены'}`);
        
    } catch (error) {
        console.error('Error:', error);
        tg.showAlert(`❌ Ошибка отправки:\n${error.message}\n\nПроверьте:\n1. URL сервера\n2. CORS настройки`);
    }
}
        
    } else {
        // Режим для тестирования в браузере
        console.warn('Telegram Web App SDK не найден. Режим тестирования.');
        
        // Эмулируем данные пользователя для теста
        const mockUser = {
            first_name: 'Тестовый',
            username: 'test_user',
            id: 123456789,
            language_code: 'ru'
        };
        
        // Отображаем мок-данные
        const userDataElement = document.getElementById('user-data');
        if (userDataElement) {
            userDataElement.innerHTML = `
                <p>👤 <b>${mockUser.first_name} (тестовый режим)</b></p>
                <p>@${mockUser.username}</p>
                <p>ID: ${mockUser.id}</p>
                <p style="color: orange;">⚠️ Запустите в Telegram для полного функционала</p>
            `;
        }
        
        // Фолбэк функции для тестирования
        window.showAlert = function() {
            alert('Привет от Mini App! (тестовый режим - запустите в Telegram)');
        };
        
        window.sendData = function() {
            alert('Данные отправлены (тестовый режим)');
        };
    }
}

async function testBackend() {
        try {
            const response = await fetch(`${BACKEND_URL}/test`);
            const data = await response.json();
            alert(JSON.stringify(data, null, 2));
        } catch (error) {
            alert('Ошибка: ' + error.message);
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














