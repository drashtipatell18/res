import { useMemo, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

// ====pdf===
export const generateOrderReceipt = (cartItems, productData,tableId = 1, payment = {} ) => {
  
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "A4",
    putOnlyUsedFonts: true,
    floatPrecision: 16,
  });

  pdf.setFontSize(10);

  const centerX = 105;
  const margin = 20;

  const receiptData = {
    storeName: "CAFE CHOCO CHIP",
    cashier: localStorage.getItem("role"),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    items: cartItems.map((i) => {
      const product = productData.find((p) => p.id === i.id);
      return {
        description: product ? product.name : i.name,
        quantity: i.count,
        unitPrice: i.price,
        total: i.count * parseFloat(i.price),
      };
    }),
    masa: {
      masa: 1,
    },
  };

  const itemsTotal = receiptData.items.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const discount = parseFloat(1) || 0;
  const price = itemsTotal - discount;
  const iva = price * 0.19;
  const total = price + iva;

  // Start position for content
  let y = margin;

  // Header section - centered
  pdf.setFontSize(12); // Slightly larger for store name
  pdf.text(receiptData.storeName, centerX, y, { align: "center" });

  // Reset to default size
  pdf.setFontSize(10);
  y += 8;

  // Header info - left aligned
  pdf.text(`Cajero: ${receiptData.cashier}`, margin, y);
  y += 6;
  pdf.text(`Fecha: ${receiptData.date}`, margin, y);
  y += 6;
  pdf.text(`Hora: ${receiptData.time}`, margin, y);
  y += 6;

  // Separator
  const separatorLine = "------------------------------------------------";
  pdf.text(separatorLine, margin, y);
  y += 8;

  // Items section
  pdf.text("DESCRIPCIÓN          CANT    PRECIO    TOTAL", margin, y);
  y += 6;
  pdf.text(separatorLine, margin, y);
  y += 8;

  // Items list
  receiptData.items.forEach((item) => {
    const description = item.description.substring(0, 15).padEnd(15);
    const quantity = item.quantity.toString().padStart(3);
    const unitPrice = item.unitPrice;
    const total = item.total;

    pdf.text(`${description} ${quantity}  $${unitPrice}  $${total}`, margin, y);
    y += 6;
  });

  // Totals section
  pdf.text(separatorLine, margin, y);
  y += 8;

  // Right-aligned totals
  const totalsX = 170; // Right margin for totals
  pdf.text(`Subtotal: $${itemsTotal}`, totalsX, y, { align: "right" });
  y += 6;
  pdf.text(`Descuento: $${discount}`, totalsX, y, { align: "right" });
  y += 6;
  pdf.text(`IVA (19%): $${iva}`, totalsX, y, { align: "right" });
  y += 6;
  pdf.text(`Total: $${total}`, totalsX, y, { align: "right" });
  y += 8;

  // Footer section
  pdf.text(separatorLine, margin, y);
  y += 8;
  pdf.text(`Mesa: ${receiptData.masa.masa}`, margin, y);
  y += 6;

  // Customer info (if available)
  if (payment?.firstname || payment?.businessname) {
    pdf.text(
      `Cliente: ${payment?.firstname || payment?.businessname || "TestName"}`,
      margin,
      y
    );
    y += 6;
  }
  if (payment?.phone) {
    pdf.text(`Teléfono: ${payment.phone || "9876543210"}`, margin, y);
    y += 6;
  }
  if (payment?.email) {
    pdf.text(`Email: ${payment.email}`, margin, y);
    y += 6;
  }
  if (payment?.address) {
    pdf.text(`Dirección: ${payment.address}`, margin, y);
    y += 6;
  }

  // Thank you message
  y += 4;
  pdf.text("¡Gracias por su compra!", centerX, y, { align: "center" });

  return pdf.output("datauristring");
};

// print via PrintNode
export const printViaPrintNode = async (content, options = {}) => {
  const PRINTNODE_API_KEY = "apikey";
  const PRINTNODE_API_URL = "https://api.printnode.com/";

  const defaultOptions = {
    printerId: 73879141,
    copies: 1,
    paper: "A4",
    dpi: "200",
    title: "Order Receipt",
  };

  const mergedOptions = { ...defaultOptions, ...options };

  // Remove the data URI prefix to get just the base64 content
  const base64Content = content.replace(
    /^data:application\/pdf;filename=.*?;base64,/,
    ""
  );

  const printJob = {
    printerId: mergedOptions.printerId,
    title: mergedOptions.title,
    contentType: "pdf_base64",
    content: base64Content,
    source: "React App",
    options: {
      copies: mergedOptions.copies,
      paper: mergedOptions.paper,
      dpi: mergedOptions.dpi,
    },
  };

  try {
    const response = await axios.post(
      `${PRINTNODE_API_URL}printjobs`,
      printJob,
      {
        headers: {
          Authorization: `Basic ${btoa(PRINTNODE_API_KEY + ":")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error submitting print job:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// order printing
export const useOrderPrinting = (productionCenters, obj1, cartItems) => {
  const [printStatus, setPrintStatus] = useState({});

  const getprinter = useMemo(() => {
    return () => {
      const printers = productionCenters.map((productionCenter) => {
        
        const matchingItem = obj1.find((item) =>
          cartItems.some(
            (cartItem) =>
              cartItem.id === item.id &&
              item.production_center_id === productionCenter.id
          )
        );
      
        return matchingItem ? productionCenter.printer_code : null;
      });

      return printers.filter((printer) => printer !== null);
    };
  }, [productionCenters, obj1, cartItems]);

  const printOrder = async (cartItems, productData, tableId, payment = {}) => {
    try {
      const pdfBase64 = generateOrderReceipt(
        cartItems,
        productData,
        tableId,
        payment
      );

      const printers = getprinter();

      const printJobs = printers.map(async (printerId) => {
        try {
          const result = await printViaPrintNode(pdfBase64, { printerId });
          setPrintStatus((prev) => ({
            ...prev,
            [printerId]: {
              status: "success",
              message: "Print job submitted successfully",
              details: result,
            },
          }));
        } catch (err) {
          setPrintStatus((prev) => ({
            ...prev,
            [printerId]: {
              status: "error",
              message: `Failed: ${err.response?.data?.message || err.message}`,
            },
          }));
        }
      });

      // all print jobs simultaneously
      await Promise.allSettled(printJobs);

      return printStatus;
    } catch (err) {
      console.error("Error in printing receipt:", err);
      throw err;
    }
  };

  return { printOrder, printStatus };
};
