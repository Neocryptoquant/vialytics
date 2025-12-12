import json
import sqlite3
from datetime import datetime
from collections import defaultdict
from typing import Dict, List, Any, Optional

from vialytics_api.core.database import get_db_connection
from vialytics_api.services.price_service import get_price_service
from vialytics_api.services.label_service import get_label_service

class WalletAnalyzer:
    def __init__(self, db_path: Optional[str] = None):
        self.conn = get_db_connection(db_path)
        self.price_service = get_price_service()
        self.label_service = get_label_service()

    def analyze(self) -> Dict[str, Any]:
        """Main entry point to generate all analytics categories."""
        txs = self._fetch_all_transactions()
        movements = self._fetch_all_token_movements()
        
        # Pre-process data
        tx_map = {tx['signature']: tx for tx in txs}
        
        return {
            "portfolio_overview": self._generate_portfolio_overview(movements),
            "earnings_spending": self._generate_earnings_spending(movements),
            "token_insights": self._generate_token_insights(movements),
            "activity_insights": self._generate_activity_insights(txs),
            "income_streams": self._generate_income_streams(movements),
            "spending_categories": self._generate_spending_categories(txs, movements),
            "interactions": self._generate_interactions(movements),
            "security": self._generate_security_checks(txs, movements),
            "highlights": self._generate_highlights(txs, movements)
        }

    def _fetch_all_transactions(self) -> List[sqlite3.Row]:
        cur = self.conn.cursor()
        cur.execute("SELECT * FROM transactions ORDER BY block_time ASC")
        return cur.fetchall()

    def _fetch_all_token_movements(self) -> List[sqlite3.Row]:
        cur = self.conn.cursor()
        cur.execute("SELECT * FROM token_movements ORDER BY block_time ASC")
        return cur.fetchall()

    def _generate_portfolio_overview(self, movements: List[sqlite3.Row]) -> Dict[str, Any]:
        # Calculate current holdings by summing up all movements
        # Assuming we start from 0
        holdings = defaultdict(int) 
        
        for mov in movements:
            amount = mov['amount']
            mint = mov['mint']
            holdings[mint] += amount

        total_balance_usd = 0.0
        top_tokens = []
        
        for mint, raw_amount in holdings.items():
            # TODO: Get decimals from somewhere. For now assuming based on mint or standard
            # Ideally decimals should be in token_movements 
            decimals = 9 if mint == "So11111111111111111111111111111111111111112" else 6 
            # In real app we need a token metadata service
            
            ui_amount = raw_amount / (10 ** decimals)
            price = self.price_service.get_price(mint)
            value_usd = ui_amount * price
            
            if ui_amount > 0: # Only positive balances
                total_balance_usd += value_usd
                top_tokens.append({
                    "symbol": self.label_service.get_label(mint), # Should use metadata service for symbol
                    "amount": ui_amount,
                    "value_usd": value_usd,
                    "share_percent": 0 # Calc later
                })

        # Calculate percentages
        for token in top_tokens:
            if total_balance_usd > 0:
                token['share_percent'] = (token['value_usd'] / total_balance_usd) * 100

        top_tokens.sort(key=lambda x: x['value_usd'], reverse=True)

        return {
            "total_balance_usd": round(total_balance_usd, 2),
            "total_balance_history": [], # Placeholder for now
            "top_tokens": top_tokens[:5]
        }

    def _generate_earnings_spending(self, movements: List[sqlite3.Row]) -> Dict[str, Any]:
        total_received_usd = 0.0
        total_sent_usd = 0.0
        biggest_incoming = {"value": 0, "label": "None"}
        biggest_outgoing = {"value": 0, "label": "None"}
        
        tx_count = 0
        total_tx_value = 0
        
        for mov in movements:
            amount = mov['amount']
            mint = mov['mint']
            decimals = 9 if mint == "So11111111111111111111111111111111111111112" else 6
            price = self.price_service.get_price(mint)
            
            ui_amount = abs(amount) / (10 ** decimals)
            usd_value = ui_amount * price
            
            if usd_value > 0:
                total_tx_value += usd_value
                tx_count += 1
            
            if amount > 0:
                total_received_usd += usd_value
                if usd_value > biggest_incoming['value']:
                    biggest_incoming = {"value": usd_value, "label": f"Received {self.label_service.get_label(mint)}"}
            elif amount < 0:
                total_sent_usd += usd_value
                if usd_value > biggest_outgoing['value']:
                    biggest_outgoing = {"value": usd_value, "label": f"Sent {self.label_service.get_label(mint)}"}

        return {
            "total_received_usd": round(total_received_usd, 2),
            "total_sent_usd": round(total_sent_usd, 2),
            "net_flow": round(total_received_usd - total_sent_usd, 2),
            "biggest_incoming": biggest_incoming,
            "biggest_outgoing": biggest_outgoing,
            "average_transaction_size": round(total_tx_value / tx_count, 2) if tx_count > 0 else 0
        }

    def _generate_token_insights(self, movements: List[sqlite3.Row]) -> List[Dict[str, Any]]:
        # Simplified token insights
        # Focusing on top tokens
        tokens_map = defaultdict(lambda: {"received": 0, "sent": 0, "balance": 0})
        
        for mov in movements:
            mint = mov['mint']
            amount = mov['amount']
            # Again, assuming decimals...
            decimals = 9 if mint == "So11111111111111111111111111111111111111112" else 6
            ui_amount = amount / (10 ** decimals)
            
            tokens_map[mint]["balance"] += ui_amount
            if ui_amount > 0:
                tokens_map[mint]["received"] += ui_amount
            else:
                tokens_map[mint]["sent"] += abs(ui_amount)
                
        results = []
        for mint, data in tokens_map.items():
            if data['balance'] > 0 or data['received'] > 0:
                results.append({
                    "token": self.label_service.get_label(mint),
                    "mint": mint,
                    "current_holdings": data['balance'],
                    "total_received": data['received'],
                    "total_sent": data['sent']
                })
        return results

    def _generate_activity_insights(self, txs: List[sqlite3.Row]) -> Dict[str, Any]:
        if not txs:
            return {}
            
        timestamps = [tx['block_time'] for tx in txs if tx['block_time']]
        if not timestamps:
            return {}
            
        first_date = datetime.fromtimestamp(min(timestamps))
        last_date = datetime.fromtimestamp(max(timestamps))
        
        # Active days
        active_days = set(datetime.fromtimestamp(ts).date() for ts in timestamps)
        
        # Monthly frequency
        months = defaultdict(int)
        for ts in timestamps:
            dt = datetime.fromtimestamp(ts)
            months[dt.strftime("%Y-%m")] += 1
            
        return {
            "total_transactions": len(txs),
            "first_activity": first_date.strftime("%Y-%m-%d"),
            "last_activity": last_date.strftime("%Y-%m-%d"),
            "active_days_count": len(active_days),
            "monthly_frequency": dict(months)
        }

    def _generate_income_streams(self, movements: List[sqlite3.Row]) -> Dict[str, Any]:
        # Heuristic: Check source of incoming funds
        sources = defaultdict(float)
        
        for mov in movements:
            if mov['amount'] > 0 and mov['source']:
                label = self.label_service.get_label(mov['source'])
                mint = mov['mint']
                decimals = 9 if mint == "So11111111111111111111111111111111111111112" else 6
                price = self.price_service.get_price(mint)
                value = (mov['amount'] / (10**decimals)) * price
                sources[label] += value
                
        sorted_sources = sorted(sources.items(), key=lambda x: x[1], reverse=True)
        return {
            "top_income_sources": [{"source": k, "value_usd": round(v, 2)} for k, v in sorted_sources[:5]]
        }

    def _generate_spending_categories(self, txs: List[sqlite3.Row], movements: List[sqlite3.Row]) -> Dict[str, Any]:
        # Simple heuristic mapping
        categories = defaultdict(float)
        
        # Fee calculation
        total_fees = sum(tx['fee'] for tx in txs) / 10**9 * self.price_service.get_price("So11111111111111111111111111111111111111112")
        categories["Network Fees"] = total_fees
        
        return {
            "top_spending_categories": [{"category": k, "value_usd": round(v, 2)} for k, v in categories.items()]
        }

    def _generate_interactions(self, movements: List[sqlite3.Row]) -> Dict[str, Any]:
        interactions = defaultdict(int)
        for mov in movements:
            if mov['amount'] < 0 and mov['destination']:
                 label = self.label_service.get_label(mov['destination'])
                 interactions[label] += 1
                 
        sorted_interactions = sorted(interactions.items(), key=lambda x: x[1], reverse=True)
        return {
            "top_apps_platforms": [{"name": k, "count": v} for k, v in sorted_interactions[:5]]
        }

    def _generate_security_checks(self, txs: List[sqlite3.Row], movements: List[sqlite3.Row]) -> Dict[str, Any]:
        failed_txs = len([tx for tx in txs if not tx['status']])
        return {
            "failed_transactions_count": failed_txs,
            "security_score": "High" if failed_txs < 5 else "Medium"
        }

    def _generate_highlights(self, txs: List[sqlite3.Row], movements: List[sqlite3.Row]) -> Dict[str, str]:
        return {
            "wallet_personality": "Hodler", # Placeholder logic
            "top_moment": "You made your biggest trade!"
        }

import sqlite3
