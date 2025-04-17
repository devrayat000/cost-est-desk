import { useAtomValue } from "jotai";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { formAtom } from "@/app/app/store";
import { useMemo } from "react";

function formatPrice(num: number) {
  return new Intl.NumberFormat("en-us", {
    currency: "USD",
    currencySign: "standard",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(num);
}

export default function PrintingDocument() {
  const sections = useAtomValue(formAtom);

  const total = useMemo(() => {
    return sections.reduce((acc, section) => {
      return (
        acc +
        section.items.reduce((acc, item) => {
          return acc + (item.unitPrice ?? 0) * (item.quantity ?? 0);
        }, 0)
      );
    }, 0);
  }, [sections]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.pageTitle}>Cost Estimation Sheet</Text>
        </View>
        <View style={styles.sectionContainer}>
          {sections.map((section) => {
            return (
              <View key={section.code} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {section.code} - {section.name}
                </Text>
                <View style={styles.divider} />
                <View style={styles.subSection}>
                  {section.items.map((item) => {
                    return (
                      <View key={item.code} style={styles.itemContainer}>
                        <Text style={[styles.itemText, { flexBasis: 40 }]}>
                          {item.code}
                        </Text>
                        <Text style={[styles.itemText, { flexGrow: 1 }]}>
                          {item.description}
                        </Text>
                        <Text style={[styles.itemText, { flexBasis: 44 }]}>
                          {item.unit}
                        </Text>
                        <Text
                          style={[
                            styles.itemText,
                            styles.itemTextRight,
                            { flexBasis: 30 },
                          ]}
                        >
                          {new Intl.NumberFormat(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }).format(item.quantity ?? 0)}
                        </Text>
                        <Text
                          style={[
                            styles.itemText,
                            styles.itemTextRight,
                            { flexBasis: 40 },
                          ]}
                        >
                          ${formatPrice(item.unitPrice ?? 0)}
                        </Text>
                        <Text
                          style={[
                            styles.itemText,
                            styles.itemTextRight,
                            { flexBasis: 40 },
                          ]}
                        >
                          $
                          {formatPrice(
                            (item.quantity ?? 0) * (item.unitPrice ?? 0)
                          )}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.divider, { marginTop: 20 }]} />

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={[styles.totalText, styles.itemTextRight]}>
            ${formatPrice(total)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: "0.5in",
    backgroundColor: "white",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 700,
  },
  sectionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
    alignItems: "stretch",
  },
  section: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0078e7",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#a0a0a0",
    marginBottom: 8,
    marginTop: 4,
  },
  subSection: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  itemText: {
    fontSize: 8,
    color: "#000",
    flexShrink: 0,
    flexGrow: 0,
  },
  itemTextRight: {
    textAlign: "right",
  },
  totalContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  totalText: {
    fontSize: 12,
    color: "#000",
  },
});
