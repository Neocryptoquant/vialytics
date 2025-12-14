"""
Helius API client for wallet enrichment.
Uses correct Helius API endpoints:
- Base: https://api-mainnet.helius-rpc.com  
- DAS: JSON-RPC methods (getAssetsByOwner)
- Transactions: /v0/addresses/{address}/transactions
"""
import os
import time
import logging
from typing import Any, Dict, List, Optional

import requests

from vialytics_api.services.label_service import get_label_service

HELIUS_API_KEY = os.environ.get("HELIUS_API_KEY")
# 0xAbim: correct Helius base URL
HELIUS_BASE = os.environ.get("HELIUS_ORB_URL", "https://api-mainnet.helius-rpc.com")

logger = logging.getLogger(__name__)


class SimpleTTLCache:
    """In-memory cache with TTL expiration."""
    def __init__(self):
        self._store: Dict[str, tuple] = {}

    def get(self, key: str) -> Optional[Any]:
        item = self._store.get(key)
        if not item:
            return None
        expiry, value = item
        if time.time() > expiry:
            del self._store[key]
            return None
        return value

    def set(self, key: str, value: Any, ttl: int):
        self._store[key] = (time.time() + ttl, value)


class HeliusClient:
    """Client for Helius API enrichment."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        self.api_key = api_key or HELIUS_API_KEY
        self.base = base_url or HELIUS_BASE
        self.cache = SimpleTTLCache()
        self.label_service = get_label_service()

    def _rpc_call(self, method: str, params: Any, timeout: int = 10) -> Optional[Any]:
        """Make a JSON-RPC call to Helius DAS API."""
        url = f"{self.base}?api-key={self.api_key}" if self.api_key else self.base
        payload = {
            "jsonrpc": "2.0",
            "id": "vialytics",
            "method": method,
            "params": params
        }
        start = time.time()
        try:
            r = requests.post(url, json=payload, timeout=timeout)
            r.raise_for_status()
            data = r.json()
            logger.info(f"Helius RPC {method}: {(time.time()-start)*1000:.0f}ms")
            if "error" in data:
                logger.error(f"Helius RPC error: {data['error']}")
                return None
            return data.get("result")
        except Exception as e:
            logger.error(f"Helius RPC error ({method}): {e}")
            return None

    def _get(self, path: str, params: Optional[Dict[str, Any]] = None, timeout: int = 8) -> Optional[Any]:
        """Make a REST GET call to Helius API."""
        url = f"{self.base}{path}"
        params = params or {}
        if self.api_key:
            params["api-key"] = self.api_key
        start = time.time()
        try:
            r = requests.get(url, params=params, timeout=timeout)
            r.raise_for_status()
            logger.info(f"Helius GET {path}: {(time.time()-start)*1000:.0f}ms")
            return r.json()
        except requests.exceptions.HTTPError as e:
            logger.warning(f"Helius HTTP {e.response.status_code}: {path}")
            return None
        except Exception as e:
            logger.error(f"Helius error: {e}")
            return None

    def fetch_enrichment(self, address: str, use_cache: bool = True) -> Dict[str, Any]:
        """Fetch enrichment data for wallet address."""
        cache_key = f"helius:{address}"
        if use_cache:
            cached = self.cache.get(cache_key)
            if cached:
                logger.debug(f"Cache hit: {address[:8]}...")
                return cached

        result: Dict[str, Any] = {"fetched_at": int(time.time()), "source": "helius"}

        # 1) Get assets using DAS API (tokens + NFTs)
        assets = self._rpc_call("getAssetsByOwner", {
            "ownerAddress": address,
            "page": 1,
            "limit": 100,
            "displayOptions": {"showFungible": True, "showNativeBalance": True}
        })
        if assets:
            result["assets"] = assets

        # 2) Get transaction history
        txs = self._get(f"/v0/addresses/{address}/transactions", params={"limit": 100})
        if txs:
            result["transactions"] = txs if isinstance(txs, list) else []

        # Build normalized data for frontend
        normalized = self._normalize_data(result, address)
        result["normalized"] = normalized

        # Cache for 5 minutes
        self.cache.set(cache_key, result, ttl=300)
        return result

    def _normalize_data(self, result: Dict[str, Any], address: str) -> Dict[str, Any]:
        """Normalize Helius data for frontend consumption."""
        normalized: Dict[str, Any] = {}

        # Extract token balances from DAS assets
        assets = result.get("assets", {})
        items = assets.get("items", []) if isinstance(assets, dict) else []
        
        token_balances = []
        nfts = []
        
        for item in items:
            interface = item.get("interface", "")
            content = item.get("content", {})
            metadata = content.get("metadata", {})
            
            if interface in ["FungibleToken", "FungibleAsset"]:
                # Token
                token_info = item.get("token_info", {})
                symbol = token_info.get("symbol") or metadata.get("symbol") or "Unknown"
                balance = token_info.get("balance", 0)
                decimals = token_info.get("decimals", 9)
                price_info = token_info.get("price_info", {})
                
                ui_amount = balance / (10 ** decimals) if decimals else balance
                usd_value = price_info.get("total_price", 0)
                
                token_balances.append({
                    "mint": item.get("id"),
                    "symbol": symbol,
                    "ui_amount": ui_amount,
                    "usd_value": usd_value,
                })
            elif interface in ["ProgrammableNFT", "V1_NFT", "V2_NFT"]:
                # NFT
                nfts.append({
                    "mint": item.get("id"),
                    "name": metadata.get("name", "Unknown NFT"),
                    "image": content.get("files", [{}])[0].get("uri") if content.get("files") else None,
                })
        
        # Add native SOL balance if present
        native_balance = assets.get("nativeBalance", {})
        if native_balance:
            lamports = native_balance.get("lamports", 0)
            sol_amount = lamports / 1e9
            price = native_balance.get("price_per_sol", 0)
            token_balances.insert(0, {
                "mint": "So11111111111111111111111111111111111111112",
                "symbol": "SOL",
                "ui_amount": sol_amount,
                "usd_value": sol_amount * price,
            })
        
        normalized["token_balances"] = token_balances
        normalized["nfts"] = nfts[:10]  # Limit NFTs

        # Process transactions for counterparties
        txs = result.get("transactions", [])
        cp_map: Dict[str, float] = {}
        
        for tx in txs[:100]:
            # Extract counterparty and value
            fee_payer = tx.get("feePayer")
            native_transfers = tx.get("nativeTransfers", [])
            
            for transfer in native_transfers:
                from_addr = transfer.get("fromUserAccount")
                to_addr = transfer.get("toUserAccount")
                amount = transfer.get("amount", 0) / 1e9  # Convert lamports
                
                if from_addr == address and to_addr:
                    cp_map[to_addr] = cp_map.get(to_addr, 0) + amount
                elif to_addr == address and from_addr:
                    cp_map[from_addr] = cp_map.get(from_addr, 0) + amount

        # Top counterparties
        cps = sorted(cp_map.items(), key=lambda x: x[1], reverse=True)[:10]
        normalized["top_counterparties"] = [
            {"address": a, "label": self.label_service.get_label(a), "usd_volume": v}
            for a, v in cps
        ]

        return normalized


# Module-level client
_default_client: Optional[HeliusClient] = None


def get_default_client() -> HeliusClient:
    global _default_client
    if _default_client is None:
        _default_client = HeliusClient()
    return _default_client
