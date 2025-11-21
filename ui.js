// ui.js - small UI helpers (button ripple, small interactions)
(function(){
  document.addEventListener('click', function(e){
    const btn = e.target.closest('button');
    if(!btn) return;

    // create ripple
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';

    const x = e.clientX - rect.left - size/2;
    const y = e.clientY - rect.top - size/2;
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    btn.appendChild(ripple);
    setTimeout(()=>{
      ripple.remove();
    }, 650);
  });
})();

/* ===== Checkout Functions ===== */
function handleCheckout(event) {
    event.preventDefault();
    
    // In a real application, this would send the data to a server
    // For demo purposes, store checkout data and redirect to invoice
    const checkoutData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        parish: document.getElementById('parish').value,
        amount: document.getElementById('amount').value,
        cardName: document.getElementById('cardName').value,
        cardNumber: document.getElementById('cardNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value
    };
    
    // Use sessionStorage as fallback for better free hosting compatibility
    try {
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    } catch (e) {
        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    }
    alert('Order placed successfully!');
    window.location.href = 'invoice.html';
}

function clearForm() {
    document.getElementById('checkoutForm').reset();
}

// Load cart summary from localStorage or other source
function loadOrderSummary() {
    const summaryContent = document.querySelector('.summary-content');
    // This would normally come from localStorage or a backend
    const summary = {
        subtotal: 205000.00,
        discount: 20500.00,
        tax: 14760.00,
        total: 199260.00
    };

    summaryContent.innerHTML = `
        <div class="summary-item">
            <span>Subtotal:</span>
            <span>$${summary.subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Discount (10%):</span>
            <span>$${summary.discount.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Tax (8%):</span>
            <span>$${summary.tax.toFixed(2)}</span>
        </div>
        <div class="summary-item total">
            <span>Total:</span>
            <span>$${summary.total.toFixed(2)}</span>
        </div>
    `;
}

/* ===== Invoice Functions ===== */
function generateInvoiceNumber() {
    return 'INV-' + Date.now();
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
}

function loadInvoice() {
    // Try localStorage first, then sessionStorage
    let cartItems = [];
    try {
        cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (e) {
        cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
    }
    
    if (cartItems.length === 0) {
        document.getElementById('invoiceItemsBody').innerHTML = '<tr><td colspan="4">No items in cart</td></tr>';
        return;
    }

    const invoiceNumber = generateInvoiceNumber();
    const invoiceDate = formatDate(new Date());

    document.getElementById('invoiceNumber').textContent = invoiceNumber;
    document.getElementById('invoiceDate').textContent = invoiceDate;

    let subtotal = 0;
    let invoiceHTML = '';

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        invoiceHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    document.getElementById('invoiceItemsBody').innerHTML = invoiceHTML;

    const discount = subtotal * 0.1; // 10% discount
    const subtotalAfterDiscount = subtotal - discount;
    const tax = subtotalAfterDiscount * 0.08; // 8% tax
    const total = subtotalAfterDiscount + tax;

    document.getElementById('invoiceSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('invoiceDiscount').textContent = `$${discount.toFixed(2)}`;
    document.getElementById('invoiceSubtotalAfterDiscount').textContent = `$${subtotalAfterDiscount.toFixed(2)}`;
    document.getElementById('invoiceTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('invoiceTotal').textContent = `$${total.toFixed(2)}`;
}

function printInvoice() {
    window.print();
}

function downloadInvoice() {
    const element = document.querySelector('.invoice-section');
    const opt = {
        margin: 10,
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    // Note: html2pdf library needs to be included in the styles.css or a separate script tag
    alert('Invoice download functionality requires html2pdf library. Please use the print feature instead.');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('checkoutForm')) {
        loadOrderSummary();
    }
    if (document.getElementById('invoiceItemsBody')) {
        loadInvoice();
    }
});
