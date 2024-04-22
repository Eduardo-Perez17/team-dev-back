export let codeEmailVerification = "";

export const codeGenerate = (): string => {
    for (let i = 0; i < 6; i++) {
        codeEmailVerification += String(Math.floor(Math.random() * 10));
    }
    console.log(codeEmailVerification)
    return codeEmailVerification;
}