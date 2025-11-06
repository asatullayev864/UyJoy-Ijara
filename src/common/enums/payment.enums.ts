// To‘lov holati
export enum PaymentStatus {
    paid = "paid",            // to‘lov to‘liq qilingan
    canceled = "canceled",    // bekor qilingan
    pending = "pending"       // to‘lov kutilmoqda
}

// To‘lov usuli
export enum PaymentMethod {
    cash = "cash",
    card = "card",
    online = "online",
}