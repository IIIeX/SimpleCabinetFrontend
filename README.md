# SimpleCabinetFrontend

## Установка
```
npm install
```

### Запуск сервера для разработки
```
npm run serve
```

### Сборка готовых файлов для production
```
npm run build
```

### Проверка кода
```
npm run lint
```

### Настройка конфигурации сборки
Смотри [Configuration Reference](https://cli.vuejs.org/config/).

## Настройка
Отредактируйте файл `src/config.js`:
```javascript
const config = {
    url: 'ws://localhost:9274/api', // адрес LaunchServer API
    projectName: "Minecraft", // Ваш ProjectName
    devtools: true // Отладочные утилиты
}
```
## Структура проекта
- `src/main.js` - инициализация WebSocket API и Vue.js
- `src/router/index.js` - правила роутинга(какой URL за какой компонент отвечает)
- `src/App.vue` - общий шаблон сайта, header, footer, навигационный бар
- `src/store/index.js` - центральное хранилище данных, доступное из всех компонентов
- `src/views` - страницы
- `src/components` - компоненты страниц, вынесенные отдельно для удобства использования
- `src/assets` - картинки и прочие файлы  
Для редактирования файлов рекомендуется использовать `Visual Studio Code` с плагином `Vetur` для подсветки синтаксиса .vue файлов и подсказок  
Ссылка на документацию по Vue.js: [ru.vuejs.org](https://ru.vuejs.org/v2/guide/)  
Ссылка на документацию по Bootstrap-Vue: [bootstrap-vue.org](https://bootstrap-vue.org/)
