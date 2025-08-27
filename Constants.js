  // Mock knowledge base for RAG
  export const knowledgeBase = {
    products: [
      { id: 1, name: "Wireless Bluetooth Headphones", category: "Electronics", price: 79.99, description: "Premium quality wireless headphones with noise cancellation", stock: 150 },
      { id: 2, name: "Organic Cotton T-Shirt", category: "Clothing", price: 24.99, description: "Comfortable organic cotton t-shirt, eco-friendly", stock: 200 },
      { id: 3, name: "Smart Fitness Tracker", category: "Electronics", price: 149.99, description: "Advanced fitness tracker with heart rate monitor", stock: 85 },
      { id: 4, name: "Artisan Coffee Beans", category: "Food & Beverage", price: 18.99, description: "Premium roasted coffee beans from sustainable farms", stock: 120 },
      { id: 5, name: "Yoga Mat", category: "Sports", price: 39.99, description: "Non-slip yoga mat, eco-friendly material", stock: 75 }
    ],
    policies: [
      { topic: "Returns", content: "30-day return policy for all items in original condition. Refunds processed within 3-5 business days." },
      { topic: "Shipping", content: "Free shipping on orders over $50. Standard delivery 3-5 days, Express delivery 1-2 days." },
      { topic: "Warranty", content: "Electronics come with 1-year manufacturer warranty. Clothing has 90-day quality guarantee." },
      { topic: "Loyalty Program", content: "Earn 1 point per $1 spent. 100 points = $5 reward. Gold status at 1000 points annually." }
    ],
    legal: [
      { topic: "Privacy Policy", content: "We collect minimal personal data and never share with third parties without consent." },
      { topic: "Terms of Service", content: "By using our service, you agree to our terms including dispute resolution through arbitration." },
      { topic: "GDPR Compliance", content: "EU customers have right to data portability, deletion, and access under GDPR regulations." },
      { topic: "Refund Policy", content: "Full refunds available within 30 days. Partial refunds may apply for used items." }
    ],
    accounting: [
      { topic: "Invoice Template", content: "Standard invoice includes: Invoice #, Date, Customer info, Items, Tax, Total, Payment terms NET 30." },
      { topic: "Tax Rates", content: "Standard sales tax 8.5%. Digital products 6%. Food items exempt in most jurisdictions." },
      { topic: "Payment Terms", content: "B2B customers: NET 30. Retail customers: Payment on delivery or advance payment." },
      { topic: "Expense Categories", content: "Marketing, Operations, Inventory, Staff, Technology, Legal, Facilities." }
    ],
    customers: [
      { id: 1, name: "John Smith", email: "john@email.com", loyaltyPoints: 450, tier: "Silver", orders: 8 },
      { id: 2, name: "Sarah Johnson", email: "sarah@email.com", loyaltyPoints: 1200, tier: "Gold", orders: 15 },
      { id: 3, name: "Mike Chen", email: "mike@email.com", loyaltyPoints: 200, tier: "Bronze", orders: 3 }
    ]
  };