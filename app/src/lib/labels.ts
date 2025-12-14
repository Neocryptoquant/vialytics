/**
 * Frontend label service for Solana addresses.
 * Provides friendly names for known addresses.
 */

// 0xAbim: known token mints and programs for frontend display
const KNOWN_LABELS: Record<string, string> = {
    // Tokens
    "So11111111111111111111111111111111111111112": "SOL",
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "USDC",
    "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "USDT",
    "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": "mSOL",
    "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": "stSOL",
    "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": "BONK",
    "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "JUP",
    "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr": "POPCAT",
    "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3": "PYTH",
    "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R": "RAY",

    // DeFi
    "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4": "Jupiter",
    "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium",
    "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc": "Orca",
    "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD": "Marinade",

    // Programs
    "11111111111111111111111111111111": "System",
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA": "Token Program",
};

/**
 * Get a friendly label for an address, or shorten it if unknown.
 */
export function getLabel(address: string): string {
    if (!address) return "Unknown";
    return KNOWN_LABELS[address] ?? shortenAddress(address);
}

/**
 * Shorten a Solana address for display.
 */
export function shortenAddress(address: string, chars: number = 4): string {
    if (!address) return "";
    if (address.length <= chars * 2 + 3) return address;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Check if an address is known.
 */
export function isKnownAddress(address: string): boolean {
    return address in KNOWN_LABELS;
}

/**
 * Get Helius Orb explorer URL for an address.
 */
export function getOrbUrl(address: string): string {
    return `https://orb.helius.dev/address/${address}`;
}
