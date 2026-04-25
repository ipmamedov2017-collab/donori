importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCf1UO6hrlYXR2GYcgGZUfsbit4Zav1m4E",
    authDomain: "trolldonor.firebaseapp.com",
    databaseURL: "https://trolldonor-default-rtdb.firebaseio.com",
    projectId: "trolldonor",
    storageBucket: "trolldonor.firebasestorage.app",
    appId: "1:761197257675:web:53dc596cf349d0cd474c4e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
    console.log('Фоновое уведомление:', payload);
    
    const notificationTitle = payload.notification?.title || 'Новое сообщение';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/icon.png',
        tag: payload.data?.chatId || 'msg',
        vibrate: [200, 100, 200],
        data: payload.data || {}
    };
    
    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const chatId = event.notification.data?.chatId;
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (const client of windowClients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                const url = chatId ? `/?chat=${chatId}` : '/';
                return clients.openWindow(url);
            }
        })
    );
});