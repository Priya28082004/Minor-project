class BankApp {
    constructor() {
        this.balance = 0;
        this.transactions = [];
        this.currencyFormatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        });

        this.initElements();
        this.addEventListeners();
        this.updateUI();
    }

    initElements() {
        this.balanceCard = document.querySelector('.balance-card');
        this.balanceDisplay = document.getElementById('balance-amount');
        this.depositForm = document.getElementById('deposit-form');
        this.depositInput = document.getElementById('deposit-input');
        this.withdrawForm = document.getElementById('withdraw-form');
        this.withdrawInput = document.getElementById('withdraw-input');
        this.transactionList = document.getElementById('transaction-list');
        this.withdrawError = document.getElementById('withdraw-error');
    }

    addEventListeners() {
        this.depositForm.addEventListener('submit', (e) => this.handleDeposit(e));
        this.withdrawForm.addEventListener('submit', (e) => this.handleWithdraw(e));
        
        // Clear error on input focus
        this.withdrawInput.addEventListener('focus', () => {
            this.withdrawError.style.display = 'none';
        });
    }

    handleDeposit(e) {
        e.preventDefault();
        const amount = parseFloat(this.depositInput.value);
        
        if (amount > 0) {
            this.balance += amount;
            this.addTransaction('deposit', amount);
            this.depositInput.value = '';
            this.updateUI();
        }
    }

    handleWithdraw(e) {
        e.preventDefault();
        const amount = parseFloat(this.withdrawInput.value);
        
        if (amount <= 0 || isNaN(amount)) return;

        if (amount > this.balance) {
            this.showError('Insufficient funds!');
            return;
        }

        this.balance -= amount;
        this.addTransaction('withdraw', amount);
        this.withdrawInput.value = '';
        this.updateUI();
    }

    addTransaction(type, amount) {
        const transaction = {
            id: Date.now().toString(),
            type,
            amount,
            date: new Date()
        };
        
        // Add to beginning of array
        this.transactions.unshift(transaction);
        
        // Keep only last 50 transactions to prevent memory bloat
        if(this.transactions.length > 50) {
            this.transactions.pop();
        }
    }

    showError(msg) {
        this.withdrawError.textContent = msg;
        this.withdrawError.style.display = 'block';
    }

    formatDate(date) {
        const today = new Date();
        const isToday = date.getDate() === today.getDate() && 
                        date.getMonth() === today.getMonth() && 
                        date.getFullYear() === today.getFullYear();
        
        if (isToday) {
            return `Today, ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    updateUI() {
        // Animate balance scaling up momentarily
        this.balanceCard.style.transform = 'scale(1.02)';
        setTimeout(() => {
            this.balanceCard.style.transform = 'scale(1)';
        }, 150);
        
        this.balanceDisplay.textContent = this.currencyFormatter.format(this.balance);
        this.renderTransactions();
    }

    renderTransactions() {
        if (this.transactions.length === 0) {
            this.transactionList.innerHTML = '<div class="empty-state">No transactions yet</div>';
            return;
        }

        this.transactionList.innerHTML = this.transactions.map(t => {
            const isDeposit = t.type === 'deposit';
            const icon = isDeposit ? '↓' : '↑';
            const title = isDeposit ? 'Deposit' : 'Withdrawal';
            const amountPrefix = isDeposit ? '+' : '-';
            
            return `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-icon ${t.type}">
                            ${icon}
                        </div>
                        <div class="transaction-details">
                            <h4>${title}</h4>
                            <p>${this.formatDate(t.date)}</p>
                        </div>
                    </div>
                    <div class="transaction-amount ${t.type}">
                        ${amountPrefix}${this.currencyFormatter.format(t.amount)}
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new BankApp();
});
