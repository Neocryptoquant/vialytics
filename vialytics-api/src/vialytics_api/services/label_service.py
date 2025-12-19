from typing import Dict, Optional

class LabelService:
    """Service for labeling known Solana addresses with friendly names."""
    
    def __init__(self):
        # 0xAbim: expanded list of known addresses for better UX
        self.labels: Dict[str, str] = {
            # Native tokens
            "So11111111111111111111111111111111111111112": "Wrapped SOL",
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "USDC",
            "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "USDT",
            "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": "mSOL",
            "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": "stSOL",
            "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": "BONK",
            "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "JUP",
            "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr": "POPCAT",
            "WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk": "WEN",
            
            # System programs
            "Vote111111111111111111111111111111111111111": "Vote Program",
            "11111111111111111111111111111111": "System Program",
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA": "Token Program",
            "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL": "ATA Program",
            "ComputeBudget111111111111111111111111111111": "Compute Budget",
            
            # DeFi protocols - Jupiter
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4": "Jupiter",
            "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB": "Jupiter V4",
            "JUP2jxvXaqu7NQY1GmNF4m1vodw12LVXYxbFL2uJvfo": "Jupiter V2",
            
            # DeFi protocols - DEXes
            "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium AMM",
            "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK": "Raydium CLMM",
            "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc": "Orca Whirlpool",
            "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP": "Orca Swap",
            "MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky": "Mercurial",
            "SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ": "Saber",
            
            # Lending & Staking
            "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD": "Marinade",
            "KLend2g3cP87ber5aNc1eQC6z7D8aaSHrEpYB8sHvek": "Kamino Lending",
            "DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1": "Drift",
            "PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY": "Phoenix",
            "6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc": "Solend",
            
            # NFT programs
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s": "Metaplex",
            "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K": "Magic Eden",
            "TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN": "Tensor Swap",
            "TCMPhJdwDryooaGtiocG1u3xcYbRpiJzb283XfCZsDp": "Tensor Compressed",
            "hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk": "Haus (NFT)",
            
            # Infrastructure
            "jito1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX": "Jito",
            "BNswQ54RR5xVFP4xLu2c1zJBH5RxaJ8n7HMdCYzMzPJR": "Birdeye",
        }

    def get_label(self, address: str) -> str:
        """Get label for address, or shortened version if unknown."""
        if not address:
            return "Unknown"
        return self.labels.get(address, f"{address[:4]}...{address[-4:]}")
    
    def is_known_platform(self, address: str) -> bool:
        """Check if address is a known platform/program."""
        return address in self.labels


_label_service = LabelService()


def get_label_service() -> LabelService:
    return _label_service

