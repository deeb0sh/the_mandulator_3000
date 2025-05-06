#!/bin/sh

# форвард на Серёгу
iptables -t nat -A PREROUTING -p tcp --dport 843 -j DNAT --to-destination 10.11.4.18:843
iptables -t nat -A PREROUTING -p tcp --dport 4525 -j DNAT --to-destination 10.11.4.18:4525
iptables -t nat -A PREROUTING -p tcp --dport 4524 -j DNAT --to-destination 10.11.4.18:4524

iptables-save > /etc/iptables.rules

exec "$@"