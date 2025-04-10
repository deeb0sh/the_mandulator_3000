import { Netmask } from 'netmask';

function countSubnets(baseNetwork, newPrefix) {
  const block = new Netmask(baseNetwork);
  return Math.pow(2, newPrefix - block.bitmask);
}

const baseNetwork = '10.11.0.0/21'; // Пример сети /21
const newPrefix = 28;

console.log(
  `Количество подсетей /${newPrefix} в сети ${baseNetwork}:`,
  countSubnets(baseNetwork, newPrefix)
);
