import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";



// ====download===
// Utility function to trigger PDF download
const downloadPDF = (pdfBase64, filename = 'order-receipt.pdf') => {
  // Convert base64 to blob
  const binaryString = window.atob(pdfBase64.split(',')[1]);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'application/pdf' });

  // Create download link
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
};

// ====pdf===
// export const generateOrderReceipt = (cartItems, tableId = '', payment = {} ) => {
  
//   const pdf = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: "A4",
//     putOnlyUsedFonts: true,
//     floatPrecision: 16,
//   });

//   pdf.setFontSize(10);

//   const centerX = 105;
//   const margin = 20;

//   const receiptData = {
//     storeName: "CAFE CHOCO CHIP",
//     cashier: localStorage.getItem("role"),
//     date: new Date().toLocaleDateString(),
//     time: new Date().toLocaleTimeString(),
//     items: cartItems.map((i) => {
//       return {
//         description: i.name,
//         quantity: i.count,
//         unitPrice: i.price,
//         total: i.count * parseFloat(i.price),
//       };
//     }),
//     masa: {
//       masa: tableId ? tableId : "",
//     },
//   };

//   const itemsTotal = receiptData.items.reduce(
//     (sum, item) => sum + item.total,
//     0
//   );
//   const discount = parseFloat(1) || 0;
//   const price = itemsTotal - discount;
//   const iva = price * 0.19;
//   const total = price + iva;

//   // Start position for content
//   let y = margin;

//   // Header section - centered
//   pdf.setFontSize(12); // Slightly larger for store name
//   pdf.text(receiptData.storeName, centerX, y, { align: "center" });

//   // Reset to default size
//   pdf.setFontSize(10);
//   y += 8;

//   // Header info - left aligned
//   pdf.text(`Cajero: ${receiptData.cashier}`, margin, y);
//   y += 6;
//   pdf.text(`Fecha: ${receiptData.date}`, margin, y);
//   y += 6;
//   pdf.text(`Hora: ${receiptData.time}`, margin, y);
//   y += 6;

//   // Separator
//   const separatorLine = "------------------------------------------------";
//   pdf.text(separatorLine, margin, y);
//   y += 8;

//   // Items section
//   pdf.text("DESCRIPCIÓN          CANT    PRECIO    TOTAL", margin, y);
//   y += 6;
//   pdf.text(separatorLine, margin, y);
//   y += 8;

//   // Items list
//   receiptData.items.forEach((item) => {
//     const description = item.description.substring(0, 15).padEnd(15);
//     const quantity = item.quantity.toString().padStart(3);
//     const unitPrice = item.unitPrice;
//     const total = item.total;

//     pdf.text(`${description} ${quantity}  $${unitPrice}  $${total}`, margin, y);
//     y += 6;
//   });

//   // Totals section
//   pdf.text(separatorLine, margin, y);
//   y += 8;

//   // Right-aligned totals
//   const totalsX = 170; // Right margin for totals
//   pdf.text(`Subtotal: $${itemsTotal}`, totalsX, y, { align: "right" });
//   y += 6;
//   pdf.text(`Descuento: $${discount}`, totalsX, y, { align: "right" });
//   y += 6;
//   pdf.text(`IVA (19%): $${iva}`, totalsX, y, { align: "right" });
//   y += 6;
//   pdf.text(`Total: $${total}`, totalsX, y, { align: "right" });
//   y += 8;

//   // Footer section
//   pdf.text(separatorLine, margin, y);
//   y += 8;
//   pdf.text(`Mesa: ${receiptData.masa.masa}`, margin, y);
//   y += 6;

//   // Customer info (if available)
//   if (payment?.firstname || payment?.businessname) {
//     pdf.text(
//       `Cliente: ${payment?.firstname || payment?.businessname || "TestName"}`,
//       margin,
//       y
//     );
//     y += 6;
//   }
//   if (payment?.phone) {
//     pdf.text(`Teléfono: ${payment.phone || "9876543210"}`, margin, y);
//     y += 6;
//   }
//   if (payment?.email) {
//     pdf.text(`Email: ${payment.email}`, margin, y);
//     y += 6;
//   }
//   if (payment?.address) {
//     pdf.text(`Dirección: ${payment.address}`, margin, y);
//     y += 6;
//   }

//   // Thank you message
//   y += 4;
//   pdf.text("¡Gracias por su compra!", centerX, y, { align: "center" });

//   return pdf.output("datauristring");
// };

// const generateOrderReceipt =  ( cartItems, tableId = '', payment = {} ) => {

// // console.log(cartItems,Array.isArray(cartItems));

//     // Initialize PDF
//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     // Set initial position
//     let yPos = 20;
//     const leftMargin = 20;
//     const pageWidth = 210;
//     doc.setFontSize(12);

//     // Header
//     doc.setFont("helvetica", "bold");
//     doc.text("CAFE CHOCO CHIP", pageWidth / 2, yPos, { align: "center" });
//     yPos += 6;
    
//     doc.setFontSize(10);
//     doc.text("0998809875001", pageWidth / 2, yPos, { align: "center" });
//     yPos += 6;
//     doc.text("Sucursal: Guayaquil", pageWidth / 2, yPos, { align: "center" });
//     yPos += 6;
//     doc.text("Telefono: 9999999", pageWidth / 2, yPos, { align: "center" });
//     yPos += 8;

//     // FAC details
//     doc.text("FAC #:152-045-000000001", pageWidth / 2, yPos, { align: "center" });
//     yPos += 6;
//     doc.text("Ambiente: Produccion", pageWidth / 2, yPos, { align: "center" });
//     yPos += 6;
//     doc.text("Emision: Normal", pageWidth / 2, yPos, { align: "center" });
//     yPos += 8;

//     // Authorization
//     doc.setFontSize(9);
//     doc.text("No. de autorizacion/Clave de acceso", pageWidth / 2, yPos, { align: "center" });
//     yPos += 6;
//     doc.text("166202202109988098750012152045000000001000000815", pageWidth / 2, yPos, { align: "center" });
//     yPos += 6;
//     doc.text("REIMPRESION", pageWidth / 2, yPos, { align: "center" });
//     yPos += 8;

//     // Receipt details
//     doc.setFont("helvetica", "normal");
//     doc.text(`Cajero: Admin`, leftMargin, yPos);
//     yPos += 6;
//     const currentDate = new Date();
//     doc.text(`Fecha: ${currentDate.toLocaleDateString()}`, leftMargin, yPos);
//     doc.text(`Hora: ${currentDate.toLocaleTimeString()}`, 150, yPos);
//     yPos += 6;
//     doc.text("Cliente:", leftMargin, yPos);
//     yPos += 6;
//     doc.text("Email:", leftMargin, yPos);
//     yPos += 6;
//     doc.text("Telefono:", leftMargin, yPos);
//     yPos += 6;
//     doc.text("Direccion:", leftMargin, yPos);
//     yPos += 6;
//     doc.text("Cedula/RUC:", leftMargin, yPos);
//     yPos += 8;

//     // Table headers
//     doc.setDrawColor(0);
//     doc.line(leftMargin, yPos, 190, yPos);
//     yPos += 6;
//     doc.setFont("helvetica", "bold");
//     doc.text("DESCRIP", leftMargin, yPos);
//     doc.text("CANT", 100, yPos);
//     doc.text("P UNIT", 130, yPos);
//     doc.text("P TOTAL", 160, yPos);
//     yPos += 2;
//     doc.line(leftMargin, yPos, 190, yPos);
//     yPos += 6;
//     // console.log("-1");


//     // Add items
//     doc.setFont("helvetica", "normal");
//     if (Array.isArray(cartItems)) {
//       cartItems.forEach(item => {
//         doc.text(item?.name || " ", leftMargin, yPos);
//         yPos += 6; // Move down for the note
//         doc.text(`Note: ${item.note || item.notes || 'N/A'}`, leftMargin, yPos); // Add note below the name
//         doc.text((item.count || item.quantity).toString(), 100, yPos);
//         doc.text(`$ ${parseFloat(item.price || item.amount).toFixed(2)}`, 130, yPos);
//         doc.text(`$ ${(parseFloat(item.price || item.amount) * (item.count || item.quantity)).toFixed(2)}`, 160, yPos);
//         yPos += 6;
//       });
//     }
//     // console.log("-0");

//     // Calculate totals
//     const subtotal = Array.isArray(cartItems)
//       ? cartItems.reduce((sum, item) => sum + (parseFloat(item.price || item.amount) * (item.count||item.quantity)), 0)
//       : 0
    
//     const iva = subtotal * 0.19;
//     const total = subtotal + iva + 1; // Adding $1 for Dcto
//     // console.log("0");
//     // Add totals
//     yPos += 4;
//     doc.line(leftMargin, yPos, 190, yPos);
//     yPos += 6;
//     doc.text(`Subtotal IVA:`, 120, yPos);
//     doc.text(`$ ${subtotal.toFixed(2)}`, 160, yPos);
//     yPos += 6;
//     doc.text(`Subtotal 0%:`, 120, yPos);
//     doc.text(`$ 0.00`, 160, yPos);
//     yPos += 6;
//     doc.text(`Dcto:`, 120, yPos);
//     doc.text(`$ 1.00`, 160, yPos);
//     yPos += 6;
//     doc.text(`IVA 19.00%:`, 120, yPos);
//     doc.text(`$ ${iva.toFixed(2)}`, 160, yPos);
//     yPos += 6;
//     doc.setFont("helvetica", "bold");
//     doc.text(`Total:`, 120, yPos);
//     doc.text(`$ ${total.toFixed(2)}`, 160, yPos);
//     yPos += 10;

//     // Payment details
//     doc.setFont("helvetica", "normal");
//     doc.text("Forma de pago:", leftMargin, yPos);
//     yPos += 6;
//     doc.text("Efectivo", leftMargin, yPos);
//     yPos += 8;
// // console.log("1");

//     if (payment) {
//       doc.text(`Recibido: ${payment.received}    Cambio: ${payment.change}`, leftMargin, yPos);
//     }
//     yPos += 12;
//     // console.log("2")

//     // Footer
//     doc.setFontSize(8);
//     const footerText1 = "Consulte sus documentos electronicos ingresando a bandejainline.comfitco.com si es la primera vez";
//     const footerText2 = "que accede, por favor registrese con su identificacion y correo electronico.";
//     doc.text(footerText1, pageWidth / 2, yPos, { align: "center" });
//     yPos += 4;
//     doc.text(footerText2, pageWidth / 2, yPos, { align: "center" });

//     // Convert to base64

//     const base64String = doc.output('datauristring');
//     // console.log(base64String);
    
//    return base64String// Remove the data URI prefix
// };

const generateOrderReceipt = (cartItems, tableId = '', role,name,orderId,productionName ) => {

  const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [58, 210]  // Width of 58mm and a flexible height
  });

  const roleData = {
    admin: "Admin",
    cashier: "Cajero",
    waitress: "Garzón	"
  }

  let yPos = 2;  // Start closer to the top of the receipt
  const leftMargin = 1;  // Reduce margin for thermal printers
  const pageWidth = 58;

  doc.setFontSize(8);  // Smaller font size for thermal printers
  doc.setFont("courier", "normal");  // Use a monospaced font for better alignment

  // Header

  yPos += 4
  doc.setFont("courier", "bold");
  doc.text("**** CAFE CHOCO CHIP ****", pageWidth / 2, yPos, { align: "center" });
  doc.setFont("courier", "normal");
  yPos += 4;

  doc.setFontSize(7)
  // Table and Order Details
  doc.text(`Mesa: ${tableId || "-"} ${"         "} Número: ${orderId || '-'}`, leftMargin, yPos);
  yPos += 3;
  doc.text(`Fecha:${new Date().toLocaleDateString()} ${"    "} Hora: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`, leftMargin, yPos);
    yPos += 3;
  doc.text(`${roleData[role]} ${':'} ${name}`, leftMargin, yPos);
  yPos += 3;
  doc.text(`Centro de producción:${productionName}`, leftMargin, yPos);
  yPos += 4;

  // Items Header
  doc.setFont("courier", "bold");
  const colWidths = {
    qty: 8,    // Width for quantity column
    name: 45   // Width for product name column
  };
  
  doc.text("CANT", leftMargin, yPos);
  doc.text("PRODUCTO", leftMargin + colWidths.qty, yPos);
  doc.setFont("courier", "normal");
  yPos += 1;
  doc.line(leftMargin, yPos, pageWidth - leftMargin, yPos, "D");  // Draw a dashed line
  yPos += 3;

  // Items
  cartItems.forEach(item => {
    // Quantity column (right-aligned within its column)
    const qty = (item.count || item.quantity).toString().padStart(2);
    doc.text(qty, leftMargin + colWidths.qty - 4, yPos, { align: "right" });
    
    // Product name column (left-aligned)
    doc.text(item.name, leftMargin + colWidths.qty, yPos);
    yPos += 3;  // Space between name and note
    
    // Note below the product name (if exists)
    let note = item.note || item.notes;
    if (note && note.startsWith('Nota:')) {
      note = note.replace('Nota:', '');
    }
    if (note && note !== 'N/A') {
      doc.setFontSize(6);  // Smaller font for the note
      let lines = doc.splitTextToSize(`Nota: ${note}`, colWidths.name);
      for (let i = 0; i < lines.length; i++) {
        doc.text(lines[i], leftMargin + colWidths.qty, yPos);
        yPos += 2;  // Additional space after each line of the note
      }
      doc.setFontSize(7);  // Reset font size
    }
    
    yPos += 2;  // Space between items
  });
  // Footer
  doc.line(leftMargin, yPos, pageWidth - leftMargin, yPos, "D");
  yPos += 3;
  // doc.text("Gracias por su visita!", pageWidth / 2, yPos, { align: "center" });

  return doc.output('datauristring');  // Output as base64 string
};

export default generateOrderReceipt;


// print via PrintNode
export const printViaPrintNode = async (content,printerId) => {
  const PRINTNODE_API_KEY = process.env.REACT_APP_PRINTNODE_API_KEY;
  const PRINTNODE_API_URL = "https://api.printnode.com/";

  // console.log(printerId);

  const defaultOptions = {
    // printerId,
    printerId,
    copies: 1,
    dpi: "203", // Standard thermal printer DPI
    title: "Order Receipt",
  };

  const mergedOptions = { ...defaultOptions };

  const base64Content = content.replace(
    /^data:application\/pdf;.*?base64,/,
    ""
  );

  // console.log(base64Content);

  const printJob = {
    printerId: mergedOptions.printerId,
    title: mergedOptions.title,
    contentType: "pdf_base64",
    content: base64Content,
    source: "Comanda",
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
export const useOrderPrinting = (productionCenters, cartItems) => {

  const [role] = useState(localStorage.getItem("role"))
  const [name] = useState(localStorage.getItem("name"))
  // console.log(cartItems,productionCenters);
  // console.log("asasas",cartItems)
  const [printStatus, setPrintStatus] = useState({});

  const getPrinter = useCallback(() => {
  
    const updatedItems = cartItems.map((item) => {
      const matchingCenter = productionCenters.find(
        (center) => center.id === item.production_center_id
      );
  
      if (!matchingCenter) return item; 
  
      return {
        ...item,
        printerId: matchingCenter.printer_code,
      };
    });
  
    // console.log(updatedItems);
  
    const printers = updatedItems
      .map((item) => item.production_center_id)
      .filter((id) => id !== undefined);
  
    return {
      updatedItems, 
      printers: [...new Set(printers)], 
    };
  }, [cartItems, productionCenters]);

  const printOrder = async (cartItems, tableId ='',order_id) => {
    try {
      

      const {printers, updatedItems} = getPrinter();
      const printJobs = printers.map(async (printers) => {


        // console.log(printers);
        // console.log(updatedItems.filter((item) => item.printerId === printers));
        
        const cartdata = updatedItems.filter((item) => item.production_center_id === printers);
        // console.log(cartdata,tableId);
        const production = productionCenters.find(v => v.id === printers);
        const pdfBase64 = generateOrderReceipt(cartdata, tableId, role,name,order_id,production.name);
        // console.log(pdfBase64);
        // 
        // downloadPDF(pdfBase64, `order-receipt-${production.printer_code}.pdf`);

        try {
          const result = await printViaPrintNode(pdfBase64,  production.printer_code );
          setPrintStatus((prev) => ({
            ...prev,
            [production.name]: {
              status: "success",
              message: "Print job submitted successfully",
              details: result,
            },
          }));
        } catch (err) {
          setPrintStatus((prev) => ({
            ...prev,
            [production.name]: {
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
