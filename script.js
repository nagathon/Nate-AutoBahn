const BUSINESS_NAME = "Shelly's Autoban Dealership";
const TAX_RATE = 0.08;

let items = [];

function addItem() {
    const itemName = document.getElementById('itemName').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!itemName || isNaN(price) || isNaN(quantity)) {
        alert('Please fill in all fields correctly');
        return;
    }

    const item = {
        name: itemName,
        price: price,
        quantity: quantity,
        total: price * quantity
    };

    items.push(item);
    updateReceipt();
    clearInputs();
}

function updateReceipt() {
    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = '';

    items.forEach(item => {
        itemsDiv.innerHTML += `
            <div class="item">
                <p>${item.name} x ${item.quantity} @ $${item.price.toFixed(2)} = $${item.total.toFixed(2)}</p>
            </div>
        `;
    });

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

function clearInputs() {
    document.getElementById('itemName').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';
}

function generateReceipt(event) {
    event.preventDefault();
    
    // Get form values
    const customerName = document.getElementById('tenantName').value;
    const vehicleDetails = document.getElementById('propertyAddress').value;
    const amount = document.getElementById('rentAmount').value;
    const paymentDate = document.getElementById('paymentDate').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    // Update receipt
    document.getElementById('businessName').textContent = BUSINESS_NAME;
    document.getElementById('displayCustomerName').textContent = customerName;
    document.getElementById('displayVehicleDetails').textContent = vehicleDetails;
    
    // Calculate amounts
    const subtotal = parseFloat(amount);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    
    document.getElementById('displaySubtotal').textContent = subtotal.toFixed(2);
    document.getElementById('displayTax').textContent = tax.toFixed(2);
    document.getElementById('displayTotal').textContent = total.toFixed(2);
    document.getElementById('displayPaymentMethod').textContent = paymentMethod;
    document.getElementById('displayPaymentDate').textContent = new Date(paymentDate).toLocaleDateString();
    document.getElementById('receiptDate').textContent = new Date().toLocaleDateString();
    
    // Show receipt with animation
    const receipt = document.getElementById('receipt');
    receipt.classList.add('visible');
    
    // Alert button name (as per requirements)
    alert('Generate Receipt button clicked');
}

function printReceipt() {
    window.print();
    alert('Print button clicked');
}

function saveReceipt() {
    const receipt = {
        customerName: document.getElementById('displayCustomerName').textContent,
        vehicleDetails: document.getElementById('displayVehicleDetails').textContent,
        amount: document.getElementById('displayTotal').textContent,
        paymentMethod: document.getElementById('displayPaymentMethod').textContent,
        paymentDate: document.getElementById('displayPaymentDate').textContent,
        date: new Date().toISOString(),
        id: Date.now().toString()
    };

    // Get existing receipts from localStorage
    let savedReceipts = JSON.parse(localStorage.getItem('savedReceipts') || '[]');
    savedReceipts.push(receipt);
    
    // Save to localStorage
    localStorage.setItem('savedReceipts', JSON.stringify(savedReceipts));
    
    alert('Receipt saved successfully!');
    loadSavedReceipts();
}

function loadSavedReceipts() {
    const savedReceipts = JSON.parse(localStorage.getItem('savedReceipts') || '[]');
    const receiptsList = document.getElementById('receiptsList');
    
    receiptsList.innerHTML = savedReceipts.length === 0 ? 
        '<p>No saved receipts</p>' : 
        savedReceipts.map(receipt => `
            <div class="saved-receipt-item">
                <div>
                    <strong>${receipt.customerName}</strong> - 
                    $${receipt.amount} - 
                    ${new Date(receipt.date).toLocaleDateString()}
                </div>
                <div>
                    <button onclick="viewReceipt('${receipt.id}')" class="print-btn">
                        <span class="material-icons">visibility</span>
                    </button>
                    <button onclick="deleteReceipt('${receipt.id}')" class="generate-btn">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
        `).join('');
}

function deleteReceipt(id) {
    if (confirm('Are you sure you want to delete this receipt?')) {
        let savedReceipts = JSON.parse(localStorage.getItem('savedReceipts') || '[]');
        savedReceipts = savedReceipts.filter(receipt => receipt.id !== id);
        localStorage.setItem('savedReceipts', JSON.stringify(savedReceipts));
        loadSavedReceipts();
    }
}

function viewReceipt(id) {
    const savedReceipts = JSON.parse(localStorage.getItem('savedReceipts') || '[]');
    const receipt = savedReceipts.find(r => r.id === id);
    
    if (receipt) {
        // Populate the receipt view with saved data
        document.getElementById('displayCustomerName').textContent = receipt.customerName;
        document.getElementById('displayVehicleDetails').textContent = receipt.vehicleDetails;
        document.getElementById('displayTotal').textContent = receipt.amount;
        document.getElementById('displayPaymentMethod').textContent = receipt.paymentMethod;
        document.getElementById('displayPaymentDate').textContent = receipt.paymentDate;
        
        // Show the receipt
        document.getElementById('receipt').classList.add('visible');
    }
}

// Clear previous form handlers
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('receiptForm');
    if (form) {
        form.addEventListener('submit', generateReceipt);
    }
    loadSavedReceipts();
});