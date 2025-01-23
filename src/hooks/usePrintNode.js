import { useState, useCallback } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

export const usePrintNode = () => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [print_Status, setPrint_Status] = useState(null);
  const [printerId] = useState(
    () => +localStorage.getItem("printer_code") || null
  );

  console.log(printerId);

  const printViaPrintNode = useCallback(async (content) => {
    setIsPrinting(true);
    setPrint_Status(null);

    // console.log(content);

    // Ensure content is a string
    if (typeof content !== "string") {
      alert("Invalid content type. Expected a string.");
      setIsPrinting(false);
      return;
    }

    const PRINTNODE_API_KEY = process.env.REACT_APP_PRINTNODE_API_KEY;
    const PRINTNODE_API_URL = "https://api.printnode.com/";

   
  const base64Content = content.replace(
    /^data:application\/pdf;[^;]*;base64,/,
    ""
  );

  const downloadPDF = (base64Data) => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64Data}`;
    link.download = 'download.pdf'; // You can customize the download file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  downloadPDF(base64Content);

    const printJob = {
      printerId: printerId,
      title: "Comanda",
      contentType: "pdf_base64",
      content: base64Content,
      source: "Comanda",
      options: {
        copies: 1,
        paper: "A4",
        dpi: "200",
      },
    };


    if (!printerId) {
      setIsPrinting(false);
      setPrint_Status({
        status: "error",
        message: "No se ha seleccionado un impresora",
      });
      alert("No se ha seleccionado un impresora");

      return;
    }

    setIsPrinting(false);

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
      setPrint_Status({
        status: "success",
        message: "Print job submitted successfully",
        details: response.data,
      });
    } catch (error) {
      //   console.error("Error submitting print job:", error);
      setPrint_Status({
        status: "error",
        message:
          "Error al enviar el trabajo de impresión: " +
          (error.response?.data?.message || error.message),
      });
      alert(
        "Error al enviar el trabajo de impresión: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsPrinting(false);
    }
  }, []);

  return { printViaPrintNode, isPrinting, print_Status };
};
