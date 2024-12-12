import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "Montserrat",
  src: "https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhzg.ttf",
});

// A4 Landscape dimensions in points (595.28 x 841.89)
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    width: "841.89pt",
    height: "595.28pt",
    padding: 0,
  },
  container: {
    margin: 40,
    flex: 1,
    position: "relative",
  },
  border: {
    border: "2 solid #1976d2",
    padding: 40,
    height: "515.28pt", // Page height - 2 * margin
    position: "relative",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#1976d2",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#1976d2",
    textAlign: "center",
  },
  content: {
    textAlign: "center",
    marginTop: 20,
  },
  pretext: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
    color: "#000",
  },
  name: {
    fontSize: 20,
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 12,
    textAlign: "center",
    color: "#000",
    lineHeight: 1.5,
  },
  descriptionBold: {
    fontSize: 12,
    textAlign: "center",
    color: "#1976d2",
    lineHeight: 1.5,
  },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 60,
    left: 60,
    right: 60,
  },
  signatureBlock: {
    width: "40%",
    alignItems: "center",
  },
  signatureLine: {
    width: 180,
    borderBottom: "1 solid #000",
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 12,
    marginBottom: 3,
    textAlign: "center",
  },
  signatureTitle: {
    fontSize: 10,
    color: "#000",
    textAlign: "center",
  },
  certId: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 8,
    color: "#666",
  },
});

interface CertificateDocumentProps {
  authorName: string;
  submissionType: string;
  submissionId: string;
  logoUrl: string;
}

const CertificateDocument: React.FC<CertificateDocumentProps> = ({
  authorName,
  submissionType,
  submissionId,
  logoUrl,
}) => (
  <Document>
    <Page size={[841.89, 595.28]} style={styles.page}>
      <View style={styles.container}>
        <View style={styles.border}>
          <View style={styles.header}>
            <Image src={logoUrl} style={styles.logo} />
            <Text style={styles.title}>Certificate of Participation</Text>
            <Text style={styles.subtitle}>
              Business Information System Student Symposium
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.pretext}>This is to certify that</Text>
            <Text style={styles.name}>{authorName}</Text>
            <Text style={styles.description}>
              has participated in the{"\n"}
              <Text style={styles.descriptionBold}>
                Business Information System Student Symposium (BISSS)
              </Text>
              {"\n"}held on December 15, 2024 as a{" "}
              {submissionType === "Research Paper"
                ? "Research Paper Author"
                : "Project Author"}
            </Text>
            <Text style={[styles.description, { marginTop: 15 }]}>
              We appreciate their valuable contribution to the success of this
              symposium.
            </Text>
          </View>

          <View style={styles.signatures}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>Prof. John Doe</Text>
              <Text style={styles.signatureTitle}>
                Dean{"\n"}
                Faculty of Management Studies and Commerce
              </Text>
            </View>

            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>Dr. Jane Smith</Text>
              <Text style={styles.signatureTitle}>
                Event Coordinator{"\n"}
                BISSS
              </Text>
            </View>
          </View>

          <Text style={styles.certId}>Certificate ID: {submissionId}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default CertificateDocument;
