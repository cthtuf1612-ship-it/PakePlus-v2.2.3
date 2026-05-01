window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// Обработка кликов по ссылкам
const hookClick = (e) => {
    let target = e.target;
    
    // Находим ближайшую ссылку (если кликнули по тексту или картинке внутри ссылки)
    const link = target.closest('a');
    
    if (!link || !link.href) return;
    
    // Проверяем, должна ли ссылка открываться в новой вкладке
    const isBlank = link.target === '_blank' || 
                    link.getAttribute('rel') === 'external' ||
                    e.ctrlKey || e.metaKey;
    
    // Также проверяем глобальный base target
    const baseTarget = document.querySelector('head base[target="_blank"]');
    
    if (isBlank || baseTarget) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Перенаправляем:', link.href);
        
        // Просто переходим по ссылке в том же окне
        window.location.href = link.href;
        return false;
    }
    
    // Если обычная ссылка - ничего не делаем, пусть работает как обычно
    console.log('Обычный переход:', link.href);
};

// Перехватываем window.open (открытие новых окон через JavaScript)
const originalOpen = window.open;
window.open = function(url, name, features) {
    console.log('Перехвачен window.open:', url);
    
    // Открываем в том же окне
    window.location.href = url;
    
    // Возвращаем заглушку, чтобы скрипты на сайте не сломались
    return {
        closed: false,
        focus: () => {},
        blur: () => {}
    };
};

// Вешаем обработчик на все клики
document.addEventListener('click', hookClick, { capture: true });

// Дополнительно: обрабатываем отправку форм, которые открываются в новом окне
document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form.target === '_blank') {
        e.preventDefault();
        form.target = '_self';
        form.submit();
    }
}, { capture: true });