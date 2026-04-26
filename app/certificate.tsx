import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function CertificateScreen() {
  const [userName, setUserName] = useState("Usuário TEAC");
  const completionDate = new Date().toLocaleDateString('pt-BR');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem("teac_current_user");
        if (userJson) {
          const user = JSON.parse(userJson);
          if (user.nome) setUserName(user.nome);
        }
      } catch (e) {
        console.error("Erro ao carregar nome do usuário:", e);
      }
    };
    loadUserData();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Concluí o curso Estratégias Diárias para Crianças com TEA no App TEAC! 🎓\nCertificado emitido em: ${completionDate}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const generatePdf = async () => {
    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #1A237E;
              -webkit-print-color-adjust: exact;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100vw;
              height: 100vh;
            }
            .certificate-container {
              background-color: white;
              width: 92%;
              height: 90%;
              border-radius: 40px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              position: relative;
              box-sizing: border-box;
              padding: 60px;
            }
            .inner-gold-border {
              position: absolute;
              top: 25px;
              left: 25px;
              right: 25px;
              bottom: 25px;
              border: 3px solid #D4AF37;
              border-radius: 25px;
              pointer-events: none;
            }
            .illustration {
              font-size: 80px;
              margin-bottom: 20px;
            }
            h1 {
              color: #1A237E;
              font-size: 64px;
              margin: 0;
              font-weight: 900;
              letter-spacing: 2px;
            }
            .subtitle {
              color: #5C6BC0;
              font-size: 20px;
              font-weight: bold;
              margin-top: 5px;
              text-transform: uppercase;
              letter-spacing: 3px;
            }
            .divider {
              width: 300px;
              height: 2px;
              background-color: #E0E0E0;
              margin: 40px 0;
            }
            .intro-text {
              font-style: italic;
              color: #757575;
              font-size: 22px;
              margin-bottom: 10px;
            }
            .user-name {
              font-size: 52px;
              font-weight: bold;
              color: #222;
              margin-bottom: 35px;
            }
            .description {
              color: #757575;
              font-size: 18px;
              margin-bottom: 15px;
            }
            .course-name {
              color: #1A237E;
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              line-height: 1.5;
              max-width: 700px;
            }
            .signature-box {
              margin-top: 50px;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .signature-name {
              font-family: 'Cedarville Cursive', 'Brush Script MT', cursive;
              font-size: 32px;
              color: #1A237E;
              margin-bottom: -15px;
              opacity: 0.8;
            }
            .signature-line {
              width: 250px;
              height: 1px;
              background-color: #333;
              margin: 10px 0;
            }
            .signature-title {
              font-size: 14px;
              color: #757575;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .footer {
              position: absolute;
              bottom: 70px;
              left: 80px;
              right: 80px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .seal-box {
              text-align: center;
            }
            .seal-circle {
              width: 70px;
              height: 70px;
              border: 5px solid #D4AF37;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 10px;
              margin-left: auto;
              margin-right: auto;
            }
            .seal-star {
              color: #D4AF37;
              font-size: 35px;
            }
            .seal-text {
              color: #D4AF37;
              font-size: 14px;
              font-weight: bold;
              line-height: 1.2;
            }
            .date-box {
              text-align: right;
            }
            .date-label {
              font-size: 16px;
              color: #9E9E9E;
            }
            .date-value {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="inner-gold-border"></div>
            
            <div class="illustration">🎓</div>
            
            <h1>CERTIFICADO</h1>
            <div class="subtitle">DE CONCLUSÃO DE CURSO</div>
            
            <div class="divider"></div>
            
            <div class="intro-text">Certificamos que</div>
            <div class="user-name">${userName}</div>
            
            <div class="description">concluiu com êxito o curso de capacitação técnica em</div>
            <div class="course-name">
              Estratégias Diárias para Crianças com TEA:<br/>
              Rotina, Comunicação e Comportamento
            </div>

            <div class="signature-box">
              <div class="signature-name">TEAC</div>
              <div class="signature-line"></div>
              <div class="signature-title">Coordenação Pedagógica - TEAC</div>
            </div>

            <div class="footer">
              <div class="seal-box">
                <div class="seal-circle"><span class="seal-star">★</span></div>
                <div class="seal-text">AUTISMO<br/>TEAC</div>
              </div>
              <div class="date-box">
                <div class="date-label">Data de Emissão</div>
                <div class="date-value">${completionDate}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar PDF");
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seu Certificado</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.certificateCard}>
            {/* Borda Dourada Interna */}
            <View style={styles.certificateInnerBorder}>
              
              <View style={styles.illustrationPlaceholder}>
                <Ionicons name="school" size={50} color="#5C6BC0" />
              </View>

              <Text style={styles.certTitle}>CERTIFICADO</Text>
              <Text style={styles.certSubTitle}>DE CONCLUSÃO DE CURSO</Text>

              <View style={styles.divider} />

              <Text style={styles.certText}>Certificamos que</Text>
              <Text style={styles.userName}>{userName}</Text>
              
              <Text style={styles.certDescription}>
                concluiu com êxito o curso de capacitação técnica em
              </Text>
              <Text style={styles.courseName}>
                Estratégias Diárias para Crianças com TEA:{"\n"}
                Rotina, Comunicação e Comportamento
              </Text>

              <View style={styles.signatureContainer}>
                <Text style={styles.signatureName}>TEAC</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureTitle}>Coordenação Pedagógica - TEAC</Text>
              </View>

              <View style={styles.footerRow}>
                <View style={styles.sealContainer}>
                  <View style={styles.sealCircle}>
                    <Ionicons name="ribbon" size={24} color="#D4AF37" />
                  </View>
                  <Text style={styles.sealText}>AUTISMO{"\n"}TEAC</Text>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateLabel}>Data de Emissão</Text>
                  <Text style={styles.dateValue}>{completionDate}</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.congratsText}>
            Parabéns pela sua dedicação! Este certificado comprova seu conhecimento nas melhores práticas de suporte ao TEA.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.downloadBtn} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={24} color="#ffffff" style={{ marginRight: 10 }} />
              <Text style={styles.buttonText}>Compartilhar Conquista</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.printBtn} onPress={generatePdf}>
              <Ionicons name="download-outline" size={24} color="#3949AB" style={{ marginRight: 10 }} />
              <Text style={[styles.buttonText, { color: "#3949AB" }]}>Salvar em PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A237E",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginRight: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  certificateCard: {
    width: "100%",
    aspectRatio: 0.85,
    backgroundColor: "#ffffff",
    borderRadius: 40,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  certificateInnerBorder: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#D4AF37",
    borderRadius: 30,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  illustrationPlaceholder: {
    marginTop: 10,
    marginBottom: 5,
  },
  certTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1A237E",
    letterSpacing: 1,
    textAlign: "center",
  },
  certSubTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5C6BC0",
    letterSpacing: 1,
    textAlign: "center",
    marginTop: -5,
  },
  divider: {
    width: "60%",
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  certText: {
    fontSize: 16,
    color: "#757575",
    fontStyle: "italic",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  certDescription: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    marginTop: 10,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A237E",
    textAlign: "center",
    lineHeight: 22,
  },
  signatureContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: -10,
  },
  signatureName: {
    fontSize: 22,
    fontFamily: "serif",
    fontStyle: "italic",
    color: "#1A237E",
    opacity: 0.8,
    letterSpacing: -1,
  },
  signatureLine: {
    width: 180,
    height: 1,
    backgroundColor: "#333",
    marginVertical: 5,
  },
  signatureTitle: {
    fontSize: 10,
    color: "#757575",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footerRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sealContainer: {
    alignItems: "center",
  },
  sealCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  sealText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#D4AF37",
    textAlign: "center",
  },
  dateContainer: {
    alignItems: "flex-end",
  },
  dateLabel: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  congratsText: {
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  downloadBtn: {
    backgroundColor: "#D4AF37",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 16,
  },
  printBtn: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
