#!/bin/bash

echo "Проверка переменной окружения"

if [ "${SERVERNAME:-}" = "RU" ]; then
    iptables -t nat -I PREROUTING 1 -p tcp --dport 843 -j DNAT --to-destination 10.11.0.114:843;
    iptables -t nat -I PREROUTING 2 -p tcp --dport 4525 -j DNAT --to-destination 10.11.0.114:4525;
    iptables -t nat -I PREROUTING 3 -p tcp --dport 4524 -j DNAT --to-destination 10.11.0.114:4524;
fi

exec "$@"