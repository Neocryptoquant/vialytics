from typing import Dict, Optional

class LabelService:
    def __init__(self):
        # Simple lookup for known addresses
        self.labels: Dict[str, str] = {
            "So11111111111111111111111111111111111111112": "Wrapped SOL",
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "USDC",
            "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "USDT",
            "Vote111111111111111111111111111111111111111": "Vote Account",
            "11111111111111111111111111111111": "System Program",
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA": "Token Program",
            "AssociatedTokenAccountProgram": "ATA Program",
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4": "Jupiter Aggregator",
            "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium Liquidity Pool V4",
        }

    def get_label(self, address: str) -> str:
        # Default to truncated address if not known
        return self.labels.get(address, f"{address[:4]}...{address[-4:]}")
    
    def is_known_platform(self, address: str) -> bool:
        return address in self.labels

_label_service = LabelService()

def get_label_service() -> LabelService:
    return _label_service
