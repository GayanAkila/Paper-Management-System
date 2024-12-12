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
// Font.register({
//   family: "Montserrat",
//   src: "https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhzg.ttf",
// });

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 40,
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
    textAlign: "center",
    marginBottom: 20,
  },
  content: {
    marginTop: 20,
    lineHeight: 1.6,
  },
  date: {
    marginBottom: 20,
    fontSize: 12,
  },
  greeting: {
    marginBottom: 20,
    fontSize: 12,
  },
  paragraph: {
    marginBottom: 15,
    fontSize: 11,
    textAlign: "justify",
  },
  signature: {
    marginTop: 50,
  },
  signatureName: {
    fontSize: 12,
    marginBottom: 5,
  },
  signatureTitle: {
    fontSize: 10,
    color: "#666",
  },
  letterRef: {
    position: "absolute",
    bottom: 40,
    fontSize: 8,
    color: "#666",
  },
});

interface AppreciationLetterProps {
  reviewerName: string;
  reviewerId: string;
  reviewedPapers: { title: string; type: string }[];
  logoUrl: string;
}

const AppreciationLetter: React.FC<AppreciationLetterProps> = ({
  reviewerName,
  reviewerId,
  reviewedPapers,
  logoUrl,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src={logoUrl} style={styles.logo} />
        <Text style={styles.title}>Letter of Appreciation</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.date}>December 15, 2024</Text>

        <Text style={styles.greeting}>Dear {reviewerName},</Text>

        <Text style={styles.paragraph}>
          On behalf of the Business Information System Student Symposium
          (BISSS), we would like to express our sincere appreciation for your
          invaluable contribution as a reviewer. Your expertise and dedication
          have significantly enhanced the quality of our symposium.
        </Text>

        <Text style={styles.paragraph}>
          You have reviewed the following submissions:
        </Text>

        {reviewedPapers.map((paper, index) => (
          <Text key={index} style={[styles.paragraph, { marginLeft: 20 }]}>
            • {paper.title} ({paper.type})
          </Text>
        ))}

        <Text style={styles.paragraph}>
          Your thorough evaluations and constructive feedback have been
          instrumental in maintaining the high academic standards of our
          symposium. We greatly value your expertise and the time you have
          dedicated to reviewing these submissions.
        </Text>

        <Text style={styles.paragraph}>
          We look forward to your continued support and collaboration in future
          events.
        </Text>

        <View style={styles.signature}>
          <Text style={styles.signatureName}>Dr. Jane Smith</Text>
          <Text style={styles.signatureTitle}>
            Event Coordinator{"\n"}BISSS
          </Text>
        </View>
      </View>

      <Text style={styles.letterRef}>Reference: BISSS/AP/{reviewerId}</Text>
    </Page>
  </Document>
);

export default AppreciationLetter;
