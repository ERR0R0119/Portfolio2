// Complete Text Copy Protection with Enhanced Security
class CopyProtection {
    constructor() {
        this.isEnabled = true;
        this.init();
    }
    
    init() {
        this.createOverlay();
        this.setupEventListeners();
        this.setupSelectionProtection();
        this.setupPrintProtection();
        this.setupLinkProtection();
        this.setupKeyboardProtection();
        this.setupRightClickProtection();
        this.setupDevToolsProtection();
        console.log('🔒 Enhanced copy protection activated');
    }
    
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'copy-protection-overlay';
        overlay.innerHTML = `
            <div class="copy-protection-message">
                <h3>🔒 Content Protected</h3>
                <p>This content is protected against copying.</p>
                <button class="copy-protection-btn" onclick="this.parentElement.parentElement.classList.remove('active')">
                    Understand
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }
    
    setupEventListeners() {
        // Copy detection - BLOCK COMPLETELY
        document.addEventListener('copy', (e) => this.handleCopy(e));
        document.addEventListener('cut', (e) => this.handleCopy(e));
        document.addEventListener('paste', (e) => this.handlePaste(e));
        
        // Continuous selection clearing
        setInterval(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString();
            
            // Don't clear selection if it's within a form field
            const activeElement = document.activeElement;
            const isFormField = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA'
            );
            
            if (selectedText.length > 5 && !isFormField) {
                selection.removeAllRanges();
            }
        }, 100);
    }
    
    setupSelectionProtection() {
        // Block selection start
        document.addEventListener('selectstart', (e) => {
            // Allow selection in form fields
            const isFormField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
            if (isFormField) {
                return true;
            }
            e.preventDefault();
            return false;
        });
        
        // Clear selection on mouse up
        document.addEventListener('mouseup', () => {
            setTimeout(() => {
                const activeElement = document.activeElement;
                const isFormField = activeElement && (
                    activeElement.tagName === 'INPUT' || 
                    activeElement.tagName === 'TEXTAREA'
                );
                
                if (!isFormField) {
                    window.getSelection().removeAllRanges();
                }
            }, 50);
        });
        
        // Block drag selection
        document.addEventListener('mousedown', (e) => {
            const isFormField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
            if (e.shiftKey && !isFormField) {
                e.preventDefault();
                return false;
            }
        });
    }
    
    setupPrintProtection() {
        // Block Ctrl+P and browser print
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                this.showNotification('🚫 Printing disabled - Content protected with watermark');
                return false;
            }
        });
        
        // Block right-click print
        window.addEventListener('beforeprint', (e) => {
            this.showNotification('🚫 Printing disabled - Watermark applied');
        });
        
        // Override print function
        window.print = function() {
            console.log('🚫 Print function disabled');
            alert('Printing disabled - © 2025 Loh Hao Wei Portfolio - Protected Content');
            return false;
        };
        
        // Add PDF watermark overlay
        const watermark = document.createElement('div');
        watermark.className = 'watermark-overlay';
        watermark.style.cssText = 'display: none;';
        document.body.appendChild(watermark);
    }
    
    setupLinkProtection() {
        // Prevent link dragging but keep them clickable
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'IMG') {
                e.preventDefault();
                return false;
            }
        });
    }
    
    setupKeyboardProtection() {
        document.addEventListener('keydown', (e) => {
            // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
                this.showNotification('🚫 Developer tools disabled');
                return false;
            }
            
            // Block Ctrl+S (Save Page)
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.showNotification('🚫 Page saving disabled');
                return false;
            }
        });
        
        // Block context menu key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ContextMenu') {
                e.preventDefault();
                return false;
            }
        });
    }
    
    setupRightClickProtection() {
        // Block right-click context menu
        document.addEventListener('contextmenu', (e) => {
            // Allow right-click in form fields
            const isFormField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
            if (isFormField) {
                return true;
            }
            e.preventDefault();
            this.showNotification('🚫 Right-click disabled');
            return false;
        });
        
        // Block long press on touch devices
        document.addEventListener('touchstart', (e) => {
            // Allow long press in form fields
            const isFormField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
            if (isFormField) {
                return;
            }
            this.touchTimer = setTimeout(() => {
                e.preventDefault();
                this.showNotification('🚫 Long press disabled');
            }, 500);
        });
        
        document.addEventListener('touchend', () => {
            clearTimeout(this.touchTimer);
        });
    }
    
    setupDevToolsProtection() {
        // Detect DevTools opening
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: () => {
                this.showNotification('🚫 Developer tools detected');
                return true;
            }
        });
        
        console.log('%c', element);
        
        // Detect DevTools resize
        const threshold = 160;
        const checkDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                this.showNotification('🚫 Developer tools detected');
            }
        };
        
        setInterval(checkDevTools, 1000);
    }
    
    handleCopy(event) {
        if (!this.isEnabled) return;
        
        const selection = window.getSelection().toString();
        // Allow copying from form fields
        const isFormField = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA';
        
        if (selection.length > 5 && !isFormField) {
            // BLOCK COPYING COMPLETELY
            event.preventDefault();
            
            this.showOverlay();
            this.showNotification('🚫 Copying disabled');
            
            // Log the copy event
            if (window.copyAnalytics) {
                window.copyAnalytics.trackCopy(selection);
            }
            
            console.log('📋 Copy blocked:', selection.substring(0, 50) + '...');
        }
    }
    
    handlePaste(event) {
        if (!this.isEnabled) return;
        
        // Allow pasting in form fields
        const isFormField = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA';
        
        if (!isFormField) {
            event.preventDefault();
            this.showNotification('🚫 Pasting disabled');
            return false;
        }
    }
    
    showOverlay() {
        if (this.overlay) {
            this.overlay.classList.add('active');
            setTimeout(() => {
                this.overlay.classList.remove('active');
            }, 3000);
        }
    }
    
    showNotification(message) {
        const existing = document.querySelector('.copy-tracking-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'copy-tracking-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('active'), 100);
        
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Disable for debugging
    disable() {
        this.isEnabled = false;
        console.log('🔓 Copy protection disabled');
    }
    
    enable() {
        this.isEnabled = true;
        console.log('🔒 Copy protection enabled');
    }
}

// Initialize
const copyProtection = new CopyProtection();
window.copyProtection = copyProtection;

// Additional protection against iframe embedding
if (window.self !== window.top) {
    window.top.location = window.self.location;
}

// Fix: Completely exclude form fields from protection
document.addEventListener('DOMContentLoaded', function() {
    // Remove any protection from form elements
    const formElements = document.querySelectorAll('input, textarea, .form-group input, .form-group textarea');
    formElements.forEach(element => {
        element.style.userSelect = 'text';
        element.style.webkitUserSelect = 'text';
        element.style.mozUserSelect = 'text';
        element.style.msUserSelect = 'text';
        element.style.pointerEvents = 'auto';
    });
});
