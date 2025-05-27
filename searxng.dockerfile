FROM searxng/searxng

COPY searxng-settings.yml /etc/searxng/settings.yml

EXPOSE 8080