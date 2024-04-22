export const codeGenerate = (): string => {
    let codigo = "";
    for (let i = 0; i < 6; i++) {
        codigo += String(Math.floor(Math.random() * 10));
    }
    return codigo;
}
