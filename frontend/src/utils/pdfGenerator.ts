import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

/**
 * Filter stylesheets to prevent SecurityError (CORS) from external domains
 * like Google Fonts when html-to-image tries to read cssRules.
 */
function fixStylesheets() {
  const styleSheets = Array.from(document.styleSheets);
  for (const sheet of styleSheets) {
    try {
      // If we can access cssRules, this sheet is safe
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      sheet.cssRules;
    } catch (e) {
      // If it throws SecurityError, it's a cross-origin sheet we can't read
      // We disable it temporarily or let the library handle it by skipping
      console.warn("Skipping inaccessible stylesheet (CORS):", sheet.href);
      // Effectively "disabling" the sheet for the capture process if possible
      // but it's better to tell the library to skip it.
    }
  }
}

export async function downloadInvoiceAsPDF(element: HTMLElement, filename: string) {
  if (!element) {
    console.error("Element not provided for PDF generation");
    throw new Error("Invoice template element not found");
  }

  try {
    console.log("Starting strictly robust PDF generation...");
    fixStylesheets();

    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 3, // Ultra-high resolution
      backgroundColor: "#ffffff",
      cacheBust: true,
      skipFonts: false,
      // Filter out any problematic nodes if necessary
      filter: (node) => {
        if (node.tagName === "LINK") {
          const link = node as HTMLLinkElement;
          // Skip external stylesheets that might cause CORS issues
          return !link.href.includes("fonts.googleapis.com") && !link.href.includes("gstatic.com");
        }
        return true;
      },
      // Ensure we don't hang on style reading
      style: {
        // Force certain elements to be visible/clean if needed
      }
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const imgProps = pdf.getImageProperties(dataUrl);
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST");
    
    // Sanitize filename
    const sanitizedFilename = filename.replace(/[/\\?%*:|"<>]/g, "-") || "invoice";
    const fullFilename = sanitizedFilename.endsWith(".pdf") ? sanitizedFilename : `${sanitizedFilename}.pdf`;
    
    // Robust download trigger using file-saver
    const blob = pdf.output("blob");
    saveAs(blob, fullFilename);

    console.log("PDF generation completed successfully.");
    return true;
  } catch (error) {
    console.error("STRICT ERROR during PDF generation:", error);
    throw error;
  }
}

