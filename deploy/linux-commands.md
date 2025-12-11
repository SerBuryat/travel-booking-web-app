```bash
# дает файлу право на запуск как программы
chmod +x script.sh
```

```bash
# запускает скрипт из текущей папки, если у него есть права на выполнение
./script.sh
```


```bash
# открывает файл в текстовом реадкторе nano с правами админа
sudo nano /usr/local/bin/myscript.sh
```

```bash
# перезагрузить конфигурацию (все соединения разрываются)
sudo systemctl reload nginx
```

```bash
# проверить конфигурацию перед перезапуском
sudo nginx -t
```

```bash
# просмотр логов nginx
sudo cat /var/log/nginx/access.log
```

```bash
# Логи docker-compose контейнеров c timestamp
docker-compose -f docker-compose-prod.yml logs -f --timestamps
```