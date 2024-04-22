export const emailVerification = ({ code }) => {
  return `
    <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap"
                    rel="stylesheet"
                />

            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Poppins', sans-serif;
                }

                .main { 
                    background-color: #20252c;
                    max-width: 600px;
                    padding: 20px 30px;
                    color: #fff;
                    border-radius: 15px;
                }

                header {
                    display: flex;
                    gap: 30px;
                    align-items: center;
                }

                header img {
                    width: 100px;
                    border-radius: 50%;
                }

                article {
                    padding-top: 30px;
                }

                article .article_code {
                    margin-top: 30px;
                    background-color: #15171b;
                    color: #09f;
                    font-weight: bold;
                    font-size: 25px;
                    padding: 10px 15px;
                    border-radius: 10px;
                    letter-spacing: 5px;
                    width: max-content;
                }
            </style>
        </head>
        <body>
            
            <div class="main">
                <header>
                    <img src="./src/assets/images/minidev-this-is-fine.png" />
                    <h2>Verificación de cuenta</h2>
                </header>
                <article>
                    <p>Aquí tiene el código para verificar su nueva cuenta </p>
                    <div class="article_code">
                        ${code}
                    </div>
                </article>
            </div>

        </body>
        </html>
    `;
};
