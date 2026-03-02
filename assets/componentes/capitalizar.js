export const capitalizar = (texto) => {
    return texto
        .toLowerCase()
        .split(" ")
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(" ")
}