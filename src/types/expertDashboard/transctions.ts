
export interface Transaction {
    tx_id: number;
    action: string;
    amount_cents: number;
    minutes: number | null;
    transaction_date: string;
    booking_id: number;
    status: string;
    start_time: string;
    booking_minutes: number;
    expert_id: number;
    client_name: string;
    package_name: string;
}

export interface TransactionsResponse {
    data: Transaction[];
    total: number;
    status: boolean;
    message: string;
}

export type TransactionStatus = "pending" | "ongoing" | "confirmed" | "canceled" | "all";