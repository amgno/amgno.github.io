// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let totalPages = 0;
const viewer = document.getElementById('pdf-viewer');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');

// Calculate optimal scale based on viewport
const calculateScale = (viewport) => {
    const containerHeight = window.innerHeight - 100; // Account for controls and padding
    const containerWidth = (window.innerWidth - 60) / 2; // Account for padding and gap between pages
    const scale = Math.min(
        containerHeight / viewport.height,
        containerWidth / viewport.width
    );
    return scale * 0.95; // Add a small margin
};

// Load the PDF file (replace with your PDF path)
const loadPDF = async (pdfPath = 'index.pdf') => {
    try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;
        totalPagesSpan.textContent = totalPages;
        renderPages();
    } catch (error) {
        console.error('Error loading PDF:', error);
        viewer.innerHTML = 'Error loading PDF. Please make sure the file exists and is accessible.';
    }
};

const renderPages = async () => {
    viewer.innerHTML = '';
    
    // Determine if we need to show one or two pages
    const isFirstPage = pageNum === 1;
    const isLastPage = pageNum === totalPages;
    const showDoublePage = !isFirstPage && !isLastPage;
    
    // Render current page
    const page1 = await pdfDoc.getPage(pageNum);
    const viewport1 = page1.getViewport({ scale: 1.0 });
    const scale = calculateScale(viewport1);
    const scaledViewport1 = page1.getViewport({ scale });
    
    const canvas1 = document.createElement('canvas');
    const context1 = canvas1.getContext('2d');
    
    canvas1.height = scaledViewport1.height;
    canvas1.width = scaledViewport1.width;
    canvas1.classList.add('pdf-page');
    
    await page1.render({
        canvasContext: context1,
        viewport: scaledViewport1
    }).promise;
    
    viewer.appendChild(canvas1);
    
    // Render second page if needed
    if (showDoublePage && pageNum < totalPages) {
        const page2 = await pdfDoc.getPage(pageNum + 1);
        const scaledViewport2 = page2.getViewport({ scale });
        
        const canvas2 = document.createElement('canvas');
        const context2 = canvas2.getContext('2d');
        
        canvas2.height = scaledViewport2.height;
        canvas2.width = scaledViewport2.width;
        canvas2.classList.add('pdf-page');
        
        await page2.render({
            canvasContext: context2,
            viewport: scaledViewport2
        }).promise;
        
        viewer.appendChild(canvas2);
    }
    
    currentPageSpan.textContent = pageNum;
    updateButtons();
};

const updateButtons = () => {
    prevButton.disabled = pageNum <= 1;
    nextButton.disabled = pageNum >= totalPages;
};

// Navigation handlers
prevButton.addEventListener('click', () => {
    if (pageNum <= 1) return;
    pageNum -= (pageNum === 2 ? 1 : 2);
    renderPages();
});

nextButton.addEventListener('click', () => {
    if (pageNum >= totalPages) return;
    pageNum += (pageNum === 1 ? 1 : 2);
    if (pageNum > totalPages) pageNum = totalPages;
    renderPages();
});

// Handle window resizing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        renderPages();
    }, 200);
});

// Initialize the viewer
loadPDF(); 