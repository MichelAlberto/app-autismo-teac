import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const generateCertificate = async (userName: string, date: string) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: 'Helvetica', 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f0f4f8;
            }
            .certificate-container {
                width: 90%;
                height: 80%;
                padding: 50px;
                border: 20px solid #1a3b5c;
                background-color: white;
                position: relative;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .certificate-container::before {
                content: '';
                position: absolute;
                top: 10px; left: 10px; right: 10px; bottom: 10px;
                border: 2px solid #6a7fdb;
                pointer-events: none;
            }
            .header {
                margin-bottom: 30px;
            }
            .logo-text {
                font-size: 24px;
                font-weight: bold;
                color: #1a3b5c;
                letter-spacing: 2px;
            }
            h1 {
                font-size: 48px;
                color: #1a3b5c;
                margin: 20px 0;
                text-transform: uppercase;
            }
            h2 {
                font-size: 20px;
                color: #555;
                font-weight: normal;
                margin-bottom: 40px;
            }
            .user-name {
                font-size: 42px;
                color: #6a7fdb;
                font-family: 'Times New Roman', serif;
                border-bottom: 2px solid #ccc;
                display: inline-block;
                padding: 0 50px;
                margin: 20px 0;
            }
            .description {
                font-size: 18px;
                color: #666;
                line-height: 1.6;
                margin: 30px auto;
                max-width: 600px;
            }
            .footer {
                margin-top: 60px;
                display: flex;
                justify-content: space-around;
                align-items: flex-end;
            }
            .signature-box {
                border-top: 1px solid #333;
                width: 200px;
                padding-top: 10px;
                font-size: 14px;
                color: #333;
            }
            .date-box {
                font-size: 14px;
                color: #777;
            }
            .seal {
                position: absolute;
                bottom: 40px;
                right: 40px;
                width: 100px;
                height: 100px;
                background-color: #ff9800;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
                border: 4px double white;
                transform: rotate(-15deg);
            }
        </style>
    </head>
    <body>
        <div class="certificate-container">
            <div class="header">
                <div class="logo-text">Transtorno do Espectro Autista Consciente"</div>
            </div>
            
            <h1>Certificado de Conclusão</h1>
            <h2>Este certificado é orgulhosamente concedido a:</h2>
            
            <div class="user-name">${userName}</div>
            
            <p class="description">
                Pela conclusão com êxito do treinamento intensivo de
                <strong>"Estratégias Diárias para Crianças com Transtorno do Espectro Autista (TEA)"</strong>, 
                abrangendo módulos de rotina, comunicação, comportamento e intervenções práticas, 
                totalizando a carga horária completa do programa.
            </p>
            
            <div class="footer">
                <div class="date-box">
                    Emitido em: ${date}
                </div>
                <div class="signature-box">
                    Coordenação TEAC
                </div>
            </div>
            
            <div class="seal">
                ORIGINAL<br>TEAC
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error("Erro ao gerar certificado:", error);
    throw error;
  }
};
