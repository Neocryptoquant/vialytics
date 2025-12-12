from abc import ABC, abstractmethod
from typing import Dict, Optional
import requests
import time

class AbstractPriceService(ABC):
    @abstractmethod
    def get_price(self, token_mint: str, currency: str = "USD") -> float:
        pass

class CoinGeckoPriceService(AbstractPriceService):
    def __init__(self):
        self.base_url = "https://api.coingecko.com/api/v3"
        self.cache: Dict[str, tuple[float, float]] = {}
        self.cache_ttl = 300
        
        self.mint_to_coingecko_id = {
            "So11111111111111111111111111111111111111112": "solana",
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "usd-coin",
            "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "tether",
            "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": "bonk",
            "METAewgxyPbgwsseH8T16a39CQ5VyVxZi9zXiDPY18m": "metaplex",
            "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R": "raydium",
        }

    def get_price(self, token_mint: str, currency: str = "USD") -> float:
        coingecko_id = self.mint_to_coingecko_id.get(token_mint)
        if not coingecko_id:
            return 0.0
        
        now = time.time()
        if coingecko_id in self.cache:
            price, timestamp = self.cache[coingecko_id]
            if now - timestamp < self.cache_ttl:
                return price
        
        try:
            url = f"{self.base_url}/simple/price"
            params = {
                "ids": coingecko_id,
                "vs_currencies": currency.lower()
            }
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            price = data.get(coingecko_id, {}).get(currency.lower(), 0.0)
            self.cache[coingecko_id] = (price, now)
            return price
            
        except Exception as e:
            print(f"Error fetching price for {coingecko_id}: {e}")
            return 0.0

class StaticPriceService(AbstractPriceService):
    def __init__(self):
        self.prices: Dict[str, float] = {
            "So11111111111111111111111111111111111111112": 136.00,
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": 1.00,
            "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": 1.00,
            "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R": 1.25,
            "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": 0.00002,
        }

    def get_price(self, token_mint: str, currency: str = "USD") -> float:
        return self.prices.get(token_mint, 0.0)

_price_service = CoinGeckoPriceService()

def get_price_service() -> AbstractPriceService:
    return _price_service
